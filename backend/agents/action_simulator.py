"""
Agent 5: Action Simulator
Executes the top recommended action in mock business systems.
Shows before/after state and execution logs.
"""
import json
import time
from . import BaseAgent


class ActionSimulatorAgent(BaseAgent):
    """Simulates executing business actions in mock CRM, notification, and dashboard systems."""

    def __init__(self, client, mock_crm, mock_notifications, mock_dashboard):
        super().__init__(client)
        self.name = "ActionSimulator"
        self.crm = mock_crm
        self.notifications = mock_notifications
        self.dashboard = mock_dashboard

    def run(self, pipeline_context):
        """
        Simulate executing the top priority action using Gemini for realistic projections.
        Returns: (simulation_result, trace)
        """
        start = time.time()
        
        ingestion = pipeline_context["agent_outputs"]["ingestion"]
        actions_output = pipeline_context["agent_outputs"]["actions"]
        impact = pipeline_context["agent_outputs"]["impact"]
        
        primary_action_id = actions_output.get("primary_action_id")
        recommended_actions = actions_output.get("recommended_actions", [])
        
        if not recommended_actions:
            trace = self._create_trace(
                reasoning_steps=["No actions provided for simulation"],
                options_considered=["Skip"],
                decision_made="Skipped simulation",
                duration_ms=0,
                status="skipped"
            )
            return {"status": "skipped", "message": "No actions to simulate"}, trace

        # Identify the primary action to simulate
        top_action = next((a for a in recommended_actions if a.get("action_id") == primary_action_id), recommended_actions[0])

        # Prepare Before State for Gemini from actual mock systems
        before_state = {
            "crm": self.crm.get_state(),
            "dashboard": self.dashboard.get_state()
        }

        prompt = f"""You are Agent 05 — Action Simulation Agent in an Antigravity-orchestrated multi-agent system.

You receive the full pipeline_context. You must read:
- primary_action_id: {primary_action_id}
- recommended_actions: {json.dumps(recommended_actions, indent=2)}
- impact_data: {json.dumps(impact, indent=2)}
- ingestion_key_numbers: {json.dumps(ingestion.get('key_numbers'), indent=2)}

## CRITICAL: Realistic state simulation rules
- Before state MUST use actual numbers from ingestion_key_numbers where available. Current system state: {json.dumps(before_state, indent=2)}
- After state MUST show realistic projected change — not wishful thinking
  * Campaign → orders +10 to +20%, not +100%
  * Price update → delivery cost changes by actual announced % 
  * Notification → reach = realistic audience size based on context
- All mock API calls must use realistic endpoint naming for the domain
- Execution log must have minimum 6 steps (not 4)

## Persistent state simulation (write these as if DB was updated):
You must output a "db_state_change" object showing:
- Table/collection name
- Row/document identifier
- Exact fields changed
- Old values → new values

## Notification draft rules:
- Must be complete — full email/SMS body, not placeholder text
- Subject line must reference specific insight (not generic)
- Body must include actual numbers from analysis

## Execution log format:
Each step must have: step number, timestamp (HH:MM:SS), action description, result, status (ok/warning/error)
Minimum steps: validate input → authenticate → read current state → execute action → write new state → confirm → notify

Return ONLY a valid JSON object (no markdown):
{{
  "simulation_id": "sim_{int(time.time())}",
  "action_id": "{top_action.get('action_id')}",
  "action_title": "{top_action.get('title')}",
  "executed_at": "{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}",
  "status": "success",
  "mock_api_call": {{
    "method": "POST",
    "endpoint": "/api/v1/actions/execute",
    "payload": {{ "action": "...", "parameters": {{}} }},
    "response": {{ "status": 200, "body": {{ "result": "ok" }} }},
    "latency_ms": 120
  }},
  "notification_draft": {{
    "channel": "email",
    "to": "stakeholders@company.com",
    "subject": "string",
    "body": "string",
    "timestamp": "{time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())}",
    "estimated_reach": 100
  }},
  "db_state_change": {{
    "table": "string",
    "record_id": "string",
    "fields_changed": {{
      "field_name": {{ "before": "old", "after": "new" }}
    }}
  }},
  "state_change": {{
    "entity": "Campaign | Task",
    "before": {{}},
    "after": {{}}
  }},
  "execution_log": [
    {{ "step": 1, "timestamp": "HH:MM:SS", "action": "Validate input", "result": "Input validated", "status": "ok" }},
    {{ "step": 2, "timestamp": "HH:MM:SS", "action": "Authenticate", "result": "Token verified", "status": "ok" }},
    {{ "step": 3, "timestamp": "HH:MM:SS", "action": "Read state", "result": "Current values fetched", "status": "ok" }},
    {{ "step": 4, "timestamp": "HH:MM:SS", "action": "Execute action", "result": "System update applied", "status": "ok" }},
    {{ "step": 5, "timestamp": "HH:MM:SS", "action": "Write state", "result": "DB commit successful", "status": "ok" }},
    {{ "step": 6, "timestamp": "HH:MM:SS", "action": "Notify", "result": "Draft sent to queue", "status": "ok" }}
  ],
  "projected_outcome": {{
    "metric": "string",
    "baseline": "string",
    "projected": "string",
    "timeframe": "string",
    "confidence": "high"
  }},
  "agent_trace": {{
    "agent": "ActionSimulator",
    "reasoning_steps": [
      "Primary action identified: [action title]",
      "Before state constructed from: [source of data]",
      "After state projected based on: [logic used]",
      "Mock API endpoint chosen because: [reason]",
      "Notification channel chosen because: [reason]"
    ],
    "simulation_assumptions": ["list realistic assumptions made"],
    "realism_checks": ["verified outcome % is realistic", "verified audience size is realistic"]
  }},
  "simulation_notes": "string"
}}
"""
        try:
            response_text = self._call_gemini(prompt)
            simulation = self._parse_json_response(response_text)
            
            # Sync with actual mock systems to make simulation "real"
            self._sync_mock_systems(simulation)
            
            duration = int((time.time() - start) * 1000)

            # Standardized Agent Trace
            agent_trace_data = simulation.get("agent_trace", {})
            trace = self._create_trace(
                reasoning_steps=agent_trace_data.get("reasoning_steps", [
                    f"Simulated execution of: {top_action.get('title')}",
                    "Generated realistic before/after state projections",
                    "Performed mock database state change",
                    "Created complete notification draft"
                ]),
                options_considered=agent_trace_data.get("options_considered", ["Considered multiple impact levels"]),
                decision_made=f"Simulation {simulation.get('status')} - Projected: {simulation.get('projected_outcome', {}).get('projected')}",
                duration_ms=duration
            )
            
            # Include trace in JSON output for strict prompt compliance
            simulation["agent_trace"] = trace
            
            return simulation, trace

        except Exception as e:
            duration = int((time.time() - start) * 1000)
            fallback = {
                "status": "failed",
                "message": f"Simulation error: {str(e)}"
            }
            trace = self._create_trace(
                reasoning_steps=[f"Error during simulation: {str(e)}"],
                options_considered=["Attempted realistic projection"],
                decision_made="Failing simulation due to exception",
                duration_ms=duration,
                status="error"
            )
            return fallback, trace

    def _sync_mock_systems(self, simulation):
        """Updates the actual mock systems based on Gemini's simulation plan."""
        try:
            db_change = simulation.get("db_state_change", {})
            state_change = simulation.get("state_change", {})
            
            # Update Dashboard if metrics were changed
            if db_change.get("table") == "dashboard_metrics":
                for field, val in db_change.get("fields_changed", {}).items():
                    if isinstance(val.get("after"), (int, float)):
                        self.dashboard.update_metric(field, val["after"], operation="set")
            
            # Update CRM if tasks or campaigns were created
            entity = state_change.get("entity", "").lower()
            if "task" in entity:
                self.crm.create_task(
                    title=simulation.get("action_title", "Simulated Task"),
                    assigned_to="Operations",
                    priority="HIGH"
                )
            elif "campaign" in entity:
                self.crm.create_campaign(
                    name=simulation.get("action_title", "Simulated Campaign"),
                    target_segment="General"
                )
        except Exception:
            pass # Sync is best-effort

    def _empty_result(self, reason):
        return {
            "status": "skipped",
            "reason": reason,
            "success": False
        }
