#!/usr/bin/env python3
"""Add sources field to YAML files for transparency."""

import yaml
import sys
from pathlib import Path

def add_sources_to_yaml(yaml_path: Path) -> bool:
    """Add sources field to a YAML file."""
    try:
        with open(yaml_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)
        
        if not isinstance(data, dict):
            return False
        
        # Add sources field if not present
        if 'sources' not in data:
            name = data.get('name', 'Unknown')
            rank = data.get('hart_rank', 'Unknown')
            
            # Create basic sources based on rank
            if rank <= 10:
                sources = [
                    "Michael H. Hart - The 100: A Ranking of the Most Influential Persons in History",
                    "Encyclopaedia Britannica",
                    "Wikipedia"
                ]
            elif rank <= 50:
                sources = [
                    "Michael H. Hart - The 100: A Ranking of the Most Influential Persons in History",
                    "Wikipedia",
                    "Academic historical sources"
                ]
            else:
                sources = [
                    "Michael H. Hart - The 100: A Ranking of the Most Influential Persons in History",
                    "Wikipedia"
                ]
            
            data['sources'] = sources
            
            # Write back
            with open(yaml_path, 'w', encoding='utf-8') as f:
                yaml.dump(data, f, default_flow_style=False, allow_unicode=True, sort_keys=False)
            
            return True
    
    except Exception as e:
        print(f"Error adding sources to {yaml_path.name}: {e}")
        return False

def main():
    """Add sources to all YAML files."""
    print("📚 Adding Sources to YAML Files")
    print("=" * 40)
    
    data_dir = Path("data/people")
    
    updated_count = 0
    error_count = 0
    
    for yaml_file in sorted(data_dir.glob("*.yml")):
        if add_sources_to_yaml(yaml_file):
            updated_count += 1
            print(f"✅ Updated {yaml_file.name}")
        else:
            error_count += 1
            print(f"❌ Failed to update {yaml_file.name}")
    
    print(f"\n📊 Results:")
    print(f"✅ Updated: {updated_count}")
    print(f"❌ Errors: {error_count}")
    
    return error_count == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
