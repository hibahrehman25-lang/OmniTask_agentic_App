import os
import base64
import json
import traceback
from dotenv import load_dotenv
from google import genai
import sys

sys.path.append(r'c:\Users\User\Desktop\google\insight-action-agent\backend')
from agents import ContentParserAgent

load_dotenv(r'c:\Users\User\Desktop\google\insight-action-agent\backend\.env')

client = genai.Client(api_key=os.getenv('GEMINI_API_KEY'))
agent = ContentParserAgent(client)

try:
    with open(r'c:\Users\User\Desktop\google\insight-action-agent\test.csv', 'rb') as f:
        b64_data = base64.b64encode(f.read()).decode('utf-8')

    raw_input = {
        'text': '',
        'file': b64_data,
        'file_type': 'csv'
    }

    print("Running agent.run()...")
    output, trace = agent.run(raw_input)
    print('OUTPUT:', json.dumps(output, indent=2))
except Exception as e:
    print('ERROR:', e)
    traceback.print_exc()
