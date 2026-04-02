"""Skill chaining system for Great Humans agents."""

from typing import List, Dict, Any, Optional
from .extended_skills import ExtendedSkillRegistry
from .agent_enhanced import EnhancedAgent

class SkillChain:
    """Chain of skills to execute in sequence."""
    
    def __init__(self, agent_id: int, skill_sequence: List[str], context: Dict[str, Any]):
        self.agent_id = agent_id
        self.skill_sequence = skill_sequence
        self.context = context
        self.skill_registry = ExtendedSkillRegistry()
        self.agent = EnhancedAgent(agent_id)
        
        # Validate skill sequence
        self._validate_sequence()
    
    def _validate_sequence(self):
        """Validate that agent can execute all skills in sequence."""
        available_skills = self.skill_registry.get_available_skills(self.agent_id)
        
        for skill in self.skill_sequence:
            if skill not in available_skills:
                raise ValueError(f"Agent {self.agent_id} cannot execute skill: {skill}")
    
    def execute_chain(self) -> Dict[str, Any]:
        """Execute the complete skill chain."""
        results = []
        current_context = self.context.copy()
        
        for i, skill_name in enumerate(self.skill_sequence):
            try:
                # Execute skill
                result = self.skill_registry.execute_skill(self.agent_id, skill_name, current_context)
                result["step"] = i + 1
                result["skill"] = skill_name
                results.append(result)
                
                # Update context for next skill
                current_context = self._update_context(current_context, result, skill_name)
                
            except Exception as e:
                error_result = {
                    "step": i + 1,
                    "skill": skill_name,
                    "error": str(e),
                    "agent": self.agent.name
                }
                results.append(error_result)
                break
        
        return {
            "agent": self.agent.name,
            "agent_id": self.agent_id,
            "skill_sequence": self.skill_sequence,
            "results": results,
            "completed": len(results) == len(self.skill_sequence) and not any("error" in r for r in results),
            "final_context": current_context
        }
    
    def _update_context(self, current_context: Dict[str, Any], result: Dict[str, Any], skill_name: str) -> Dict[str, Any]:
        """Update context based on skill result for next skill in chain."""
        updated_context = current_context.copy()
        
        # Add previous skill insights to context
        if skill_name == "analysis":
            updated_context["previous_analysis"] = result.get("analysis", "")
        elif skill_name == "creativity":
            updated_context["creative_solutions"] = result.get("creative_solutions", "")
        elif skill_name == "leadership":
            updated_context["strategic_guidance"] = result.get("strategic_guidance", "")
        elif skill_name == "teaching":
            updated_context["educational_content"] = result.get("lesson_plan", "")
        elif skill_name == "writing":
            updated_context["written_content"] = result.get("written_content", "")
        elif skill_name == "negotiation":
            updated_context["negotiation_strategy"] = result.get("negotiation_strategy", "")
        elif skill_name == "research":
            updated_context["research_plan"] = result.get("research_plan", "")
        elif skill_name == "engineering":
            updated_context["technical_solution"] = result.get("technical_solution", "")
        
        return updated_context

class PredefinedChains:
    """Predefined skill chains for common tasks."""
    
    @staticmethod
    def research_and_analysis(agent_id: int, topic: str) -> SkillChain:
        """Chain: Research → Analysis"""
        return SkillChain(
            agent_id=agent_id,
            skill_sequence=["research", "analysis"],
            context={"topic": topic, "methodology": "systematic"}
        )
    
    @staticmethod
    def creative_problem_solving(agent_id: int, challenge: str) -> SkillChain:
        """Chain: Analysis → Creativity → Engineering"""
        return SkillChain(
            agent_id=agent_id,
            skill_sequence=["analysis", "creativity", "engineering"],
            context={"challenge": challenge, "constraints": ["time", "resources"]}
        )
    
    @staticmethod
    def strategic_communication(agent_id: int, situation: str, audience: str) -> SkillChain:
        """Chain: Analysis → Leadership → Writing"""
        return SkillChain(
            agent_id=agent_id,
            skill_sequence=["analysis", "leadership", "writing"],
            context={"situation": situation, "audience": audience}
        )
    
    @staticmethod
    def diplomatic_solution(agent_id: int, conflict: str, parties: List[str]) -> SkillChain:
        """Chain: Research → Negotiation → Writing"""
        return SkillChain(
            agent_id=agent_id,
            skill_sequence=["research", "negotiation", "writing"],
            context={"conflict": conflict, "parties": parties}
        )
    
    @staticmethod
    def educational_program(agent_id: int, topic: str, audience: str) -> SkillChain:
        """Chain: Research → Teaching → Writing"""
        return SkillChain(
            agent_id=agent_id,
            skill_sequence=["research", "teaching", "writing"],
            context={"topic": topic, "audience": audience}
        )
    
    @staticmethod
    def innovation_development(agent_id: int, problem: str, constraints: List[str]) -> SkillChain:
        """Chain: Research → Creativity → Engineering → Writing"""
        return SkillChain(
            agent_id=agent_id,
            skill_sequence=["research", "creativity", "engineering", "writing"],
            context={"problem": problem, "constraints": constraints}
        )

class ChainOptimizer:
    """Optimizes skill chains for best results."""
    
    def __init__(self):
        self.skill_registry = ExtendedSkillRegistry()
    
    def suggest_optimal_chain(self, agent_id: int, task_type: str, context: Dict[str, Any]) -> List[str]:
        """Suggest optimal skill chain for given task type."""
        available_skills = self.skill_registry.get_available_skills(agent_id)
        
        # Task type mappings
        task_chains = {
            "research_task": ["research", "analysis"],
            "creative_task": ["analysis", "creativity"],
            "leadership_task": ["analysis", "leadership"],
            "teaching_task": ["research", "teaching"],
            "negotiation_task": ["research", "negotiation"],
            "engineering_task": ["analysis", "engineering"],
            "writing_task": ["research", "writing"],
            "strategic_task": ["analysis", "leadership", "writing"],
            "innovation_task": ["research", "creativity", "engineering"],
            "diplomatic_task": ["research", "negotiation", "writing"]
        }
        
        suggested_chain = task_chains.get(task_type, ["analysis"])
        
        # Filter to only available skills
        optimal_chain = [skill for skill in suggested_chain if skill in available_skills]
        
        return optimal_chain if optimal_chain else available_skills[:1]
    
    def evaluate_chain_effectiveness(self, agent_id: int, skill_sequence: List[str]) -> Dict[str, Any]:
        """Evaluate potential effectiveness of a skill chain."""
        available_skills = self.skill_registry.get_available_skills(agent_id)
        
        # Check if all skills are available
        missing_skills = [skill for skill in skill_sequence if skill not in available_skills]
        
        if missing_skills:
            return {
                "agent_id": agent_id,
                "skill_sequence": skill_sequence,
                "effective": False,
                "missing_skills": missing_skills,
                "reason": "Agent cannot execute all skills in sequence"
            }
        
        # Evaluate skill synergy
        synergy_scores = {
            ("research", "analysis"): 0.9,
            ("analysis", "creativity"): 0.8,
            ("creativity", "engineering"): 0.9,
            ("leadership", "writing"): 0.8,
            ("negotiation", "writing"): 0.9,
            ("teaching", "writing"): 0.8,
            ("research", "teaching"): 0.7,
            ("analysis", "leadership"): 0.8
        }
        
        total_synergy = 0
        synergy_count = 0
        
        for i in range(len(skill_sequence) - 1):
            pair = (skill_sequence[i], skill_sequence[i + 1])
            synergy = synergy_scores.get(pair, 0.5)  # Default synergy
            total_synergy += synergy
            synergy_count += 1
        
        avg_synergy = total_synergy / synergy_count if synergy_count > 0 else 0.5
        
        return {
            "agent_id": agent_id,
            "skill_sequence": skill_sequence,
            "effective": True,
            "synergy_score": avg_synergy,
            "chain_length": len(skill_sequence),
            "recommendation": "Highly effective" if avg_synergy > 0.8 else "Moderately effective" if avg_synergy > 0.6 else "Limited effectiveness"
        }
