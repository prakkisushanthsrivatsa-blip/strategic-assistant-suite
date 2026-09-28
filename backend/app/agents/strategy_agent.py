import os
import json

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_strategy(meeting_text: str):
    prompt = f"""
You are a Meeting and Strategy Agent for a Product & Strategy AI Assistant.

Analyze the following meeting transcript or meeting notes:

{meeting_text}

Return ONLY valid JSON in exactly this structure:

{{
  "summary": "short meeting summary",

  "decisions": [
    "decision 1",
    "decision 2"
  ],

  "action_items": [
    {{
      "task": "task description",
      "owner": "person responsible or Not specified",
      "deadline": "deadline or Not specified"
    }}
  ],

  "risks": [
    "risk or concern 1",
    "risk or concern 2"
  ],

  "strategic_recommendations": [
    "recommendation 1",
    "recommendation 2"
  ]
}}

If an owner or deadline is not mentioned, use "Not specified".

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
            "decisions": [],
            "action_items": [],
            "risks": [],
            "strategic_recommendations": []
        }