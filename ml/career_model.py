"""Small, dependency-free career scoring model.

It uses the checked-in skills dataset and weighted cosine-style overlap. This
is deterministic for local development and can later be served behind an API
without changing the frontend contract.
"""
from __future__ import annotations

import csv
from collections import defaultdict
from pathlib import Path

DATASET = Path(__file__).with_name("career_skills.csv")
ALIASES = {"node": "node.js", "rest": "rest apis", "powerbi": "power bi"}


def normalize(skill: str) -> str:
    value = skill.casefold().strip()
    return ALIASES.get(value, value)


def load_model() -> dict[str, dict[str, float]]:
    model: dict[str, dict[str, float]] = defaultdict(dict)
    with DATASET.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            model[row["career"]][normalize(row["skill"])] = float(row["weight"])
    return dict(model)


def score(skills: list[str], model: dict[str, dict[str, float]] | None = None) -> list[dict[str, object]]:
    model = model or load_model()
    known = {normalize(skill) for skill in skills if skill.strip()}
    results = []
    for career, requirements in model.items():
        matched = sum(weight for skill, weight in requirements.items() if skill in known)
        total = sum(requirements.values())
        results.append({"career": career, "score": round((matched / total) * 100) if total else 0,
                        "matched_skills": sorted(skill for skill in requirements if skill in known),
                        "missing_skills": sorted(skill for skill in requirements if skill not in known)})
    return sorted(results, key=lambda item: item["score"], reverse=True)


if __name__ == "__main__":
    import json
    import sys
    print(json.dumps(score(sys.argv[1:])))
