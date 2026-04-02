#!/usr/bin/env python3
"""Final cleanup of minor issues in MD files."""

import re
from pathlib import Path
import sys

def fix_md_file(md_path: Path) -> bool:
    """Fix minor issues in MD file."""
    try:
        with open(md_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix sub-section headers to include emojis
        content = re.sub(r'### Etichete de Impact:', '### 🏷️ Etichete de Impact:', content)
        content = re.sub(r'### Core Values:', '### 💎 Core Values:', content)
        content = re.sub(r'### Cognitive Style:', '### 🧠 Cognitive Style:', content)
        content = re.sub(r'### Decision Heuristics:', '### ⚖️ Decision Heuristics:', content)
        content = re.sub(r'### Knowledge Expertise:', '### 📚 Knowledge Expertise:', content)
        content = re.sub(r'### Communication Style:', '### 🗣️ Communication Style:', content)
        content = re.sub(r'### Known Limitations:', '### ⚠️ Known Limitations:', content)
        
        # Fix overly promotional language in a balanced way
        # Replace "divine" with more neutral language for historical figures
        content = re.sub(r'\bdivine\b', 'spiritual', content, flags=re.IGNORECASE)
        content = re.sub(r'\bperfect\b', 'exemplary', content, flags=re.IGNORECASE)
        
        # Write back to file
        with open(md_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        return True
        
    except Exception as e:
        print(f"Error fixing {md_path}: {e}")
        return False

def fix_sensitive_figures():
    """Fix sensitive figures handling."""
    print("🔧 Fixing Sensitive Figures")
    print("-" * 30)
    
    docs_dir = Path("docs/people")
    
    # Fix Hitler file
    hitler_file = docs_dir / "039-adolf-hitler.md"
    if hitler_file.exists():
        try:
            with open(hitler_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Ensure proper critical analysis language
            if "critical analysis only" not in content.lower():
                # Add proper warning
                content += "\n\n⚠️ **Note:** This profile is for critical historical analysis only, not for emulation or glorification."
            
            with open(hitler_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print("✅ Fixed Hitler file")
        except Exception as e:
            print(f"❌ Error fixing Hitler file: {e}")
    
    # Fix Stalin file
    stalin_file = docs_dir / "066-joseph-stalin.md"
    if stalin_file.exists():
        try:
            with open(stalin_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Ensure proper critical analysis language
            if "critical analysis" not in content.lower():
                content += "\n\n⚠️ **Note:** This profile is for critical historical analysis, examining both achievements and controversial aspects."
            
            with open(stalin_file, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print("✅ Fixed Stalin file")
        except Exception as e:
            print(f"❌ Error fixing Stalin file: {e}")

def main():
    """Run final cleanup."""
    print("🧹 Final Cleanup of Minor Issues")
    print("=" * 40)
    
    docs_dir = Path("docs/people")
    
    fixed_count = 0
    error_count = 0
    
    # Fix all MD files
    for md_file in sorted(docs_dir.glob("*.md")):
        if fix_md_file(md_file):
            fixed_count += 1
        else:
            error_count += 1
    
    # Fix sensitive figures
    fix_sensitive_figures()
    
    print(f"\n📊 Results:")
    print(f"✅ Fixed: {fixed_count}")
    print(f"❌ Errors: {error_count}")
    
    return error_count == 0

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
