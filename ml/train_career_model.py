"""Train and evaluate the career matcher from labeled skill profiles.

Input JSONL format:
{"career": "Data Analyst", "skills": ["Python", "SQL", "Statistics"]}

The trainer is dependency-free so it can run in the project environment:
    python ml/train_career_model.py train data.jsonl ml/career_skills.csv
    python ml/train_career_model.py evaluate data.jsonl ml/career_skills.csv

For trustworthy accuracy, data.jsonl must contain real labeled examples and
evaluation should use data that was not used to fit the exported model.
"""
from __future__ import annotations

import csv
import json
import math
import random
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Iterable


def normalize(value: str) -> str:
    aliases = {"node": "node.js", "rest": "rest apis", "powerbi": "power bi"}
    return aliases.get(value.strip().casefold(), value.strip().casefold())


def load_examples(path: Path) -> list[dict[str, object]]:
    examples = []
    with path.open(encoding="utf-8") as handle:
        for line_number, line in enumerate(handle, 1):
            if not line.strip():
                continue
            item = json.loads(line)
            career = str(item.get("career", "")).strip()
            skills = [normalize(str(skill)) for skill in item.get("skills", []) if str(skill).strip()]
            if not career or not skills:
                raise ValueError(f"{path}:{line_number} requires career and skills")
            examples.append({"career": career, "skills": sorted(set(skills))})
    if not examples:
        raise ValueError(f"{path} contains no labeled examples")
    return examples


def train(examples: Iterable[dict[str, object]]) -> dict[str, dict[str, float]]:
    rows = list(examples)
    career_counts: Counter[str] = Counter(str(row["career"]) for row in rows)
    document_frequency: Counter[str] = Counter()
    career_skill_counts: dict[str, Counter[str]] = defaultdict(Counter)
    for row in rows:
        career = str(row["career"])
        skills = {normalize(str(skill)) for skill in row["skills"]}
        document_frequency.update(skills)
        career_skill_counts[career].update(skills)

    career_total = len(career_counts)
    model: dict[str, dict[str, float]] = {}
    for career, counts in career_skill_counts.items():
        total = sum(counts.values())
        model[career] = {}
        for skill, count in counts.items():
            idf = math.log((career_total + 1) / (document_frequency[skill] + 1)) + 1
            model[career][skill] = round((count / total) * idf, 6)
    return model


def predict(skills: Iterable[str], model: dict[str, dict[str, float]]) -> str:
    known = {normalize(skill) for skill in skills}
    ranked = sorted(
        ((sum(weight for skill, weight in requirements.items() if normalize(skill) in known), career)
         for career, requirements in model.items()),
        reverse=True,
    )
    return ranked[0][1] if ranked else ""


def evaluate(examples: list[dict[str, object]], model: dict[str, dict[str, float]]) -> dict[str, float]:
    correct = sum(predict(row["skills"], model) == row["career"] for row in examples)
    return {"examples": len(examples), "top1_accuracy": round(correct / len(examples), 4) if examples else 0.0}


def write_model(model: dict[str, dict[str, float]], path: Path) -> None:
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(["career", "skill", "weight"])
        for career, requirements in sorted(model.items()):
            for skill, weight in sorted(requirements.items()):
                writer.writerow([career, skill, weight])


def load_model(path: Path) -> dict[str, dict[str, float]]:
    model: dict[str, dict[str, float]] = defaultdict(dict)
    with path.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            model[row["career"]][normalize(row["skill"])] = float(row["weight"])
    return dict(model)


def main() -> None:
    if len(sys.argv) < 3 or sys.argv[1] not in {"train", "evaluate"}:
        raise SystemExit("Usage: train_career_model.py train|evaluate examples.jsonl model.csv [seed]")
    examples_path = Path(sys.argv[2])
    examples = load_examples(examples_path)
    if sys.argv[1] == "train":
        output = Path(sys.argv[3]) if len(sys.argv) > 3 else Path("ml/career_skills.csv")
        write_model(train(examples), output)
        print(json.dumps({"trained_examples": len(examples), "careers": len(set(row["career"] for row in examples)), "output": str(output)}))
        return
    model = load_model(Path(sys.argv[3]) if len(sys.argv) > 3 else Path("ml/career_skills.csv"))
    print(json.dumps(evaluate(examples, model)))


if __name__ == "__main__":
    main()
