#!/usr/bin/env python3
"""Demonstration of Great Humans skills system."""

import sys
from pathlib import Path

# Add great_humans to path
sys.path.append(str(Path(__file__).parent.parent))

from great_humans.agent_enhanced import EnhancedAgent, AgentCouncil
from great_humans.skills import SkillRegistry
from great_humans import by_id

def demo_individual_skills():
    """Demonstrate individual agent skills."""
    print("🎯 Individual Agent Skills Demo")
    print("=" * 50)
    
    # Test Newton with analysis skill
    newton = EnhancedAgent(2)  # Newton
    print(f"\n🍎 {newton.name}'s Available Skills: {newton.available_skills}")
    
    if "analysis" in newton.available_skills:
        analysis_result = newton.use_skill("analysis", {
            "problem": "How can we improve renewable energy efficiency?"
        })
        print(f"\n📊 Analysis Result:")
        print(f"Agent: {analysis_result['agent']}")
        print(f"Confidence: {analysis_result['confidence']}")
        print(f"Methodology: {analysis_result['methodology']}")
        print(f"Analysis Preview: {analysis_result['analysis'][:200]}...")
    
    # Test Einstein with creativity skill
    einstein = EnhancedAgent(10)  # Einstein
    print(f"\n🧠 {einstein.name}'s Available Skills: {einstein.available_skills}")
    
    if "creativity" in einstein.available_skills:
        creativity_result = einstein.use_skill("creativity", {
            "challenge": "Design a new approach to space exploration"
        })
        print(f"\n💡 Creativity Result:")
        print(f"Agent: {creativity_result['agent']}")
        print(f"Innovation Score: {creativity_result['innovation_score']}")
        print(f"Approach: {creativity_result['approach']}")
        print(f"Creative Solutions Preview: {creativity_result['creative_solutions'][:200]}...")

def demo_council_skills():
    """Demonstrate council collaboration."""
    print("\n\n👥 Council Skills Demo")
    print("=" * 50)
    
    # Create diverse council
    council = AgentCouncil([2, 10, 1])  # Newton, Einstein, Muhammad
    print(f"\nCouncil Members: {[agent.name for agent in council.agents]}")
    
    # Show available skills
    council_skills = council.get_council_skills()
    print(f"\n🎭 Council Skills:")
    for agent_name, skills in council_skills.items():
        print(f"  {agent_name}: {skills}")
    
    # Collaborative analysis
    print(f"\n🔍 Collaborative Analysis:")
    analysis = council.collaborative_analysis("What are the ethical implications of AI development?")
    print(f"Problem: {analysis['problem']}")
    print(f"Summary: {analysis['summary'][:300]}...")
    
    # Brainstorm solutions
    print(f"\n💡 Brainstorming Solutions:")
    solutions = council.brainstorm_solutions("How to address climate change through innovation?")
    print(f"Challenge: {solutions['challenge']}")
    print(f"Top Recommendations: {len(solutions['recommendations'])} solutions ranked")
    
    # Strategic planning
    print(f"\n📋 Strategic Planning:")
    planning = council.strategic_planning("How to structure international scientific cooperation?")
    print(f"Situation: {planning['situation']}")
    print(f"Consensus: {planning['consensus_strategy'][:300]}...")

def demo_skill_registry():
    """Demonstrate skill registry."""
    print("\n\n🛠️ Skill Registry Demo")
    print("=" * 50)
    
    registry = SkillRegistry()
    
    # Show all skills
    all_skills = registry.get_all_skills()
    print(f"\n📚 Available Skills:")
    for skill_name, skill in all_skills.items():
        print(f"  {skill_name}: {skill.description}")
        print(f"    Domains: {', '.join(skill.domains)}")
    
    # Test skill compatibility
    print(f"\n🔍 Skill Compatibility Check:")
    test_agents = [2, 10, 1, 27]  # Newton, Einstein, Muhammad, Marx
    
    for agent_id in test_agents:
        agent = by_id(agent_id)
        available = registry.get_available_skills(agent_id)
        print(f"  {agent['name']}: {available}")

def demo_enhanced_prompts():
    """Demonstrate enhanced prompts with skills."""
    print("\n\n💬 Enhanced Prompts Demo")
    print("=" * 50)
    
    newton = EnhancedAgent(2)
    
    # Regular prompt
    regular_prompt = newton.get_system_prompt()
    print(f"\n📝 Regular Prompt Length: {len(regular_prompt)} chars")
    
    # Skill-enhanced prompt
    skill_prompt = newton.get_skill_prompt("analysis", {
        "description": "Analyze the physics of time travel"
    })
    print(f"🎯 Skill-Enhanced Prompt Length: {len(skill_prompt)} chars")
    print(f"Enhancement Preview: {skill_prompt[-300:]}...")

if __name__ == "__main__":
    try:
        demo_individual_skills()
        demo_council_skills()
        demo_skill_registry()
        demo_enhanced_prompts()
        
        print("\n\n✅ All demos completed successfully!")
        print("\n🚀 Next Steps:")
        print("1. Add more specialized skills (writing, negotiation, research)")
        print("2. Implement skill chaining (agent uses multiple skills in sequence)")
        print("3. Add skill proficiency levels (expert, advanced, beginner)")
        print("4. Create skill-based agent selection algorithms")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
