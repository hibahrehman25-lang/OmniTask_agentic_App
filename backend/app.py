"""
Autonomous Content-to-Action Agent — Flask API Server
Main entry point that orchestrates the 5-agent pipeline.
"""
import os
import json
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

from database import Database
from agents import (
    ContentParserAgent,
    InsightExtractorAgent,
    ImpactAnalyzerAgent,
    ActionGeneratorAgent,
    ActionSimulatorAgent,
    ReportAgent,
    MasterOrchestrator
)
from simulation import MockCRM, MockNotificationSystem, MockDashboard

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Gemini client
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize database
db = Database()

# Initialize mock simulation systems
mock_crm = MockCRM()
mock_notifications = MockNotificationSystem()
mock_dashboard = MockDashboard()

# Initialize all agents
agents = {
    "ingestion": ContentParserAgent(gemini_client),
    "insights": InsightExtractorAgent(gemini_client),
    "impact": ImpactAnalyzerAgent(gemini_client),
    "actions": ActionGeneratorAgent(gemini_client),
    "simulation": ActionSimulatorAgent(gemini_client, mock_crm, mock_notifications, mock_dashboard),
    "report": ReportAgent(gemini_client)
}

# Initialize Antigravity Orchestrator
orchestrator = MasterOrchestrator(gemini_client, agents)


@app.route("/", methods=["GET"])
def index():
    """Root endpoint to verify server is running."""
    return jsonify({
        "message": "InsightAI Backend is Running",
        "endpoints": {
            "health": "/api/health",
            "analyze": "/api/analyze (POST)",
            "history": "/api/history",
            "scenarios": "/api/sample-scenarios"
        },
        "status": "online"
    })


@app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return jsonify({"status": "healthy", "service": "Insight Action Agent", "version": "1.2.0 (6-Agent Pipeline)"})


@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    Main analysis endpoint.
    Runs the full Antigravity-orchestrated agent pipeline.
    """
    data = request.get_json()
    if not data or ("text" not in data and "file" not in data):
        return jsonify({"status": "error", "message": "Missing 'text' or 'file' field"}), 400

    input_text = data.get("text", "").strip()
    file_data = data.get("file")
    file_type = data.get("file_type")

    # Structured payload for the orchestrator
    orchestrator_input = {
        "text": input_text,
        "file": file_data,
        "file_type": file_type
    }
    
    # Run the orchestrator
    pipeline_result = orchestrator.run(orchestrator_input)
    
    # Extract results for backward compatibility and saving
    context = pipeline_result["pipeline_context"]
    outputs = context["agent_outputs"]
    
    result = {
        "status": "success" if pipeline_result["final_status"] == "success" else "partial",
        "orchestrator_log": pipeline_result["orchestrator_log"],
        "pipeline_context": context,
        # Flattened for existing frontend expectations
        "content_parsed": outputs["ingestion"],
        "insights": outputs["insights"],
        "impact": outputs["impact"],
        "recommended_actions": outputs["actions"],
        "simulation": outputs["simulation"],
        "report": outputs["report"],
        "agent_trace": context["agent_traces"],
        "metadata": {
            "run_id": context["run_id"],
            "duration_ms": context["total_duration_ms"],
            "timestamp": context["started_at"]
        }
    }

    # Save to database
    analysis_id = db.save_analysis(
        input_text=input_text,
        results=outputs,
        agent_trace=context["agent_traces"],
        domain=context["domain"] or "business"
    )
    result["analysis_id"] = analysis_id

    return jsonify(result)


@app.route("/api/history", methods=["GET"])
def get_history():
    """Get analysis history."""
    history = db.get_history(limit=20)
    return jsonify({"status": "success", "history": history})


@app.route("/api/analysis/<int:analysis_id>", methods=["GET"])
def get_analysis(analysis_id):
    """Get a specific analysis by ID."""
    analysis = db.get_analysis(analysis_id)
    if analysis:
        return jsonify({"status": "success", "analysis": analysis})
    return jsonify({"status": "error", "message": "Analysis not found"}), 404


@app.route("/api/sample-scenarios", methods=["GET"])
def get_sample_scenarios():
    """Return pre-built sample scenarios for demo purposes."""
    scenarios = [
        {
            "id": 1,
            "title": "Sales Crisis — Lahore Region",
            "description": "Regional sales decline with rising complaints",
            "text": "Monthly Sales Report - May 2026: The Lahore region has experienced a significant 30% decline in sales over the past quarter, dropping from PKR 45M to PKR 31.5M. Customer complaints have surged by 45%, primarily related to delivery delays and product quality issues. Our main competitor, FastTrack Solutions, has opened 3 new distribution centers in the region and is offering 20% discounts. Customer retention rate has fallen from 85% to 67%. The support team is overwhelmed with 150+ tickets daily, up from the usual 80. Employee morale in the Lahore sales office is reportedly low, with 4 resignations in the past month."
        },
        {
            "id": 2,
            "title": "Supply Chain Disruption",
            "description": "Fuel price hike impacting logistics",
            "text": "Breaking News Alert: Government announces 15% increase in fuel prices effective immediately. Transport and logistics companies report a projected 22% rise in operational costs. Major retailers are considering passing costs to consumers with 8-12% price increases. The Pakistan Truckers Association warns of potential supply disruptions in remote areas. Current inventory levels across major warehouses are at 65% capacity, down from the standard 85%. Import clearance times have increased by 3 days on average due to new customs procedures. Food and essential goods supply chains are most vulnerable, with cold chain logistics costs expected to rise by 30%."
        },
        {
            "id": 3,
            "title": "New Import Tariff Policy",
            "description": "Government policy change on electronics",
            "text": "Policy Update: The Federal Board of Revenue has announced new import tariffs on electronics, effective June 1, 2026. Key changes include: 25% duty on imported smartphones (up from 15%), 20% duty on laptops and tablets (up from 10%), 30% duty on luxury electronics and gaming consoles. Local manufacturers are expected to benefit, with Pakistan's domestic electronics production capacity currently at 40% utilization. The Pakistan Electronics Manufacturers Association projects a 35% increase in domestic sales. However, consumer groups warn this could increase smartphone prices by PKR 15,000-30,000, potentially affecting the 65% of the population that relies on budget smartphones. E-commerce platforms report pre-announcement panic buying has increased electronics orders by 200% this week."
        }
    ]
    return jsonify({"status": "success", "scenarios": scenarios})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print("\n" + "=" * 60)
    print("  [*] Insight Action Agent - Backend Server")
    print(f"  [>] Running on port {port}")
    print("  [i] Endpoints:")
    print("     POST /api/analyze        - Run agent pipeline")
    print("     GET  /api/health         - Health check")
    print("     GET  /api/history        - Analysis history")
    print("     GET  /api/analysis/<id>  - Get specific analysis")
    print("     GET  /api/sample-scenarios - Demo scenarios")
    print("=" * 60 + "\n")
    app.run(host="0.0.0.0", port=port, debug=False)
