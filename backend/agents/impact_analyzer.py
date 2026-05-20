"""
Agent 3: Impact Analyzer
Analyzes business impact of each insight — severity, risk, and affected areas.
"""
import json
import time
from . import BaseAgent


class ImpactAnalyzerAgent(BaseAgent):
    """Quantifies the business impact of extracted insights."""

    def __init__(self, client):
        super().__init__(client)
        self.name = "ImpactAnalyzer"

    def run(self, pipeline_context):
        """
        Analyze impact of insights on business operations.
        Returns: (impact_data, trace)
        """
        start = time.time()
        ingestion_output = pipeline_context["agent_outputs"]["ingestion"]
        insights = pipeline_context["agent_outputs"]["insights"]

        prompt = f"""You are Agent 03 — Impact Analysis Agent in an Antigravity-orchestrated multi-agent system.

You receive the full pipeline_context. You must read:
- ingestion_output (domain, key_numbers, quality_flags)
- insights (all insights, confidence levels, urgency)

## Impact analysis rules:
- Base ALL impact assessments on actual data from key_numbers — do NOT invent percentages
- If no financial data in input → financial_implication must be null, explain in trace why
- Severity score logic (not arbitrary):
  * 5 = Business operations halted or major legal risk
  * 4 = Revenue loss >20% or critical customer impact
  * 3 = Revenue loss 10-20% or moderate operational disruption
  * 2 = Minor inefficiency or recoverable short-term loss
  * 1 = Informational only, no immediate consequence

## Stakeholder mapping by domain:
- business → sales team, regional manager, customers, board
- logistics → warehouse manager, drivers, procurement team
- finance → CFO, investors, risk team
- policy → compliance officer, operations head, legal team
- energy → procurement, fleet manager, finance

Return ONLY a valid JSON object (no markdown):
{{
  "impact_analyses": [
    {{
      "insight_id": "insight_1",
      "immediate_impact": "specific consequence if no action today",
      "downstream_impact": "what escalates in 1-4 weeks",
      "severity_score": 1-5,
      "severity_label": "critical | high | medium | low",
      "severity_reason": "why this score was chosen",
      "stakeholders_affected": ["list"],
      "time_sensitivity": "urgent | moderate | low",
      "financial_implication": "estimated amount or null",
      "financial_basis": "how this was calculated or null",
      "confidence": "high | medium | low"
    }}
  ],
  "overall_risk_level": "critical | high | medium | low",
  "primary_impact_id": "insight_1",
  "reasoning_steps": [
    "Read N insights from Agent 02",
    "Severity assigned to insight_X because: [specific logic]",
    "Stakeholders identified based on domain: [domain]",
    "Financial implication: [estimated/null and why]",
    "Time sensitivity set to urgent/moderate/low because: [reason]"
  ],
  "assumptions_made": ["list any assumptions"],
  "data_used": ["exact numbers from key_numbers used in analysis"]
}}

INGESTION DATA:
{json.dumps(ingestion_output, indent=2)}

INSIGHTS:
{json.dumps(insights, indent=2)}
"""
        try:
            response_text = self._call_gemini(prompt)
            impact = self._parse_json_response(response_text)
            duration = int((time.time() - start) * 1000)

            trace = self._create_trace(
                reasoning_steps=impact.get("reasoning_steps", [
                    f"Analyzed {len(impact.get('impact_analyses', []))} insights",
                    "Mapped stakeholders by domain",
                    "Calculated severity using standard logic"
                ]),
                options_considered=impact.get("assumptions_made", ["Considered varying impact scopes"]),
                decision_made=f"Assigned overall risk level: {impact.get('overall_risk_level')}",
                duration_ms=duration
            )
            
            # Include trace in JSON output for strict prompt compliance
            impact["agent_trace"] = trace
            
            return impact, trace

        except Exception as e:
            duration = int((time.time() - start) * 1000)
            fallback = {
                "impact_analyses": [],
                "overall_risk_level": "medium",
                "analysis_notes": f"Error during analysis: {str(e)}"
            }
            trace = self._create_trace(
                reasoning_steps=[f"Error: {str(e)}"],
                options_considered=["Attempted full impact analysis"],
                decision_made="Using fallback impact values",
                duration_ms=duration,
                status="error"
            )
            return fallback, trace
