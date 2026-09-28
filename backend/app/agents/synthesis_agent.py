import os
import json

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def synthesize_results(user_query: str, agent_results: dict):

    prompt = f"""
You are the Final Synthesis Agent for a Product & Strategy AI Assistant.

Your job is to combine the outputs from multiple specialist AI agents
and produce one clear executive-level business analysis.

USER QUERY:

{user_query}


SPECIALIST AGENT RESULTS:

{json.dumps(agent_results, indent=2)}


Return ONLY valid JSON in exactly this structure:

{{
  "executive_summary": "A concise summary of the overall situation.",

  "key_findings": [
    "Important finding 1",
    "Important finding 2",
    "Important finding 3"
  ],

  "recommended_actions": [
    "Recommended action 1",
    "Recommended action 2",
    "Recommended action 3"
  ],

  "priority": "High/Medium/Low",

  "risks": [
    "Important risk 1",
    "Important risk 2"
  ]
}}

Rules:

- Combine information from the specialist agents.
- Do not simply repeat their outputs.
- Identify connections between customer feedback, competitors,
  meetings, and strategy when relevant.
- Recommendations must be practical and business-oriented.
- Do not invent facts that are not present in the input.
- If there is insufficient information for a section, return an empty list.
- Priority must be High, Medium, or Low.
- Keep the executive summary concise.
- Do not include markdown.
- Do not include ```json.
- Return only valid JSON.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    result = response.choices[0].message.content

    try:
        return json.loads(result)

    except json.JSONDecodeError:

        return {
            "executive_summary": result,
            "key_findings": [],
            "recommended_actions": [],
            "priority": "Medium",
            "risks": []
        }