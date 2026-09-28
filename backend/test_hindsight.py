import time

from app.hindsight_memory import remember, recall


print("Storing test memory...")

remember(
    "Our Product & Strategy AI Assistant analyzes customer feedback, "
    "competitor intelligence, and meeting strategy information.",
    context="Product Strategy Assistant"
)

print("Memory stored successfully.")

print("\nWaiting for Hindsight processing...")
time.sleep(10)

print("\nRecalling memory...")

memories = recall(
    "What does our Product & Strategy AI Assistant analyze?"
)

print("\nRetrieved memories:")

for memory in memories:
    print("-", memory)