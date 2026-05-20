import requests
import json

url = "http://localhost:5000/api/analyze"
payload = {
    "text": "Monthly Sales Report - May 2026: The Lahore region has experienced a significant 30% decline in sales over the past quarter, dropping from PKR 45M to PKR 31.5M. Customer complaints have surged by 45%, primarily related to delivery delays and product quality issues."
}

try:
    response = requests.post(url, json=payload)
    data = response.json()
    
    print("\n--- AGENT TRACE CHECK ---")
    for trace in data.get("agent_trace", []):
        print(f"\nAgent: {trace.get('agent_name')}")
        print(f"Reasoning Steps: {trace.get('reasoning_steps')}")
        print(f"Options Considered: {trace.get('options_considered')}")
        print(f"Decision Made: {trace.get('decision_made')}")
        print(f"Duration: {trace.get('duration_hint')}")
    
    print("\n--- ORCHESTRATOR LOG CHECK ---")
    for log in data.get("orchestrator_log", []):
        print(f"[{log.get('timestamp')}] {log.get('decision')}")

except Exception as e:
    print(f"Error: {e}")
