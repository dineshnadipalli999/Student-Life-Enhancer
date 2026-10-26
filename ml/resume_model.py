"""Deterministic resume intelligence model.

This model intentionally has no external ML dependencies. It extracts known
skills from resume text and calculates a weighted target-role match, making it
safe to run locally or replace with an ML service later without changing the
resume analysis contract.
"""
from __future__ import annotations

import re
import sys
from typing import Iterable


ROLE_SKILLS: dict[str, dict[str, float]] = {
    "full stack developer": {
        "javascript": 1.0, "react": 0.9, "node.js": 1.0,
        "sql": 0.8, "rest apis": 0.9, "docker": 0.5,
    },
    "frontend developer": {
        "javascript": 1.0, "typescript": 0.9, "react": 1.0,
        "html": 0.7, "css": 0.7, "git": 0.5,
    },
    "backend developer": {
        "node.js": 1.0, "express": 0.9, "sql": 0.8,
        "rest apis": 1.0, "docker": 0.6, "git": 0.5,
    },
    "data analyst": {
        "python": 1.0, "sql": 1.0, "statistics": 0.9,
        "power bi": 0.8, "machine learning": 0.5,
    },
    "ai engineer": {
        "python": 1.0, "machine learning": 1.0,
        "statistics": 0.8, "sql": 0.5,
    },
    "cloud engineer": {
        "docker": 0.9, "cloud": 1.0, "linux": 0.8, "python": 0.6,
    },
}

SKILL_ALIASES = {"node": "node.js", "rest": "rest apis"}
CATALOG = sorted({skill for requirements in ROLE_SKILLS.values() for skill in requirements})


def normalize(value: str) -> str:
    return SKILL_ALIASES.get(value.strip().casefold(), value.strip().casefold())


def detect_skills(text: str) -> list[str]:
    normalized = text.casefold()
    return [skill for skill in CATALOG if re.search(r"(?<!\w)" + re.escape(skill) + r"(?!\w)", normalized)]


def analyze(text: str, target_role: str, profile_skills: Iterable[str] = ()) -> dict[str, object]:
    detected = detect_skills(text)
    known = {normalize(skill) for skill in [*profile_skills, *detected]}
    role_key = next((role for role in ROLE_SKILLS if role in target_role.casefold()), None)
    requirements = ROLE_SKILLS.get(role_key or "", {skill: 1.0 for skill in CATALOG[:8]})
    matched = sorted(skill for skill in requirements if skill in known)
    missing = sorted(skill for skill in requirements if skill not in known)
    total = sum(requirements.values())
    score = round(sum(requirements[skill] for skill in matched) / total * 100) if total else 0
    return {
        "target_role": target_role.strip(),
        "score": score,
        "detected_skills": detected,
        "matched_skills": matched,
        "missing_skills": missing,
    }


if __name__ == "__main__":
    import json
    role = sys.argv[1] if len(sys.argv) > 1 else "Full Stack Developer"
    print(json.dumps(analyze(sys.stdin.read(), role)))
