import os
import json

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_feedback(feedback: str):
    prompt = f"""
You are a Customer Feedback Agent.

Analyze this customer feedback:

{feedback}

Return ONLY valid JSON in exactly this structure:

{{
  "summary": "short overall summary",
  "pain_points": [
    {{
      "problem": "problem description",
      "severity": "High/Medium/Low",
      "frequency": "Frequent/Occasional/Unknown"
    }}
  ],
  "recommendations": [
    "recommendation 1",
    "recommendation 2"
  ],
  "priority": "High/Medium/Low"
}}

Do not include markdown.
Do not include ```json.
Return only JSON.
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
            "pain_points": [],
            "recommendations": [],
            "priority": "Unknown"
        }