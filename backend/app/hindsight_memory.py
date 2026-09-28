import os

from dotenv import load_dotenv
from hindsight_client import Hindsight


load_dotenv()


HINDSIGHT_BANK_ID = os.getenv(
    "HINDSIGHT_BANK_ID",
    "product-strategy-assistant-local"
)


client = Hindsight(
    base_url="http://localhost:8888"
)


def remember(content: str, context: str = None):
    return client.retain(
        bank_id=HINDSIGHT_BANK_ID,
        content=content,
        context=context
    )


def recall(query: str):
    result = client.recall(
        bank_id=HINDSIGHT_BANK_ID,
        query=query,
        include_entities=False
    )

    return [
        memory.text
        for memory in result.results
    ]