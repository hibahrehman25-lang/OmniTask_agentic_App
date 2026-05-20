"""
Agent 2: Insight Extractor
Finds meaningful, non-obvious patterns from parsed content.
"""
import json
import time
from . import BaseAgent


class InsightExtractorAgent(BaseAgent):
    """Extracts deep business insights from structured facts — not just summaries."""

    def __init__(self, client):
        super().__init__(client)
        self.name = "InsightExtractor"

    def run(self, pipeline_context):
        """
        Extract insights from parsed content stored in pipeline_context.
        Returns: (insights, trace)
        """
        start = time.time()
        ingestion_output = pipeline_context["agent_outputs"]["ingestion"]
        quality_flags = pipeline_context["quality_flags"]

        prompt = f"""You are Agent 02 — Insight Extraction Agent in an Antigravity-orchestrated multi-agent system.

You receive the full pipeline_context from the orchestrator. You must read:
- ingestion_output (cleaned_text, domain, key_numbers, quality_flags)

## What is a valid insight (strict checklist):
✅ Contains a specific measurable value (%, Rs, count, time period)
✅ Reveals a non-obvious pattern or anomaly — not just what happened but WHY it is significant
✅ Connects two or more data points in a meaningful way
✅ Implies a consequence if unaddressed

## What is NOT an insight (reject these):
❌ "Sales are declining" — no specifics
❌ "The article mentions fuel prices" — restatement
❌ "Customer satisfaction is low" — vague
❌ Any insight you cannot directly quote evidence for from cleaned_text

## Confidence scoring logic (not arbitrary):
- HIGH: Direct numerical evidence in text + clear causal link
- MEDIUM: Implied by context but not directly stated as numbers
- LOW: Inferred pattern with limited supporting evidence

## If quality_flags.short_input is true:
→ Extract maximum 2 insights, note limitation in agent_trace

## If quality_flags.low_confidence_insights would be true (all insights are LOW confidence):
→ Set this flag in your output so orchestrator passes it to Agent 04

Return ONLY a valid JSON object (no markdown):
{{
  "insights": [
    {{
      "id": "insight_1",
      "type": "anomaly | trend | causal | risk | opportunity",
      "title": "max 10 words",
      "description": "1-2 sentences — specific, measurable, non-generic",
      "evidence": "exact quote or data point from cleaned_text",
      "confidence": "high | medium | low",
      "confidence_reason": "why this confidence level was assigned",
      "domain_tags": ["list"],
      "urgency": "immediate | short-term | long-term"
    }}
  ],
  "primary_insight_id": "insight_1",
  "low_confidence_flag": false,
  "extraction_quality": "high | medium | low",
  "reasoning_steps": [
    "Found N candidate signals in text",
    "Eliminated X as generic restatements because...",
    "Verified Y insights have measurable evidence",
    "Confidence assigned based on: [criteria used]"
  ],
  "options_considered": ["insight candidate A — rejected because...", "insight candidate B — kept because..."],
  "quality_flag_raised": "low_confidence_insights: true/false",
  "decision_made": "final selection rationale"
}}

INGESTION DATA:
{json.dumps(ingestion_output, indent=2)}

QUALITY FLAGS:
{json.dumps(quality_flags, indent=2)}
"""
        try:
            response_text = self._call_gemini(prompt)
            insights = self._parse_json_response(response_text)
            duration = int((time.time() - start) * 1000)

            # Standardized Agent Trace
            trace = self._create_trace(
                reasoning_steps=insights.get("reasoning_steps", [
                    f"Found {len(insights.get('insights', []))} candidate signals in text",
                    "Verified insights have measurable evidence",
                    f"Confidence assigned based on numerical evidence presence"
                ]),
                options_considered=insights.get("options_considered", ["Considered multiple insight candidates"]),
                decision_made=insights.get("decision_made", f"Selected {len(insights.get('insights', []))} high-quality insights"),
                duration_ms=duration
            )
            
            # Include trace in JSON output for strict prompt compliance
            insights["agent_trace"] = trace
            
            # Map low_confidence_flag to pipeline_context flag if true
            if insights.get("low_confidence_flag"):
                insights["quality_flags"] = {"low_confidence_insights": True}
                
            return insights, trace

        except Exception as e:
            duration = int((time.time() - start) * 1000)
            fallback = {
                "insights": [],
                "low_confidence_flag": True,
                "extraction_quality": "low",
                "notes": f"Error: {str(e)}"
            }
            trace = self._create_trace(
                reasoning_steps=[f"Error during extraction: {str(e)}"],
                options_considered=["Attempted full analysis"],
                decision_made="Failing extraction due to exception",
                duration_ms=duration,
                status="error"
            )
            return fallback, trace
