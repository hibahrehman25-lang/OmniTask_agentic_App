"""
Master Orchestrator Agent
Orchestrates the multi-agent pipeline and carries the shared pipeline_context.
"""
import time
import uuid
import json
from . import BaseAgent


class MasterOrchestrator(BaseAgent):
    """
    MASTER ORCHESTRATOR of an Autonomous Content-to-Action Agentic AI System.
    Manages the sequence, context, and quality of the agentic pipeline.
    """

    def __init__(self, client, agents):
        super().__init__(client)
        self.name = "AntigravityOrchestrator"
        self.agents = agents
        self.orchestrator_log = []

    def log_decision(self, message):
        """Log a decision made by the orchestrator."""
        self.orchestrator_log.append({
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "decision": message
        })

    def run(self, raw_input):
        """
        Execute the full pipeline.
        """
        start_time = time.time()
        run_id = str(uuid.uuid4())
        
        # Safely handle dictionary vs string inputs
        if isinstance(raw_input, dict):
            summary_text = raw_input.get("text", "")
            if not summary_text and raw_input.get("file"):
                summary_text = f"[Attached File: {raw_input.get('file_type', 'document')}]"
        else:
            summary_text = str(raw_input)

        # Initialize Shared pipeline_context object
        context = {
            "run_id": run_id,
            "started_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "input_summary": summary_text[:100] + "..." if len(summary_text) > 100 else summary_text,
            "domain": None,
            "quality_flags": {
                "low_confidence_insights": False,
                "ambiguous_domain": False,
                "short_input": False,
                "non_english": False
            },
            "agent_outputs": {
                "ingestion": None,
                "insights": None,
                "impact": None,
                "actions": None,
                "simulation": None
            },
            "agent_traces": [],
            "errors": []
        }

        self.log_decision(f"Initialized pipeline run {run_id}")

        # Pipeline order (strict):
        # Agent 01: Ingestion
        # Agent 02: Insights
        # Agent 03: Impact
        # Agent 04: Actions
        # Agent 05: Simulation

        pipeline_steps = [
            ("ingestion", self.agents.get("ingestion")),
            ("insights", self.agents.get("insights")),
            ("impact", self.agents.get("impact")),
            ("actions", self.agents.get("actions")),
            ("simulation", self.agents.get("simulation")),
            ("report", self.agents.get("report"))
        ]

        for step_name, agent in pipeline_steps:
            if not agent:
                error_msg = f"Missing agent for step: {step_name}"
                self.log_decision(error_msg)
                context["errors"].append(error_msg)
                break

            self.log_decision(f"Starting execution for Agent: {agent.name}")
            
            try:
                # Execute agent with context
                # Note: ContentParser (Agent 1) takes raw_input, others take context or specific outputs
                if step_name == "ingestion":
                    output, trace = agent.run(raw_input)
                else:
                    output, trace = agent.run(context)

                # Update context
                context["agent_outputs"][step_name] = output
                context["agent_traces"].append(trace)

                # Update quality flags if returned by agent
                if "quality_flags" in output:
                    context["quality_flags"].update(output["quality_flags"])
                
                if "domain" in output and not context["domain"]:
                    context["domain"] = output["domain"]

                # Handle failures
                if output.get("ingestion_status") == "failed":
                    self.log_decision(f"Pipeline STOPPED: Ingestion failed.")
                    break
                
                # Check for low confidence insights
                if step_name == "insights" and output.get("confidence", 1.0) < 0.6:
                    context["quality_flags"]["low_confidence_insights"] = True
                    self.log_decision("Flagged low confidence insights. Action Generator will be notified.")

            except Exception as e:
                error_msg = f"Error in agent {step_name}: {str(e)}"
                self.log_decision(error_msg)
                context["errors"].append(error_msg)
                # Retry logic could go here if needed
                break

        total_duration = int((time.time() - start_time) * 1000)
        context["total_duration_ms"] = total_duration
        
        self.log_decision(f"Pipeline completed in {total_duration}ms")

        return {
            "orchestrator_log": self.orchestrator_log,
            "pipeline_context": context,
            "final_status": "success" if not context["errors"] else "partial_failure"
        }
