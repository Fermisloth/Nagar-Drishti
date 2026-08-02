import json
import asyncio
import os
import sys

# Ensure app root is on path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.gemini_service import gemini_service
from evaluation.metrics import calculate_accuracy

async def run_benchmark():
    dataset_path = os.path.join(os.path.dirname(__file__), "gold_dataset.json")
    with open(dataset_path, "r", encoding="utf-8") as f:
        gold_data = json.load(f)

    predictions = []
    print(f"Running benchmark on {len(gold_data)} gold samples...")

    for sample in gold_data:
        raw_text = sample["raw_text"]
        extracted = await gemini_service.extract_metadata(raw_text)
        predictions.append(extracted.model_dump())

    results = calculate_accuracy(predictions, gold_data)
    print("\n--- BENCHMARK RESULTS ---")
    print(json.dumps(results, indent=2))
    return results

if __name__ == "__main__":
    asyncio.run(run_benchmark())
