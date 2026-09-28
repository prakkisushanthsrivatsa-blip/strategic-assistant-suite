import os
import json

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_competitors(competitor_data: str):
    prompt = f"""
You are a Competitor Intelligence Agent for a Product & Strategy AI Assistant.

Analyze the following competitor information:

{competitor_data}

Return ONLY valid JSON in exactly this structure:

{{
  "summary": "short overall market summary",

  "competitors": [
    {{
      "name": "competitor name",
      "features": ["feature 1", "feature 2"],
      "pricing": "pricing information or Not specified",
      "strengths": ["strength 1", "strength 2"],
      "weaknesses": ["weakness 1", "weakness 2"]
    }}
  ],

  "opportunities": [
    "market opportunity 1",
    "market opportunity 2"
  ],

  "strategic_actions": [
    "recommended strategic action 1",
    "recommended strategic action 2"
  ]
}}

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
        temperature=0.2
    )

    result = response.choices[0].message.content

    try:
        return json.loads(result)
    except json.JSONDecodeError:
        return {
            "summary": result,
            "competitors": [],
            "opportunities": [],
            "strategic_actions": []
        }