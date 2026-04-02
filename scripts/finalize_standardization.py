#!/usr/bin/env python3
"""Finalize MD file standardization with proper formatting."""

import yaml
import sys
from pathlib import Path
import re

def finalize_md_file(md_path: Path, yaml_data: dict) -> bool:
    """Finalize MD file with proper section headers and formatting."""
    try:
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract existing content sections
        sections = {}
        
        # Extract Biography section
        bio_match = re.search(r'(?s)## 📋 Basic Information.*?(## 📖 Biography\s*\n)(.*?)(?=##|$)', content)
        if bio_match:
            sections['biography'] = bio_match.group(2).strip()
        else:
            # Extract after Basic Information
            bio_match = re.search(r'(?s)## 📋 Basic Information.*?\n\n(.*?)(?=##|$)', content)
            if bio_match:
                sections['biography'] = bio_match.group(1).strip()
            else:
                sections['biography'] = f"Biographical information for {yaml_data.get('name', 'Unknown')} (Hart rank {yaml_data.get('hart_rank', 'Unknown')}) is being compiled from historical sources."
        
        # Extract Achievements section
        ach_match = re.search(r'(?s)(## 🏆 Achievements\s*\n)(.*?)(?=##|$)', content)
        if ach_match:
            sections['achievements'] = ach_match.group(2).strip()
        else:
            domains = yaml_data.get('domains', [])
            occupations = yaml_data.get('occupations', [])
            sections['achievements'] = f"""- **Domains:** {', '.join(domains)}
- **Occupations:** {', '.join(occupations)}
- **Hart Rank:** {yaml_data.get('hart_rank', 'Unknown')}"""
        
        # Extract Impact section
        impact_match = re.search(r'(?s)(## 🌍 Impact and Legacy\s*\n)(.*?)(?=##|$)', content)
        if impact_match:
            sections['impact'] = impact_match.group(2).strip()
        else:
            impact_tags = yaml_data.get('impact_tags', [])
            sections['impact'] = f"**Impact and legacy of {yaml_data.get('name', 'Unknown')} continues to influence modern society.**"
            if impact_tags:
                sections['impact'] += f"""

### Etichete de Impact:
{chr(10).join(f"- {tag}" for tag in impact_tags)}"""
        
        # Extract Agent Archetype section
        agent_match = re.search(r'(?s)(## 🤖 Agent Archetype\s*\n)(.*?)(?=##|$)', content)
        if agent_match:
            sections['agent'] = agent_match.group(2).strip()
        else:
            archetype = yaml_data.get('agent_archetype', 'Historical figure')
            sections['agent'] = f"**{archetype}**"
            
            # Add detailed agent sections if available
            if 'core_values' in yaml_data:
                sections['agent'] += f"""

### Core Values:
{chr(10).join(f"- {value}" for value in yaml_data['core_values'])}"""
            
            if 'cognitive_style' in yaml_data:
                sections['agent'] += f"""

### Cognitive Style:
{chr(10).join(f"- {style}" for style in yaml_data['cognitive_style'])}"""
            
            if 'decision_heuristics' in yaml_data:
                sections['agent'] += f"""

### Decision Heuristics:
{chr(10).join(f"- {heuristic}" for heuristic in yaml_data['decision_heuristics'])}"""
            
            if 'knowledge_expertise' in yaml_data:
                sections['agent'] += f"""

### Knowledge Expertise:
{chr(10).join(f"- {expertise}" for expertise in yaml_data['knowledge_expertise'])}"""
            
            if 'communication_style' in yaml_data:
                sections['agent'] += f"""

### Communication Style:
{chr(10).join(f"- {style}" for style in yaml_data['communication_style'])}"""
            
            if 'known_limitations' in yaml_data:
                sections['agent'] += f"""

### Known Limitations:
{chr(10).join(f"- {limitation}" for limitation in yaml_data['known_limitations'])}"""
        
        # Build final content with proper section headers
        name = yaml_data.get('name', 'Unknown')
        rank = yaml_data.get('hart_rank', 'Unknown')
        
        final_content = f"""# {name}
**Hart Rank:** {rank}

## 📋 Basic Information
- **Full Name:** {name}
- **Also Known As:** {', '.join(yaml_data.get('also_known_as', []))}
- **Birth Date:** {yaml_data.get('birth_date', 'N/A')}
- **Death Date:** {yaml_data.get('death_date', 'N/A')}
- **Birth Place:** {yaml_data.get('birth_place', 'N/A')}
- **Death Place:** {yaml_data.get('death_place', 'N/A')}
- **Nationality:** {', '.join(yaml_data.get('nationality', []))}
- **Religion:** {yaml_data.get('religion', 'N/A')}
- **Era:** {yaml_data.get('era', 'N/A')}

## 📖 Biography
{sections['biography']}

## 🏆 Achievements
{sections['achievements']}

## 🌍 Impact and Legacy
{sections['impact']}

## 🤖 Agent Archetype
{sections['agent']}"""
        
        # Write back to file
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(final_content)
        
        return True
        
    except Exception as e:
        print(f"Error finalizing {md_path}: {e}")
        return False

def main():
    """Finalize all MD files with proper formatting."""
    print("🔧 Finalizing MD Files with Proper Formatting")
    print("=" * 50)
    
    data_dir = Path("data/people")
    docs_dir = Path("docs/people")
    
    fixed_count = 0
    error_count = 0
    
    for yaml_file in sorted(data_dir.glob("*.yml")):
        try:
            with open(yaml_file, 'r', encoding='utf-8') as f:
                yaml_data = yaml.safe_load(f)
            
            if not isinstance(yaml_data, dict):
                print(f"❌ Invalid YAML in {yaml_file.name}")
                error_count += 1
                continue
            
            # Find corresponding MD file
            rank = yaml_data.get('hart_rank')
            if not rank:
                print(f"❌ No rank in {yaml_file.name}")
                error_count += 1
                continue
            
            md_files = list(docs_dir.glob(f"{rank:03d}-*.md"))
            if not md_files:
                print(f"❌ No MD file for rank {rank}")
                error_count += 1
                continue
            
            md_file = md_files[0]
            
            if finalize_md_file(md_file, yaml_data):
                fixed_count += 1
                print(f"✅ Finalized {md_file.name}")
            else:
                error_count += 1
                print(f"❌ Failed to finalize {md_file.name}")
        
        except Exception as e:
            print(f"❌ Error processing {yaml_file.name}: {e}")
            error_count += 1
    
    print(f"\n📊 Results:")
    print(f"✅ Finalized: {fixed_count}")
    print(f"❌ Errors: {error_count}")
    
    return error_count == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
