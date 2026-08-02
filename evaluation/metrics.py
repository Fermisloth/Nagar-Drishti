from typing import List, Dict, Any

def calculate_accuracy(predictions: List[Dict[str, Any]], gold_standards: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Computes accuracy metrics comparing predicted extractions against gold standards.
    """
    total = len(gold_standards)
    if total == 0:
        return {"accuracy": 0.0, "department_accuracy": 0.0}

    dept_matches = 0
    issue_matches = 0

    for pred, gold in zip(predictions, gold_standards):
        if pred.get("department", "").strip().lower() == gold.get("expected_department", "").strip().lower():
            dept_matches += 1
        if pred.get("issue_type", "").strip().lower() == gold.get("expected_issue_type", "").strip().lower():
            issue_matches += 1

    return {
        "total_samples": total,
        "department_accuracy": round(dept_matches / total, 4),
        "issue_type_accuracy": round(issue_matches / total, 4),
    }
