"""
Agent 4: Action Generator
Generates specific, prioritized action recommendations based on insights and impact.
"""
import json
import time
from . import BaseAgent


class ActionGeneratorAgent(BaseAgent):
    """Generates actionable business recommendations with priority rankings."""

    def __init__(self, client):
        super().__init__(client)
        self.name = "ActionGenerator"

    def run(self, pipeline_context):
        """
        Generate recommended actions based on insights and impact analysis.
        Returns: (actions, trace)
        """
        start = time.time()
        insights_data = pipeline_context["agent_outputs"]["insights"]
        impact_data = pipeline_context["agent_outputs"]["impact"]
        quality_flags = pipeline_context["quality_flags"]

        # Check for low confidence insights flag
        low_confidence = quality_flags.get("low_confidence_insights", False)
        
        prompt = f"""You are Agent 04 — Action Generation Agent in an Antigravity-orchestrated multi-agent system.

You receive the full pipeline_context. You must read:
- insights_data (all insights + low_confidence_flag)
- impact_data (severity scores, stakeholders, time_sensitivity)
- quality_flags.low_confidence_insights (from orchestrator)

## CRITICAL: If low_confidence_insights flag is TRUE:
→ Generate CONSERVATIVE actions only (investigation, monitoring, data gathering)
→ Do NOT generate aggressive execution actions like campaigns or price changes
→ Note this in agent_trace

## Action quality checklist (every action must pass):
✅ Names a specific system or tool that would be used (CRM, pricing module, email system)
✅ Has a measurable expected outcome (not "improve sales" but "10-15% order recovery")
✅ Has a realistic owner (specific role, not "management")
✅ Timeline is proportional to time_sensitivity from Agent 03
✅ Action type matches domain (no irrelevant actions)

## Confidence scoring for actions:
- HIGH: Directly addresses primary insight + high-severity impact + proven action type
- MEDIUM: Partially addresses insight OR medium severity
- LOW: Indirect connection to insight OR low severity OR depends on unavailable data

## Action types by domain:
- business → campaign, pricing adjustment, team redeployment, customer outreach
- logistics → route optimization, supplier contact, inventory reorder, SLA revision
- finance → budget reallocation, risk hedge, alert threshold change
- policy → compliance update, process revision, stakeholder notification
- energy → procurement contract review, cost-pass-through pricing update

Return ONLY a valid JSON object (no markdown):
{{
  "recommended_actions": [
    {{
      "rank": 1,
      "action_id": "action_1",
      "title": "short action name",
      "description": "2-3 sentences — specific, realistic, domain-relevant",
      "owner": "specific role",
      "timeline": "within X hours/days",
      "tools_required": ["CRM", "Email System"],
      "expected_outcome": "specific measurable result",
      "action_type": "campaign | investigation | pricing | notification | reorder | other",
      "is_primary": true,
      "confidence": "high | medium | low",
      "confidence_reason": "why this confidence"
    }}
  ],
  "decision_rationale": "why these actions, why this ranking",
  "primary_action_id": "action_1",
  "conservative_mode_active": {"true" if low_confidence else "false"},
  "agent_trace": {{
    "agent": "ActionGenerator",
    "reasoning_steps": [
      "Read primary insight: [title]",
      "Impact severity: [score], time_sensitivity: [value]",
      "low_confidence_flag was: [true/false] — affected action type: [how]",
      "Generated N candidate actions",
      "Ranked based on: [criteria]",
      "Primary action selected because: [reason]"
    ],
    "options_considered": ["action A — not chosen because...", "action B — chosen because..."],
    "conservative_mode": {"true" if low_confidence else "false"}
  }}
}}

INSIGHTS DATA:
{json.dumps(insights_data, indent=2)}

IMPACT DATA:
{json.dumps(impact_data, indent=2)}

QUALITY FLAGS:
{json.dumps(quality_flags, indent=2)}
"""
        try:
            response_text = self._call_gemini(prompt)
            actions = self._parse_json_response(response_text)
            duration = int((time.time() - start) * 1000)

            # Standardized Agent Trace
            agent_trace_data = actions.get("agent_trace", {})
            trace = self._create_trace(
                reasoning_steps=agent_trace_data.get("reasoning_steps", [
                    f"Generated {len(actions.get('recommended_actions', []))} actions",
                    f"Applied {'conservative' if low_confidence else 'standard'} strategy",
                    "Validated actions against domain-specific types"
                ]),
                options_considered=agent_trace_data.get("options_considered", ["Considered multiple action candidates"]),
                decision_made=actions.get("decision_rationale", "Finalized action plan"),
                duration_ms=duration
            )
            
            # Include trace in JSON output for strict prompt compliance
            actions["agent_trace"] = trace
            
            return actions, trace

        except Exception as e:
            duration = int((time.time() - start) * 1000)
            fallback = {
                "recommended_actions": [],
                "decision_rationale": f"Error: {str(e)}",
                "conservative_mode_active": low_confidence
            }
            trace = self._create_trace(
                reasoning_steps=[f"Error during action generation: {str(e)}"],
                options_considered=["Attempted full generation"],
                decision_made="Failing generation due to exception",
                duration_ms=duration,
                status="error"
            )
            return fallback, trace
