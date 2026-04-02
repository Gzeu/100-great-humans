#!/usr/bin/env python3
"""Standardize all MD files to match the required structure."""

import sys
from pathlib import Path
import re
import yaml

def standardize_md_file(md_path: Path, yaml_data: dict) -> bool:
    """Standardize a single MD file to match required structure."""
    try:
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extract existing content sections
        sections = {}
        
        # Extract existing sections
        section_patterns = {
            'biography': r'## 📖 Biography\s*\n(.*?)(?=##|\Z)',
            'achievements': r'## 🏆.*Achievements?\s*\n(.*?)(?=##|\Z)',
            'impact': r'## 🌍.*Impact.*Legacy?\s*\n(.*?)(?=##|\Z)',
            'agent': r'## 🤖.*Agent.*Archetype?\s*\n(.*?)(?=##|\Z)'
        }
        
        for section_name, pattern in section_patterns.items():
            match = re.search(pattern, content, re.DOTALL)
            if match:
                sections[section_name] = match.group(1).strip()
        
        # Build standardized content
        name = yaml_data.get('name', 'Unknown')
        rank = yaml_data.get('hart_rank', 'Unknown')
        
        sections['basic_info'] = f"""## 📋 Basic Information
- **Full Name:** {name}
- **Also Known As:** {', '.join(yaml_data.get('also_known_as', []))}
- **Birth Date:** {yaml_data.get('birth_date', 'N/A')}
- **Death Date:** {yaml_data.get('death_date', 'N/A')}
- **Birth Place:** {yaml_data.get('birth_place', 'N/A')}
- **Death Place:** {yaml_data.get('death_place', 'N/A')}
- **Nationality:** {', '.join(yaml_data.get('nationality', []))}
- **Religion:** {yaml_data.get('religion', 'N/A')}
- **Era:** {yaml_data.get('era', 'N/A')}"""
        
        # Ensure Biography section exists
        if 'biography' not in sections:
            sections['biography'] = f"Biographical information for {name} (Hart rank {rank}) is being compiled from historical sources."
        
        # Ensure Achievements section exists
        if 'achievements' not in sections:
            domains = yaml_data.get('domains', [])
            occupations = yaml_data.get('occupations', [])
            sections['achievements'] = f"""- **Domains:** {', '.join(domains)}
- **Occupations:** {', '.join(occupations)}
- **Hart Rank:** {rank}"""

        # Ensure Impact section exists
        if 'impact' not in sections:
            impact_tags = yaml_data.get('impact_tags', [])
            sections['impact'] = f"""Impact and legacy of {name} continues to influence modern society."""
            if impact_tags:
                sections['impact'] += f"""

### Etichete de Impact:
{chr(10).join(f"- {tag}" for tag in impact_tags)}"""
        
        # Ensure Agent Archetype section exists
        if 'agent' not in sections:
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
        
        # Build final content
        final_content = f"""# {name}
**Hart Rank:** {rank}

{sections['basic_info']}

{sections['biography']}

{sections['achievements']}

{sections['impact']}

{sections['agent']}"""
        
        # Write back to file
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(final_content)
        
        return True
        
    except Exception as e:
        print(f"Error standardizing {md_path}: {e}")
        return False

def main():
    """Standardize all MD files."""
    print("🔧 Standardizing MD Files")
    print("=" * 40)
    
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
            
            if standardize_md_file(md_file, yaml_data):
                fixed_count += 1
                print(f"✅ Fixed {md_file.name}")
            else:
                error_count += 1
                print(f"❌ Failed to fix {md_file.name}")
        
        except Exception as e:
            print(f"❌ Error processing {yaml_file.name}: {e}")
            error_count += 1
    
    print(f"\n📊 Results:")
    print(f"✅ Fixed: {fixed_count}")
    print(f"❌ Errors: {error_count}")
    
    return error_count == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
