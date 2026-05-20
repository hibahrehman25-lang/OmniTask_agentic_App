import os
import base64
import json
from dotenv import load_dotenv
from google import genai
import sys

sys.path.append(r'c:\Users\User\Desktop\google\insight-action-agent\backend')
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

load_dotenv(r'c:\Users\User\Desktop\google\insight-action-agent\backend\.env')
client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))

agents = {
    "ingestion": ContentParserAgent(client),
    "insights": InsightExtractorAgent(client),
    "impact": ImpactAnalyzerAgent(client),
    "actions": ActionGeneratorAgent(client),
    "simulation": ActionSimulatorAgent(client, MockCRM(), MockNotificationSystem(), MockDashboard()),
    "report": ReportAgent(client)
}

orchestrator = MasterOrchestrator(client, agents)

with open(r'c:\Users\User\Desktop\google\insight-action-agent\test.csv', 'rb') as f:
    b64_data = base64.b64encode(f.read()).decode('utf-8')

raw_input = {
    'text': '',
    'file': b64_data,
    'file_type': 'csv'
}

print("Running pipeline...")
try:
    result = orchestrator.run(raw_input)
    print("FINAL STATUS:", result["final_status"])
    print("ERRORS:", result["pipeline_context"]["errors"])
    
    # print insights
    insights = result["pipeline_context"]["agent_outputs"].get("insights")
    print("INSIGHTS:", json.dumps(insights, indent=2))
except Exception as e:
    import traceback
    traceback.print_exc()
