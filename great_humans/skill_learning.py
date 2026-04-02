"""Skill learning and adaptation system for Great Humans agents."""

from typing import Dict, List, Any, Optional
from .proficiency import AgentProficiency, ProficiencyLevel
from .extended_skills import ExtendedSkillRegistry
from .loader import by_id

class SkillLearningSystem:
    """Manages skill learning and adaptation for agents."""
    
    def __init__(self):
        self.skill_registry = ExtendedSkillRegistry()
        self.learning_history = {}  # agent_id -> List[LearningEvent]
        self.learning_thresholds = {
            ProficiencyLevel.BEGINNER: 3,      # 3 successful uses to advance
            ProficiencyLevel.INTERMEDIATE: 5,  # 5 successful uses to advance
            ProficiencyLevel.ADVANCED: 8,      # 8 successful uses to advance
            ProficiencyLevel.EXPERT: 12,        # 12 successful uses to advance
            ProficiencyLevel.MASTER: 9999      # Cannot advance beyond master
        }
    
    def execute_skill_with_learning(self, agent_id: int, skill: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute skill and apply learning mechanics."""
        proficiency = AgentProficiency(agent_id)
        
        # Execute the skill
        result = self.skill_registry.execute_skill(agent_id, skill, context)
        
        # Record learning event
        learning_event = LearningEvent(
            agent_id=agent_id,
            skill=skill,
            context=context,
            result=result,
            success=self._evaluate_success(result),
            timestamp="2025-01-01"  # Would use real timestamp
        )
        
        self._record_learning_event(learning_event)
        
        # Check for proficiency improvement
        improvement = self._check_proficiency_improvement(agent_id, skill)
        
        if improvement:
            result["proficiency_improvement"] = improvement
            result["new_proficiency_level"] = proficiency.get_proficiency(skill).name
        
        result["current_proficiency"] = proficiency.get_proficiency(skill).name
        result["experience_points"] = self._get_experience_points(agent_id, skill)
        
        return result
    
    def _evaluate_success(self, result: Dict[str, Any]) -> bool:
        """Evaluate if skill execution was successful."""
        # Check for explicit success indicators
        if "success" in result:
            return result["success"]
        
        # Check for error indicators
        if "error" in result:
            return False
        
        # Check confidence scores
        if "confidence" in result:
            return result["confidence"] > 0.7
        
        # Check quality scores
        if "quality_multiplier" in result:
            return result["quality_multiplier"] > 0.6
        
        # Default to success if no explicit failure indicators
        return True
    
    def _record_learning_event(self, event: 'LearningEvent'):
        """Record a learning event in history."""
        agent_id = event.agent_id
        if agent_id not in self.learning_history:
            self.learning_history[agent_id] = []
        
        self.learning_history[agent_id].append(event)
    
    def _check_proficiency_improvement(self, agent_id: int, skill: str) -> Optional[str]:
        """Check if agent should improve proficiency."""
        proficiency = AgentProficiency(agent_id)
        current_level = proficiency.get_proficiency(skill)
        
        # Get successful uses count
        successful_uses = self._get_successful_uses_count(agent_id, skill)
        threshold = self.learning_thresholds.get(current_level, 9999)
        
        if successful_uses >= threshold and current_level != ProficiencyLevel.MASTER:
            # Improve proficiency
            old_level = current_level
            new_level = proficiency.improve_proficiency(skill, 1)
            
            return f"Improved from {old_level.name} to {new_level.name}"
        
        return None
    
    def _get_successful_uses_count(self, agent_id: int, skill: str) -> int:
        """Count successful uses of skill by agent."""
        if agent_id not in self.learning_history:
            return 0
        
        successful_count = 0
        for event in self.learning_history[agent_id]:
            if event.skill == skill and event.success:
                successful_count += 1
        
        return successful_count
    
    def _get_experience_points(self, agent_id: int, skill: str) -> int:
        """Get total experience points for agent-skill combination."""
        if agent_id not in self.learning_history:
            return 0
        
        total_points = 0
        for event in self.learning_history[agent_id]:
            if event.skill == skill:
                points = 10 if event.success else 2  # Success gives more points
                total_points += points
        
        return total_points
    
    def get_learning_statistics(self, agent_id: int) -> Dict[str, Any]:
        """Get comprehensive learning statistics for agent."""
        if agent_id not in self.learning_history:
            return {"agent_id": agent_id, "total_events": 0, "skill_statistics": {}}
        
        events = self.learning_history[agent_id]
        proficiency = AgentProficiency(agent_id)
        
        # Calculate statistics
        total_events = len(events)
        successful_events = sum(1 for e in events if e.success)
        success_rate = successful_events / total_events if total_events > 0 else 0
        
        # Skill-specific stats
        skill_stats = {}
        for skill in proficiency.get_all_proficiencies().keys():
            skill_events = [e for e in events if e.skill == skill]
            skill_successful = sum(1 for e in skill_events if e.success)
            skill_success_rate = skill_successful / len(skill_events) if skill_events else 0
            skill_experience = self._get_experience_points(agent_id, skill)
            
            skill_stats[skill] = {
                "uses": len(skill_events),
                "successful_uses": skill_successful,
                "success_rate": skill_success_rate,
                "experience_points": skill_experience,
                "proficiency_level": proficiency.get_proficiency(skill).name
            }
        
        return {
            "agent_id": agent_id,
            "total_events": total_events,
            "successful_events": successful_events,
            "success_rate": success_rate,
            "skill_statistics": skill_stats
        }
    
    def recommend_learning_focus(self, agent_id: int) -> List[str]:
        """Recommend skills for agent to focus on learning."""
        proficiency = AgentProficiency(agent_id)
        stats = self.get_learning_statistics(agent_id)
        
        recommendations = []
        
        for skill, skill_stats in stats["skill_statistics"].items():
            current_prof = proficiency.get_proficiency(skill)
            
            # Recommend if proficiency is low but success rate is high
            if (current_prof.value <= ProficiencyLevel.INTERMEDIATE.value and 
                skill_stats["success_rate"] > 0.7 and
                skill_stats["uses"] >= 3):
                recommendations.append(skill)
            
            # Recommend if agent hasn't used skill much
            elif skill_stats["uses"] < 2:
                recommendations.append(skill)
        
        return recommendations
    
    def simulate_learning_progress(self, agent_id: int, skill: str, target_level: ProficiencyLevel) -> Dict[str, Any]:
        """Simulate learning progress to target proficiency level."""
        proficiency = AgentProficiency(agent_id)
        current_level = proficiency.get_proficiency(skill)
        
        if current_level.value >= target_level.value:
            return {
                "agent_id": agent_id,
                "skill": skill,
                "current_level": current_level.name,
                "target_level": target_level.name,
                "already_achieved": True
            }
        
        # Calculate required successful uses
        required_uses = 0
        temp_level = current_level
        
        while temp_level.value < target_level.value:
            threshold = self.learning_thresholds.get(temp_level, 9999)
            required_uses += threshold
            temp_level = ProficiencyLevel(temp_level.value + 1)
        
        # Estimate based on current success rate
        stats = self.get_learning_statistics(agent_id)
        skill_stats = stats["skill_statistics"].get(skill, {})
        current_success_rate = skill_stats.get("success_rate", 0.5)
        
        estimated_total_uses = required_uses / max(current_success_rate, 0.1)
        
        return {
            "agent_id": agent_id,
            "skill": skill,
            "current_level": current_level.name,
            "target_level": target_level.name,
            "required_successful_uses": required_uses,
            "estimated_total_uses": int(estimated_total_uses),
            "current_success_rate": current_success_rate,
            "estimated_time_to_mastery": f"{int(estimated_total_uses)} uses at current success rate"
        }

class LearningEvent:
    """Represents a single learning event."""
    
    def __init__(self, agent_id: int, skill: str, context: Dict[str, Any], 
                 result: Dict[str, Any], success: bool, timestamp: str):
        self.agent_id = agent_id
        self.skill = skill
        self.context = context
        self.result = result
        self.success = success
        self.timestamp = timestamp

class AdaptiveSkillSystem:
    """Adaptive system that adjusts skill recommendations based on learning."""
    
    def __init__(self):
        self.learning_system = SkillLearningSystem()
        self.skill_selector = None  # Will be initialized when needed
    
    def get_adaptive_recommendation(self, agent_id: int, task: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Get adaptive skill recommendation based on learning history."""
        if context is None:
            context = {}
        
        # Get basic recommendation
        from .skill_selector import SkillSelector
        if not self.skill_selector:
            self.skill_selector = SkillSelector()
        
        basic_rec = self.skill_selector.select_best_agent_skill_pair(task, context)
        
        # Get learning-based adjustments
        learning_stats = self.learning_system.get_learning_statistics(agent_id)
        learning_focus = self.learning_system.recommend_learning_focus(agent_id)
        
        # Adjust recommendation based on learning
        adjusted_recommendation = self._adjust_recommendation(basic_rec, learning_stats, learning_focus)
        
        return {
            "basic_recommendation": basic_rec,
            "adjusted_recommendation": adjusted_recommendation,
            "learning_statistics": learning_stats,
            "learning_focus": learning_focus,
            "reasoning": self._explain_adjustment(basic_rec, adjusted_recommendation, learning_stats)
        }
    
    def _adjust_recommendation(self, basic_rec: tuple, learning_stats: Dict[str, Any], 
                              learning_focus: List[str]) -> tuple:
        """Adjust basic recommendation based on learning data."""
        agent_id, skill, score = basic_rec
        
        # If skill is in learning focus, boost its score
        if skill in learning_focus:
            score = min(score * 1.2, 1.0)  # 20% boost
        
        # Check if agent has low success rate with this skill
        skill_stats = learning_stats["skill_statistics"].get(skill, {})
        success_rate = skill_stats.get("success_rate", 0.5)
        
        if success_rate < 0.4 and skill_stats.get("uses", 0) > 5:
            # Penalty for consistently poor performance
            score = score * 0.7
        
        return (agent_id, skill, score)
    
    def _explain_adjustment(self, basic_rec: tuple, adjusted_rec: tuple, 
                           learning_stats: Dict[str, Any]) -> str:
        """Explain why recommendation was adjusted."""
        basic_agent_id, basic_skill, basic_score = basic_rec
        adj_agent_id, adj_skill, adj_score = adjusted_rec
        
        if basic_score != adj_score:
            return f"Adjusted recommendation based on learning history and success patterns."
        
        return "No adjustment needed - basic recommendation remains optimal."
