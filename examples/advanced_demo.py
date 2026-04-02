#!/usr/bin/env python3
"""Comprehensive demonstration of advanced Great Humans features."""

import sys
from pathlib import Path

# Add great_humans to path
sys.path.append(str(Path(__file__).parent.parent))

from great_humans import *

def demo_extended_skills():
    """Demonstrate extended skills."""
    print("🎯 Extended Skills Demo")
    print("=" * 50)
    
    # Test writing skill with Shakespeare
    shakespeare = EnhancedAgent(31)  # Shakespeare
    print(f"\n✍️ {shakespeare.name}'s Available Skills: {shakespeare.available_skills}")
    
    if "writing" in shakespeare.available_skills:
        writing_result = shakespeare.use_skill("writing", {
            "task": "Write a soliloquy about the nature of time",
            "audience": "literary"
        })
        print(f"\n📝 Writing Result:")
        print(f"Agent: {writing_result['agent']}")
        print(f"Writing Style: {writing_result['writing_style']}")
        print(f"Word Count Estimate: {writing_result['word_count_estimate']}")
        print(f"Content Preview: {writing_result['written_content'][:200]}...")
    
    # Test negotiation skill with Lincoln
    lincoln = EnhancedAgent(26)  # Lincoln
    print(f"\n🤝 {lincoln.name}'s Available Skills: {lincoln.available_skills}")
    
    if "negotiation" in lincoln.available_skills:
        negotiation_result = lincoln.use_skill("negotiation", {
            "conflict": "Disagreement between states' rights and federal authority",
            "parties": ["Northern states", "Southern states"]
        })
        print(f"\n🤝 Negotiation Result:")
        print(f"Agent: {negotiation_result['agent']}")
        print(f"Success Probability: {negotiation_result['success_probability']}")
        print(f"Approach: {negotiation_result['approach']}")
        print(f"Strategy Preview: {negotiation_result['negotiation_strategy'][:200]}...")

def demo_skill_chaining():
    """Demonstrate skill chaining."""
    print("\n\n⛓ Skill Chaining Demo")
    print("=" * 50)
    
    # Use predefined chain
    chain = PredefinedChains.creative_problem_solving(
        agent_id=2,  # Einstein
        challenge="How to achieve sustainable energy for all humanity"
    )
    
    print(f"\n🔗 Creative Problem Solving Chain:")
    print(f"Agent: {chain.agent.name}")
    print(f"Skills: {chain.skill_sequence}")
    
    result = chain.execute_chain()
    print(f"\n📊 Chain Results:")
    print(f"Completed: {result['completed']}")
    print(f"Steps: {len(result['results'])}")
    
    for i, step_result in enumerate(result['results']):
        print(f"\nStep {i+1} - {step_result['skill']}:")
        if "error" in step_result:
            print(f"  ❌ Error: {step_result['error']}")
        else:
            print(f"  ✅ Success: {step_result.get('confidence', 'N/A')} confidence")
    
    # Test chain optimizer
    optimizer = ChainOptimizer()
    evaluation = optimizer.evaluate_chain_effectiveness(2, ["research", "creativity", "engineering"])
    print(f"\n🎯 Chain Evaluation:")
    print(f"Synergy Score: {evaluation['synergy_score']:.2f}")
    print(f"Recommendation: {evaluation['recommendation']}")

def demo_proficiency_levels():
    """Demonstrate proficiency system."""
    print("\n\n📊 Proficiency Levels Demo")
    print("=" * 50)
    
    # Test different agents
    test_agents = [2, 10, 1, 27]  # Einstein, Newton, Muhammad, Marx
    
    for agent_id in test_agents:
        agent = by_id(agent_id)
        proficiency = AgentProficiency(agent_id)
        
        print(f"\n👤 {agent['name']} (Rank {agent_id}):")
        all_proficiencies = proficiency.get_all_proficiencies()
        
        for skill, level in all_proficiencies.items():
            print(f"  {skill}: {level.name} ({level.value}/5)")

def demo_smart_selection():
    """Demonstrate smart skill selection."""
    print("\n\n🧠 Smart Skill Selection Demo")
    print("=" * 50)
    
    selector = SkillSelector()
    
    # Test different tasks
    tasks = [
        "Analyze the ethical implications of artificial intelligence",
        "Create a new approach to education technology",
        "Negotiate peace between conflicting nations",
        "Write a compelling vision for space exploration",
        "Research solutions for climate change"
    ]
    
    for task in tasks:
        best_agent_id, best_skill, score = selector.select_best_agent_skill_pair(task)
        agent = by_id(best_agent_id)
        
        print(f"\n🎯 Task: {task}")
        print(f"👤 Best Agent: {agent['name']} (Rank {best_agent_id})")
        print(f"🛠️ Best Skill: {best_skill}")
        print(f"📊 Fitness Score: {score:.3f}")
    
    # Test diverse council selection
    print(f"\n👥 Diverse Council Selection:")
    council = selector.select_diverse_council("Design a sustainable city", council_size=3)
    
    for agent_id, skill, score in council:
        agent = by_id(agent_id)
        print(f"  {agent['name']}: {skill} ({score:.3f})")

def demo_skill_learning():
    """Demonstrate skill learning system."""
    print("\n\n📚 Skill Learning Demo")
    print("=" * 50)
    
    learning_system = SkillLearningSystem()
    
    # Simulate learning progression for Newton
    agent_id = 2  # Newton
    skill = "analysis"
    
    print(f"\n🍎 Learning Progress for Newton - Analysis Skill:")
    
    # Simulate multiple skill uses
    for i in range(5):
        result = learning_system.execute_skill_with_learning(
            agent_id, skill, 
            {"problem": f"Physics problem {i+1}", "complexity": "medium"}
        )
        
        proficiency = AgentProficiency(agent_id)
        current_level = proficiency.get_proficiency(skill)
        
        print(f"Use {i+1}: {result['current_proficiency']} - {result.get('proficiency_improvement', 'No improvement')}")

def demo_adaptive_system():
    """Demonstrate adaptive system."""
    print("\n\n🤖 Adaptive System Demo")
    print("=" * 50)
    
    adaptive = AdaptiveSkillSystem()
    
    # Get adaptive recommendation
    recommendation = adaptive.get_adaptive_recommendation(
        agent_id=2,  # Newton
        task="Design a new educational system for physics",
        context={"domain": "science", "audience": "students"}
    )
    
    print(f"\n🎯 Adaptive Recommendation:")
    print(f"Basic: {recommendation['basic_recommendation']}")
    print(f"Adjusted: {recommendation['adjusted_recommendation']}")
    print(f"Reasoning: {recommendation['reasoning']}")
    
    # Show learning focus
    print(f"\n📚 Learning Focus: {recommendation['learning_focus']}")

def demo_complete_workflow():
    """Demonstrate complete advanced workflow."""
    print("\n\n🚀 Complete Advanced Workflow Demo")
    print("=" * 50)
    
    # Step 1: Classify task
    classifier = TaskClassifier()
    task = "Create an innovative solution for renewable energy storage"
    task_type = classifier.classify_task(task)
    required_skills = classifier.get_required_skills(task_type)
    
    print(f"📋 Task Classification:")
    print(f"Task: {task}")
    print(f"Type: {task_type}")
    print(f"Required Skills: {required_skills}")
    
    # Step 2: Select best agent-skill combination
    selector = SkillSelector()
    best_agent_id, best_skill, score = selector.select_best_agent_skill_pair(task)
    agent = by_id(best_agent_id)
    
    print(f"\n🎯 Selection:")
    print(f"Agent: {agent['name']}")
    print(f"Skill: {best_skill}")
    print(f"Score: {score:.3f}")
    
    # Step 3: Check proficiency
    proficiency = AgentProficiency(best_agent_id)
    prof_level = proficiency.get_proficiency(best_skill)
    
    print(f"\n📊 Proficiency:")
    print(f"Level: {prof_level.name}")
    print(f"Score: {prof_level.value}/5")
    
    # Step 4: Execute with learning
    learning_system = SkillLearningSystem()
    result = learning_system.execute_skill_with_learning(
        best_agent_id, best_skill,
        {"task": task, "complexity": "high"}
    )
    
    print(f"\n✅ Execution Result:")
    print(f"Success: {result.get('success', 'Unknown')}")
    print(f"Confidence: {result.get('confidence', 'N/A')}")
    print(f"Experience Points: {result.get('experience_points', 0)}")
    
    # Step 5: Get learning statistics
    stats = learning_system.get_learning_statistics(best_agent_id)
    
    print(f"\n📈 Learning Statistics:")
    print(f"Total Events: {stats['total_events']}")
    print(f"Success Rate: {stats['success_rate']:.2f}")
    print(f"Learning Focus: {learning_system.recommend_learning_focus(best_agent_id)}")

if __name__ == "__main__":
    try:
        demo_extended_skills()
        demo_skill_chaining()
        demo_proficiency_levels()
        demo_smart_selection()
        demo_skill_learning()
        demo_adaptive_system()
        demo_complete_workflow()
        
        print("\n\n✅ All advanced demos completed successfully!")
        print("\n🎯 Key Features Demonstrated:")
        print("✅ 8 Skills: Analysis, Creativity, Leadership, Teaching, Writing, Negotiation, Research, Engineering")
        print("✅ Skill Chaining: Sequential skill execution with context passing")
        print("✅ Proficiency Levels: 5 levels from Beginner to Master")
        print("✅ Smart Selection: AI chooses optimal agent-skill combinations")
        print("✅ Learning System: Agents improve skills through practice")
        print("✅ Adaptive System: Recommendations based on learning history")
        print("✅ Complete Workflow: End-to-end intelligent agent selection and execution")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
