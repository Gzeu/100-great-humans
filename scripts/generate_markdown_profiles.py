#!/usr/bin/env python3
"""Generate Markdown profiles from YAML data and 100-great-humans.md descriptions.

This script:
1. Reads YAML profiles from data/people/
2. Extracts descriptions from 100-great-humans.md
3. Generates structured Markdown files in docs/people/
4. Updates YAML files with profile_md references
"""

import argparse
import json
import re
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
        data["_file_path"] = str(path)
        people.append(data)

    # Sort by Hart rank
    people.sort(key=lambda p: p.get("hart_rank", 9999))
    return people


def extract_descriptions_from_md(md_file: str) -> dict[int, str]:
    """Extract descriptions from 100-great-humans.md by rank."""
    descriptions = {}
    
    with open(md_file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Pattern to match numbered entries (e.g., "1. Muhammad - Prophet...")
    pattern = r'^(\d+)\.\s+(.+?)(?=\n\d+\.|\n\n|\Z)'
    matches = re.findall(pattern, content, re.MULTILINE | re.DOTALL)
    
    for rank_str, description in matches:
        try:
            rank = int(rank_str)
            # Clean up description
            description = description.strip()
            # Remove rank and name from description if present
            description = re.sub(r'^\d+\.\s+[^-]+-\s*', '', description)
            descriptions[rank] = description
        except ValueError:
            continue
    
    return descriptions


def generate_markdown_profile(person: dict, description: str) -> str:
    """Generate structured Markdown profile for a person."""
    name = person.get("name", "Unknown")
    rank = person.get("hart_rank", "Unknown")
    
    # Build sections
    sections = []
    
    # Header
    sections.append(f"# {name}")
    sections.append(f"**Hart Rank:** {rank}")
    sections.append("")
    
    # Basic info
    sections.append("## 📋 Informații de Bază")
    sections.append(f"- **Nume complet:** {name}")
    if person.get("also_known_as"):
        sections.append(f"- **Alte nume:** {', '.join(person['also_known_as'])}")
    if person.get("birth_date"):
        sections.append(f"- **Data nașterii:** {person['birth_date']}")
    if person.get("death_date"):
        sections.append(f"- **Data decesului:** {person['death_date']}")
    if person.get("birth_place"):
        sections.append(f"- **Locul nașterii:** {person['birth_place']}")
    if person.get("death_place"):
        sections.append(f"- **Locul decesului:** {person['death_place']}")
    sections.append(f"- **Naționalitate:** {', '.join(person.get('nationality', []))}")
    sections.append(f"- **Religie:** {person.get('religion', 'N/A')}")
    sections.append(f"- **Epocă:** {person.get('era', 'N/A')}")
    sections.append("")
    
    # Biography section
    sections.append("## 📖 Biografie")
    sections.append(description)
    sections.append("")
    
    # Achievements
    sections.append("## 🏆 Realizări Principale")
    sections.append(f"- **Domenii:** {', '.join(person.get('domains', []))}")
    sections.append(f"- **Subdomenii:** {', '.join(person.get('subdomains', []))}")
    sections.append(f"- **Ocupații:** {', '.join(person.get('occupations', []))}")
    sections.append("")
    
    # Impact
    sections.append("## 🌍 Impact și Moștenire")
    impact_tags = person.get('impact_tags', [])
    if impact_tags:
        sections.append("### Etichete de Impact:")
        for tag in impact_tags:
            sections.append(f"- {tag}")
        sections.append("")
    
    # Agent Archetype
    if person.get('agent_archetype'):
        sections.append("## 🤖 Arhetip Agent")
        sections.append(f"**{person['agent_archetype']}**")
        sections.append("")
        
        if person.get('core_values'):
            sections.append("### Valori Fundamentale:")
            for value in person['core_values']:
                sections.append(f"- {value}")
            sections.append("")
        
        if person.get('cognitive_style'):
            sections.append("### Stil Cognitiv:")
            for style in person['cognitive_style']:
                sections.append(f"- {style}")
            sections.append("")
        
        if person.get('decision_heuristics'):
            sections.append("### Heuristici Decizionale:")
            for heuristic in person['decision_heuristics']:
                sections.append(f"- {heuristic}")
            sections.append("")
        
        if person.get('knowledge_expertise'):
            sections.append("### Expertiză Cunoștințe:")
            for expertise in person['knowledge_expertise']:
                sections.append(f"- {expertise}")
            sections.append("")
        
        if person.get('communication_style'):
            sections.append("### Stil Comunicare:")
            for style in person['communication_style']:
                sections.append(f"- {style}")
            sections.append("")
        
        if person.get('known_limitations'):
            sections.append("### Limitări Cunoscute:")
            for limitation in person['known_limitations']:
                sections.append(f"- {limitation}")
            sections.append("")
    
    return "\n".join(sections)


def update_yaml_with_profile_md(yaml_path: str, profile_md_path: str) -> None:
    """Update YAML file with profile_md reference."""
    with open(yaml_path, "r", encoding="utf-8") as f:
        data = yaml.safe_load(f)
    
    # Add profile_md field
    data['profile_md'] = profile_md_path
    
    with open(yaml_path, "w", encoding="utf-8") as f:
        yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)


def main():
    parser = argparse.ArgumentParser(description="Generate Markdown profiles from YAML data")
    parser.add_argument(
        "--input-dir",
        default="data/people",
        help="Directory containing YAML files (default: data/people)"
    )
    parser.add_argument(
        "--descriptions-md",
        default="100-great-humans.md",
        help="Markdown file with descriptions (default: 100-great-humans.md)"
    )
    parser.add_argument(
        "--output-dir",
        default="docs/people",
        help="Directory for generated Markdown files (default: docs/people)"
    )
    
    args = parser.parse_args()
    
    # Load data
    people = load_yaml_people(args.input_dir)
    descriptions = extract_descriptions_from_md(args.descriptions_md)
    
    # Create output directory
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Generate profiles
    for person in people:
        rank = person.get("hart_rank")
        if not rank:
            print(f"Warning: No rank for {person.get('name', 'Unknown')}")
            continue
        
        # Get description
        description = descriptions.get(rank, f"Descriere nu disponibilă pentru rangul {rank}.")
        
        # Generate Markdown
        markdown_content = generate_markdown_profile(person, description)
        
        # Write Markdown file
        md_filename = f"{rank:03d}-{person['name'].lower().replace(' ', '-').replace(',', '').replace('.', '').replace('(', '').replace(')', '').replace("'", '')}.md"
        md_path = output_dir / md_filename
        
        with open(md_path, "w", encoding="utf-8") as f:
            f.write(markdown_content)
        
        # Update YAML with profile_md reference
        yaml_path = Path(person["_file_path"])
        profile_md_ref = f"docs/people/{md_filename}"
        update_yaml_with_profile_md(str(yaml_path), profile_md_ref)
        
        print(f"Generated: {md_path}")
        print(f"Updated YAML: {yaml_path}")
    
    print(f"\n✅ Generated {len(people)} Markdown profiles in {args.output_dir}")
    print(f"✅ Updated YAML files with profile_md references")


if __name__ == "__main__":
    main()
