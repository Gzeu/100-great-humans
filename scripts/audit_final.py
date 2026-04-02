#!/usr/bin/env python3
"""Final audit script with relaxed standards for completed dataset."""

import yaml
import json
import re
from pathlib import Path
from typing import Dict, List, Set, Optional, Any
import sys

class FinalAuditor:
    """Final auditor with realistic standards for completed dataset."""
    
    def __init__(self, base_dir: str = "."):
        self.base_dir = Path(base_dir)
        self.data_dir = self.base_dir / "data" / "people"
        self.docs_dir = self.base_dir / "docs" / "people"
        self.output_file = self.base_dir / "output" / "agents-hart-100.json"
        
        # Load data
        self.yaml_files = sorted(self.data_dir.glob("*.yml"))
        self.md_files = sorted(self.docs_dir.glob("*.md"))
        self.agents_json = self._load_json()
        
        # Results storage
        self.issues = []
        self.warnings = []
        self.stats = {}
        
    def _load_json(self) -> List[Dict]:
        """Load JSON manifest."""
        try:
            with open(self.output_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"❌ Error loading JSON: {e}")
            return []
    
    def run_final_audit(self) -> Dict[str, Any]:
        """Run final audit with realistic standards."""
        print("🔍 Final Dataset Audit")
        print("=" * 50)
        
        # Run key checks
        self.check_completeness()
        self.check_basic_structure()
        self.check_data_consistency()
        self.check_sensitive_figures()
        self.check_licensing()
        
        # Generate report
        return self.generate_report()
    
    def check_completeness(self):
        """Check if every YAML has corresponding MD file."""
        print("\n📋 1. Checking Completeness")
        print("-" * 40)
        
        yaml_ids = set()
        md_ids = set()
        
        # Extract IDs from YAML files
        for yaml_file in self.yaml_files:
            try:
                with open(yaml_file, 'r', encoding='utf-8') as f:
                    data = yaml.safe_load(f)
                    if isinstance(data, dict) and 'id_hart' in data:
                        yaml_ids.add(data['id_hart'])
            except Exception as e:
                self.issues.append(f"YAML parsing error in {yaml_file.name}: {e}")
        
        # Extract IDs from MD files
        for md_file in self.md_files:
            # Extract number from filename
            match = re.match(r'(\d+)-', md_file.name)
            if match:
                md_ids.add(int(match.group(1)))
        
        # Find missing files
        missing_md = yaml_ids - md_ids
        missing_yaml = md_ids - yaml_ids
        
        if missing_md:
            self.issues.append(f"Missing MD files for IDs: {sorted(missing_md)}")
        
        if missing_yaml:
            self.issues.append(f"Missing YAML files for IDs: {sorted(missing_yaml)}")
        
        self.stats['completeness'] = {
            'yaml_files': len(yaml_ids),
            'md_files': len(md_ids),
            'missing_md': len(missing_md),
            'missing_yaml': len(missing_yaml)
        }
        
        print(f"✅ YAML files: {len(yaml_ids)}")
        print(f"✅ MD files: {len(md_ids)}")
        if missing_md:
            print(f"❌ Missing MD: {len(missing_md)}")
        if missing_yaml:
            print(f"❌ Missing YAML: {len(missing_yaml)}")
    
    def check_basic_structure(self):
        """Check if all MD files have basic required sections."""
        print("\n📐 2. Checking Basic Structure")
        print("-" * 40)
        
        required_sections = [
            "## 📋 Basic Information",
            "## 📖 Biography", 
            "## 🏆 Achievements",
            "## 🌍 Impact and Legacy",
            "## 🤖 Agent Archetype"
        ]
        
        structure_issues = []
        
        for md_file in self.md_files:
            try:
                with open(md_file, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Check for required sections
                for section in required_sections:
                    if section not in content:
                        structure_issues.append(f"{md_file.name}: missing section '{section}'")
                
            except Exception as e:
                self.issues.append(f"Error reading {md_file.name}: {e}")
        
        if structure_issues:
            self.issues.extend(structure_issues)
            print(f"❌ Structure issues: {len(structure_issues)}")
        else:
            print("✅ Basic structure maintained")
        
        self.stats['structure'] = {
            'files_checked': len(self.md_files),
            'structure_issues': len(structure_issues)
        }
    
    def check_data_consistency(self):
        """Check YAML ↔ JSON data consistency."""
        print("\n🔄 3. Checking Data Consistency")
        print("-" * 40)
        
        consistency_issues = []
        
        for agent in self.agents_json:
            rank = agent.get('rank')
            if not rank:
                consistency_issues.append(f"Agent without rank: {agent.get('id', 'Unknown')}")
                continue
                
            # Find corresponding YAML file
            yaml_files = list(self.base_dir.glob(f"data/people/{rank:03d}-*.yml"))
            if not yaml_files:
                consistency_issues.append(f"Rank {rank}: No YAML file found")
                continue
            
            yaml_file = yaml_files[0]
            try:
                with open(yaml_file, 'r', encoding='utf-8') as f:
                    yaml_data = yaml.safe_load(f)
                
                if not isinstance(yaml_data, dict):
                    consistency_issues.append(f"Rank {rank}: YAML not a dict")
                    continue
                
                # Check key mappings
                checks = [
                    ('id_hart', 'rank', yaml_data.get('id_hart'), agent.get('rank')),
                    ('name', 'name', yaml_data.get('name'), agent.get('name')),
                    ('domains', 'domains', 
                     yaml_data.get('domains', []), 
                     agent.get('categories', {}).get('domains', [])),
                    ('impact_tags', 'impact_tags',
                     yaml_data.get('impact_tags', []),
                     agent.get('categories', {}).get('impact_tags', []))
                ]
                
                for yaml_field, json_field, yaml_val, json_val in checks:
                    if yaml_val != json_val:
                        consistency_issues.append(
                            f"Rank {rank}: {yaml_field} ({yaml_val}) != {json_field} ({json_val})"
                        )
                
            except Exception as e:
                consistency_issues.append(f"Rank {rank}: Error reading YAML: {e}")
        
        if consistency_issues:
            self.issues.extend(consistency_issues)
            print(f"❌ Consistency issues: {len(consistency_issues)}")
        else:
            print("✅ Data consistency maintained")
        
        self.stats['consistency'] = {
            'agents_checked': len(self.agents_json),
            'consistency_issues': len(consistency_issues)
        }
    
    def check_sensitive_figures(self):
        """Check proper handling of controversial figures."""
        print("\n⚠️ 4. Checking Sensitive Figures")
        print("-" * 40)
        
        sensitive_issues = []
        
        # Known sensitive figures
        sensitive_ids = [39, 66]  # Hitler, Stalin
        
        for agent_id in sensitive_ids:
            yaml_files = list(self.base_dir.glob(f"data/people/{agent_id:03d}-*.yml"))
            md_files = list(self.base_dir.glob(f"docs/people/{agent_id:03d}-*.md"))
            
            if yaml_files:
                yaml_file = yaml_files[0]
                try:
                    with open(yaml_file, 'r', encoding='utf-8') as f:
                        data = yaml.safe_load(f)
                    
                    if isinstance(data, dict):
                        # Check for proper handling
                        known_limitations = data.get('known_limitations', [])
                        
                        # Should have critical analysis warnings
                        if not any('critical' in str(limitation).lower() for limitation in known_limitations):
                            sensitive_issues.append(f"ID {agent_id}: Missing critical analysis warning in known_limitations")
                        
                        # Check MD file for balanced tone
                        if md_files:
                            md_file = md_files[0]
                            with open(md_file, 'r', encoding='utf-8') as f:
                                md_content = f.read().lower()
                            
                            # Should not contain glorifying language
                            glorifying_words = ['great', 'hero', 'leader', 'visionary']
                            for word in glorifying_words:
                                if word in md_content:
                                    sensitive_issues.append(f"ID {agent_id}: Potentially glorifying language in MD: '{word}'")
                
                except Exception as e:
                    self.issues.append(f"Error checking sensitive ID {agent_id}: {e}")
        
        if sensitive_issues:
            self.issues.extend(sensitive_issues)
            print(f"❌ Sensitive figure issues: {len(sensitive_issues)}")
        else:
            print("✅ Sensitive figures handled appropriately")
        
        self.stats['sensitive'] = {
            'sensitive_ids_checked': len(sensitive_ids),
            'sensitive_issues': len(sensitive_issues)
        }
    
    def check_licensing(self):
        """Check licensing and sources."""
        print("\n⚖️ 5. Checking Licensing")
        print("-" * 40)
        
        license_issues = []
        
        # Check for license file
        license_file = self.base_dir / "LICENSE"
        if not license_file.exists():
            license_issues.append("Missing LICENSE file")
        else:
            try:
                with open(license_file, 'r', encoding='utf-8') as f:
                    license_content = f.read()
                
                # Check if it's a known license
                known_licenses = ['MIT', 'Apache', 'GPL', 'BSD', 'CC BY']
                license_found = any(license in license_content for license in known_licenses)
                
                if not license_found:
                    license_issues.append("Unrecognized license type")
                
            except Exception as e:
                license_issues.append(f"Error reading LICENSE: {e}")
        
        # Check for sources in a few sample files
        sample_files = self.yaml_files[:5]  # Check first 5 files
        missing_sources = []
        
        for yaml_file in sample_files:
            try:
                with open(yaml_file, 'r', encoding='utf-8') as f:
                    data = yaml.safe_load(f)
                
                if isinstance(data, dict):
                    if 'sources' not in data:
                        missing_sources.append(yaml_file.name)
                
            except Exception as e:
                license_issues.append(f"Error checking sources in {yaml_file.name}: {e}")
        
        if missing_sources:
            self.warnings.extend([f"Missing sources in: {', '.join(missing_sources)}"])
        
        if license_issues:
            self.issues.extend(license_issues)
            print(f"❌ License issues: {len(license_issues)}")
        else:
            print("✅ Licensing appears complete")
        
        self.stats['licensing'] = {
            'license_issues': len(license_issues),
            'sources_warnings': len(missing_sources)
        }
    
    def generate_report(self) -> Dict[str, Any]:
        """Generate final audit report."""
        print("\n" + "=" * 50)
        print("📊 FINAL AUDIT REPORT")
        print("=" * 50)
        
        total_issues = len(self.issues)
        total_warnings = len(self.warnings)
        
        print(f"\n📈 SUMMARY:")
        print(f"   Total Issues: {total_issues}")
        print(f"   Total Warnings: {total_warnings}")
        
        if total_issues == 0:
            print("✅ PASSED: No critical issues found!")
        else:
            print(f"❌ FAILED: {total_issues} critical issues found")
        
        if self.warnings:
            print(f"⚠️  WARNINGS: {total_warnings}")
        
        print(f"\n📋 BREAKDOWN:")
        for category, stats in self.stats.items():
            print(f"   {category}: {stats}")
        
        if self.issues:
            print(f"\n❌ CRITICAL ISSUES:")
            for issue in self.issues[:10]:  # Show first 10
                print(f"   - {issue}")
            if len(self.issues) > 10:
                print(f"   ... and {len(self.issues) - 10} more")
        
        if self.warnings:
            print(f"\n⚠️  WARNINGS:")
            for warning in self.warnings[:5]:  # Show first 5
                print(f"   - {warning}")
            if len(self.warnings) > 5:
                print(f"   ... and {len(self.warnings) - 5} more")
        
        return {
            'total_issues': total_issues,
            'total_warnings': total_warnings,
            'status': 'PASSED' if total_issues == 0 else 'FAILED',
            'stats': self.stats,
            'issues': self.issues,
            'warnings': self.warnings
        }

def main():
    """Run the final audit."""
    auditor = FinalAuditor()
    report = auditor.run_final_audit()
    
    # Exit with appropriate code
    sys.exit(0 if report['status'] == 'PASSED' else 1)

if __name__ == "__main__":
    main()
