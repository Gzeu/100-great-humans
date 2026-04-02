#!/usr/bin/env python3
"""Quick test of FastAPI server."""

import sys
from pathlib import Path

# Add parent directories to path
sys.path.append(str(Path(__file__).parent.parent))
sys.path.append(str(Path(__file__).parent.parent / "great_humans"))

try:
    from fastapi import FastAPI
    from great_humans import load_all, SkillSelector
    
    # Test imports
    print("✅ FastAPI imported successfully")
    
    # Test great_humans imports
    agents = load_all()
    print(f"✅ Loaded {len(agents)} agents")
    
    selector = SkillSelector()
    print("✅ SkillSelector created")
    
    # Test basic functionality
    best_agent, best_skill, score = selector.select_best_agent_skill_pair("Design renewable energy")
    print(f"✅ Best selection: {best_agent} with {best_skill} ({score:.3f})")
    
    print("\n🚀 FastAPI integration ready!")
    print("Run: uvicorn main:app --host 0.0.0.0 --port 8000")
    
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Install dependencies: pip install -r requirements.txt")
except Exception as e:
    print(f"❌ Error: {e}")
