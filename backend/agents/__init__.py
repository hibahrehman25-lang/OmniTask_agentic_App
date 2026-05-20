"""
Agent pipeline for the Autonomous Content-to-Action system.
Each agent performs one step in the analysis chain.
"""
import json
import time


class BaseAgent:
    """Base class for all agents in the pipeline."""

    def __init__(self, client):
        self.client = client
        self.name = self.__class__.__name__

    def _call_gemini(self, prompt, model="gemini-3.1-flash-lite"):
        """Call the Gemini API and return the text response."""
        response = self.client.models.generate_content(
            model=model,
            contents=prompt
        )
        return response.text

    def _parse_json_response(self, text):
        """Parse JSON from Gemini response, handling markdown code blocks."""
        text = text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1] if "\n" in text else text[3:]
            if text.endswith("```"):
                text = text[:-3].strip()
        return json.loads(text)

    def _create_trace(self, reasoning_steps, options_considered, decision_made, duration_ms, status="success"):
        """Create a standardized trace log entry as required by competition rules."""
        return {
            "agent_name": self.name,
            "reasoning_steps": reasoning_steps if isinstance(reasoning_steps, list) else [reasoning_steps],
            "options_considered": options_considered if isinstance(options_considered, list) else [options_considered],
            "decision_made": decision_made,
            "duration_hint": f"{duration_ms}ms",
            "status": status,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

    def run(self, *args, **kwargs):
        raise NotImplementedError("Subclasses must implement run()")


from .content_parser import ContentParserAgent
from .insight_extractor import InsightExtractorAgent
from .impact_analyzer import ImpactAnalyzerAgent
from .action_generator import ActionGeneratorAgent
from .action_simulator import ActionSimulatorAgent
from .report_agent import ReportAgent
from .orchestrator import MasterOrchestrator

__all__ = [
    'BaseAgent',
    'ContentParserAgent',
    'InsightExtractorAgent',
    'ImpactAnalyzerAgent',
    'ActionGeneratorAgent',
    'ActionSimulatorAgent',
    'ReportAgent',
    'MasterOrchestrator'
]
