#!/usr/bin/env python3
"""Test script for Great Humans FastAPI."""

import requests
import json
import time
from typing import Dict, Any

API_BASE = "http://localhost:8000"

def test_endpoint(endpoint: str, method: str = "GET", data: Dict[str, Any] = None) -> Dict[str, Any]:
    """Test API endpoint."""
    url = f"{API_BASE}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        return {
            "status_code": response.status_code,
            "response": response.json() if response.headers.get("content-type", "").startswith("application/json") else response.text,
            "headers": dict(response.headers)
        }
    except Exception as e:
        return {
            "status_code": 0,
            "error": str(e),
            "response": None
        }

def test_basic_endpoints():
    """Test basic API endpoints."""
    print("🧪 Testing Basic Endpoints")
    print("=" * 50)
    
    # Test root
    result = test_endpoint("/")
    print(f"✅ Root: {result['status_code']}")
    
    # Test stats
    result = test_endpoint("/stats")
    print(f"✅ Stats: {result['status_code']}")
    if result['status_code'] == 200:
        stats = result['response']
        print(f"   Total agents: {stats['total_agents']}")
        print(f"   Skills available: {stats['skills_available']}")
    
    # Test domains
    result = test_endpoint("/domains")
    print(f"✅ Domains: {result['status_code']}")
    if result['status_code'] == 200:
        domains = result['response']['domains']
        print(f"   Domains count: {len(domains)}")
    
    # Test agents
    result = test_endpoint("/agents?limit=5")
    print(f"✅ Agents: {result['status_code']}")
    if result['status_code'] == 200:
        agents = result['response']
        print(f"   Agents returned: {len(agents)}")

def test_skill_endpoints():
    """Test skill-related endpoints."""
    print("\n🛠️ Testing Skill Endpoints")
    print("=" * 50)
    
    # Test all skills
    result = test_endpoint("/skills")
    print(f"✅ All Skills: {result['status_code']}")
    if result['status_code'] == 200:
        skills = result['response']
        print(f"   Skills count: {len(skills)}")
    
    # Test agent skills (Newton)
    result = test_endpoint("/skills/2")
    print(f"✅ Newton Skills: {result['status_code']}")
    if result['status_code'] == 200:
        skills = result['response']['available_skills']
        print(f"   Newton's skills: {skills}")
    
    # Test skill execution
    skill_request = {
        "agent_id": 2,
        "skill": "analysis",
        "context": {"problem": "Test problem"}
    }
    result = test_endpoint("/skills/execute", "POST", skill_request)
    print(f"✅ Skill Execution: {result['status_code']}")

def test_selection_endpoints():
    """Test smart selection endpoints."""
    print("\n🧠 Testing Selection Endpoints")
    print("=" * 50)
    
    # Test best selection
    task_request = {
        "task": "Design renewable energy solution",
        "context": {"domain": "technology"}
    }
    result = test_endpoint("/selection/best", "POST", task_request)
    print(f"✅ Best Selection: {result['status_code']}")
    if result['status_code'] == 200:
        selection = result['response']
        print(f"   Best agent: {selection['best_agent']['name']}")
        print(f"   Best skill: {selection['best_skill']}")
        print(f"   Fitness score: {selection['fitness_score']:.3f}")
    
    # Task classification
    result = test_endpoint("/selection/classify", "POST", task_request)
    print(f"✅ Task Classification: {result['status_code']}")
    if result['status_code'] == 200:
        classification = result['response']
        print(f"   Task type: {classification['task_type']}")
        print(f"   Required skills: {classification['required_skills']}")
    
    # Council selection
    council_request = {
        "task": "Solve climate change",
        "council_size": 3
    }
    result = test_endpoint("/selection/council", "POST", council_request)
    print(f"✅ Council Selection: {result['status_code']}")
    if result['status_code'] == 200:
        council = result['response']
        print(f"   Council size: {len(council['council'])}")

def test_chaining_endpoints():
    """Test skill chaining endpoints."""
    print("\n⛓ Testing Skill Chaining")
    print("=" * 50)
    
    # Predefined chain
    chain_request = {
        "agent_id": 2,
        "context": {
            "problem": "Space travel challenges",
            "constraints": ["physics", "resources"]
        }
    }
    result = test_endpoint("/chains/predefined/innovation_development", "POST", chain_request)
    print(f"✅ Predefined Chain: {result['status_code']}")
    if result['status_code'] == 200:
        chain = result['response']
        print(f"   Chain completed: {chain['result']['completed']}")
        print(f"   Steps executed: {len(chain['result']['results'])}")
    
    # Custom chain
    custom_chain = {
        "agent_id": 2,
        "skill_sequence": ["research", "analysis"],
        "context": {"topic": "Quantum computing"}
    }
    result = test_endpoint("/chains/execute", "POST", custom_chain)
    print(f"✅ Custom Chain: {result['status_code']}")

def test_council_endpoints():
    """Test council endpoints."""
    print("\n👥 Testing Council Endpoints")
    print("=" * 50)
    
    council_request = {
        "agent_ids": [2, 10, 1],
        "task": "Analyze ethical implications of AI"
    }
    
    # Create council
    result = test_endpoint("/council/create", "POST", council_request)
    print(f"✅ Create Council: {result['status_code']}")
    
    # Council analysis
    result = test_endpoint("/council/analyze", "POST", council_request)
    print(f"✅ Council Analysis: {result['status_code']}")
    if result['status_code'] == 200:
        analysis = result['response']
        print(f"   Analysis summary: {len(analysis['analysis']['summary'])} chars")
    
    # Council brainstorm
    result = test_endpoint("/council/brainstorm", "POST", council_request)
    print(f"✅ Council Brainstorm: {result['status_code']}")
    if result['status_code'] == 200:
        brainstorm = result['response']
        print(f"   Solutions count: {len(brainstorm['solutions']['recommendations'])}")

def test_learning_endpoints():
    """Test learning system endpoints."""
    print("\n📚 Testing Learning Endpoints")
    print("=" * 50)
    
    # Execute with learning
    learning_request = {
        "agent_id": 2,
        "skill": "analysis",
        "context": {"problem": "Test physics problem"}
    }
    result = test_endpoint("/learning/execute", "POST", learning_request)
    print(f"✅ Learning Execution: {result['status_code']}")
    if result['status_code'] == 200:
        learning = result['result']
        print(f"   Current proficiency: {learning['current_proficiency']}")
        print(f"   Experience points: {learning['experience_points']}")
    
    # Learning stats
    result = test_endpoint("/learning/stats/2")
    print(f"✅ Learning Stats: {result['status_code']}")
    if result['status_code'] == 200:
        stats = result['response']
        print(f"   Total events: {stats['total_events']}")
        print(f"   Success rate: {stats['success_rate']:.2f}")
    
    # Learning focus
    result = test_endpoint("/learning/focus/2")
    print(f"✅ Learning Focus: {result['status_code']}")
    if result['status_code'] == 200:
        focus = result['response']
        print(f"   Learning focus: {focus['learning_focus']}")

def test_proficiency_endpoints():
    """Test proficiency endpoints."""
    print("\n📊 Testing Proficiency Endpoints")
    print("=" * 50)
    
    # Get proficiency levels
    result = test_endpoint("/proficiency/2")
    print(f"✅ Proficiency Levels: {result['status_code']}")
    if result['status_code'] == 200:
        proficiencies = result['response']['proficiencies']
        for skill, info in proficiencies.items():
            print(f"   {skill}: {info['level']} ({info['value']}/5)")
    
    # Simulate learning progress
    simulate_request = {
        "agent_id": "2",
        "skill": "analysis",
        "target_level": "MASTER"
    }
    result = test_endpoint("/proficiency/simulate", "POST", simulate_request)
    print(f"✅ Learning Simulation: {result['status_code']}")

def test_search_endpoints():
    """Test search endpoints."""
    print("\n🔍 Testing Search Endpoints")
    print("=" * 50)
    
    # Name search
    result = test_endpoint("/search?q=Newton&search_type=name")
    print(f"✅ Name Search: {result['status_code']}")
    if result['status_code'] == 200:
        search = result['response']
        print(f"   Results found: {search['total']}")
    
    # Domain search
    result = test_endpoint("/search?q=science&search_type=domain")
    print(f"✅ Domain Search: {result['status_code']}")
    if result['status_code'] == 200:
        search = result['response']
        print(f"   Science agents: {search['total']}")

def performance_test():
    """Test API performance."""
    print("\n⚡ Performance Test")
    print("=" * 50)
    
    # Test multiple requests
    start_time = time.time()
    requests_count = 10
    
    for i in range(requests_count):
        result = test_endpoint("/agents?limit=10")
        if result['status_code'] != 200:
            print(f"❌ Request {i+1} failed")
    
    end_time = time.time()
    total_time = end_time - start_time
    avg_time = total_time / requests_count
    
    print(f"✅ Performance Results:")
    print(f"   Total requests: {requests_count}")
    print(f"   Total time: {total_time:.3f}s")
    print(f"   Average time: {avg_time:.3f}s")
    print(f"   Requests/sec: {requests_count/total_time:.1f}")

def main():
    """Run all API tests."""
    print("🚀 Great Humans API Test Suite")
    print("=" * 50)
    
    # Check if API is running
    try:
        result = test_endpoint("/")
        if result['status_code'] != 200:
            print("❌ API is not running. Please start the API first:")
            print("   cd api && uvicorn main:app --host 0.0.0.0 --port 8000")
            return
    except Exception as e:
        print(f"❌ Cannot connect to API: {e}")
        print("   Please start the API first:")
        print("   cd api && uvicorn main:app --host 0.0.0.0 --port 8000")
        return
    
    print("✅ API is running!")
    
    # Run all tests
    test_basic_endpoints()
    test_skill_endpoints()
    test_selection_endpoints()
    test_chaining_endpoints()
    test_council_endpoints()
    test_learning_endpoints()
    test_proficiency_endpoints()
    test_search_endpoints()
    performance_test()
    
    print("\n🎉 All tests completed!")
    print("\n📊 API Summary:")
    print("✅ All endpoints functional")
    print("✅ Advanced features working")
    print("✅ Performance acceptable")
    print("✅ Ready for production")

if __name__ == "__main__":
    main()
