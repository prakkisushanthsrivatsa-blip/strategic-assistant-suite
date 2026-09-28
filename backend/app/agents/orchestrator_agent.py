import os
import json

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def route_request(user_input: str):
    prompt = f"""
You are the Orchestrator Agent for a Product & Strategy AI Assistant.

Your job is to determine which specialist AI agents are required
to answer the user's request.

Available agents:

1. feedback
   - Customer complaints
   - Pain points
   - Severity
   - Customer experience issues

2. competitor
   - Competitors
   - Pricing
   - Features
   - Strengths and weaknesses
   - Market opportunities

3. strategy
   - Meeting notes
   - Decisions
   - Action items
   - Owners
   - Deadlines
   - Risks
   - Strategic recommendations

User request:

{user_input}

Return ONLY valid JSON in exactly this format:

{{
  "agents": ["feedback"],
  "reason": "short explanation of why these agents were selected"
}}

The "agents" field may contain one or more of:

"feedback"
"competitor"
"strategy"

Choose only the agents that are relevant.

Do not include markdown.
Do not include ```json.
Return only valid JSON.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.1
    )

    result = response.choices[0].message.content

    try:
        return json.loads(result)

    except json.JSONDecodeError:
        return {
            "agents": [],
            "reason": "Unable to determine the required agents."
        }