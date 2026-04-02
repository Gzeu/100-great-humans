#!/usr/bin/env python3
"""Generate JSON agent manifests from YAML profiles in data/people/.

Usage:
    python scripts/generate_agents_json.py \
        --input-dir data/people \
        --output-file output/agents-hart-100.json

The script expects one YAML file per historical figure, following the
schema used in data/people/001-muhammad.yml etc. It produces a list of
JSON objects, each describing an "agent persona" built from those fields.
"""

import argparse
import json
import glob
from pathlib import Path

import yaml


def load_yaml_people(base_dir: str):
    """Load all YAML files from base_dir and return a sorted list of dicts."""
    people = []
    for path_str in glob.glob(f"{base_dir}/*.yml"):
        path = Path(path_str)
        with path.open("r", encoding="utf-8") as f:
            data = yaml.safe_load(f)
        if not isinstance(data, dict):
            continue
        data["_file_name"] = path.name
        people.append(data)

    # Sort by Hart rank if present, otherwise push to the end
    people.sort(key=lambda p: p.get("hart_rank", 9999))
    return people


def build_agent_manifest(person: dict) -> dict:
    """Build a single agent manifest JSON object from one YAML dict."""
    name = person.get("name", "Unknown")
    rank = person.get("hart_rank")

    archetype = person.get("agent_archetype", "")
    core_values = person.get("core_values", [])
    cognitive_style = person.get("cognitive_style", [])
    comm_style = person.get("communication_style", [])
    expertise = person.get("knowledge_expertise", [])
    impact_tags = person.get("impact_tags", [])

    domains = person.get("domains", [])
    subdomains = person.get("subdomains", [])

    era = person.get("era")
    regions = person.get("regions", [])
    limitations = person.get("known_limitations", [])

    # Build natural-language prompt template from YAML fields
    core_values_str = ", ".join(core_values) if core_values else "your core values"
    cognitive_str = ", ".join(cognitive_style) if cognitive_style else "your usual ways of thinking"
    comm_str = ", ".join(comm_style) if comm_style else "a style appropriate to your historical context"
    expertise_str = ", ".join(expertise) if expertise else "your historical areas of knowledge"
    limitations_str = "; ".join(limitations)

    prompt_template = (
        f"You are {name}, {archetype}. "
        f"You value {core_values_str}. "
        f"Your thinking style is {cognitive_str}. "
        f"You communicate in a {comm_str} way. "
        f"Focus on topics related to {expertise_str}. "
    )
    if limitations_str:
        prompt_template += (
            f"Avoid stepping outside your historical context or expertise: "
            f"{limitations_str}."
        )

    # Build a stable, simple ID
    safe_name = name.lower().replace(" ", "-")
    if rank is not None:
        agent_id = f"hart-{int(rank):03d}-{safe_name}"
    else:
        agent_id = f"hart-xxx-{safe_name}"

    manifest = {
        "id": agent_id,
        "name": name,
        "rank": rank,
        "categories": {
            "domains": domains,
            "subdomains": subdomains,
            "impact_tags": impact_tags,
        },
        "persona": {
            "archetype": archetype,
            "core_values": core_values,
            "cognitive_style": cognitive_style,
            "communication_style": comm_style,
        },
        "knowledge_profile": {
            "expertise": expertise,
            "era": era,
            "regions": regions,
        },
        "limitations": limitations,
        "prompt_template": prompt_template,
    }
    return manifest


def generate_all_agents_yaml_to_json(input_dir: str, output_file: str) -> None:
    people = load_yaml_people(input_dir)
    manifests = [build_agent_manifest(p) for p in people]

    out_path = Path(output_file)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(manifests, f, indent=2, ensure_ascii=False)


def main() -> None:
    parser = argparse.ArgumentParser(
        description=(
            "Generate JSON agent manifests from YAML profiles in data/people/. "
            "Intended for use as persona definitions for LLM-based agents."
        )
    )
    parser.add_argument(
        "--input-dir",
        default="data/people",
        help="Directory containing *.yml person profiles (default: data/people)",
    )
    parser.add_argument(
        "--output-file",
        default="output/agents-hart-100.json",
        help="Path to write JSON manifest list (default: output/agents-hart-100.json)",
    )

    args = parser.parse_args()
    generate_all_agents_yaml_to_json(args.input_dir, args.output_file)


if __name__ == "__main__":
    main()
