"""Proficiency levels system for Great Humans agents."""

from typing import Dict, List, Any, Optional
from enum import Enum
from .loader import by_id

class ProficiencyLevel(Enum):
    """Proficiency levels for skills."""
    BEGINNER = 1
    INTERMEDIATE = 2
    ADVANCED = 3
    EXPERT = 4
    MASTER = 5

class AgentProficiency:
    """Manages skill proficiency levels for agents."""
    
    def __init__(self, agent_id: int):
        self.agent_id = agent_id
        self.agent_data = by_id(agent_id)
        self.proficiencies = self._initialize_proficiencies()
    
    def _initialize_proficiencies(self) -> Dict[str, ProficiencyLevel]:
        """Initialize proficiency levels based on agent's historical achievements."""
        proficiencies = {}
        
        # Base proficiencies by domain expertise
        expertise = self.agent_data.get("knowledge_profile", {}).get("expertise", [])
        domains = self.agent_data.get("categories", {}).get("domains", [])
        
        # Domain-specific proficiency mapping
        domain_proficiency_map = {
            "science": ProficiencyLevel.EXPERT,
            "mathematics": ProficiencyLevel.EXPERT,
            "physics": ProficiencyLevel.EXPERT,
            "philosophy": ProficiencyLevel.ADVANCED,
            "politics": ProficiencyLevel.ADVANCED,
            "arts": ProficiencyLevel.ADVANCED,
            "religion": ProficiencyLevel.EXPERT,
            "technology": ProficiencyLevel.INTERMEDIATE,
            "medicine": ProficiencyLevel.ADVANCED,
            "literature": ProficiencyLevel.ADVANCED,
            "military": ProficiencyLevel.INTERMEDIATE,
            "business": ProficiencyLevel.BEGINNER
        }
        
        # Skill-specific proficiency mapping
        skill_proficiency_map = {
            "analysis": self._get_analysis_proficiency(),
            "creativity": self._get_creativity_proficiency(),
            "leadership": self._get_leadership_proficiency(),
            "teaching": self._get_teaching_proficiency(),
            "writing": self._get_writing_proficiency(),
            "negotiation": self._get_negotiation_proficiency(),
            "research": self._get_research_proficiency(),
            "engineering": self._get_engineering_proficiency()
        }
        
        # Combine domain and skill proficiencies
        for skill, base_level in skill_proficiency_map.items():
            # Boost proficiency if agent has relevant domain expertise
            boost = self._calculate_domain_boost(skill, domains, expertise)
            new_value = base_level.value + boost
            final_value = min(new_value, ProficiencyLevel.MASTER.value)
            final_level = ProficiencyLevel(final_value)
            proficiencies[skill] = final_level
        
        return proficiencies
    
    def _get_analysis_proficiency(self) -> ProficiencyLevel:
        """Get base analysis proficiency."""
        rank = self.agent_data.get("rank", 100)
        
        # Top 10 ranks get expert or master
        if rank <= 5:
            return ProficiencyLevel.MASTER
        elif rank <= 10:
            return ProficiencyLevel.EXPERT
        elif rank <= 30:
            return ProficiencyLevel.ADVANCED
        elif rank <= 60:
            return ProficiencyLevel.INTERMEDIATE
        else:
            return ProficiencyLevel.BEGINNER
    
    def _get_creativity_proficiency(self) -> ProficiencyLevel:
        """Get base creativity proficiency."""
        creative_domains = ["arts", "technology", "science", "philosophy"]
        agent_domains = self.agent_data.get("categories", {}).get("domains", [])
        
        if any(domain in agent_domains for domain in creative_domains):
            return ProficiencyLevel.ADVANCED
        else:
            return ProficiencyLevel.INTERMEDIATE
    
    def _get_leadership_proficiency(self) -> ProficiencyLevel:
        """Get base leadership proficiency."""
        leadership_domains = ["politics", "military", "religion"]
        agent_domains = self.agent_data.get("categories", {}).get("domains", [])
        
        if any(domain in agent_domains for domain in leadership_domains):
            return ProficiencyLevel.ADVANCED
        else:
            return ProficiencyLevel.BEGINNER
    
    def _get_teaching_proficiency(self) -> ProficiencyLevel:
        """Get base teaching proficiency."""
        # Most historical figures have some teaching capability
        return ProficiencyLevel.INTERMEDIATE
    
    def _get_writing_proficiency(self) -> ProficiencyLevel:
        """Get base writing proficiency."""
        writing_domains = ["arts", "politics", "philosophy", "religion"]
        agent_domains = self.agent_data.get("categories", {}).get("domains", [])
        
        if any(domain in agent_domains for domain in writing_domains):
            return ProficiencyLevel.ADVANCED
        else:
            return ProficiencyLevel.INTERMEDIATE
    
    def _get_negotiation_proficiency(self) -> ProficiencyLevel:
        """Get base negotiation proficiency."""
        negotiation_domains = ["politics", "business", "law"]
        agent_domains = self.agent_data.get("categories", {}).get("domains", [])
        
        if any(domain in agent_domains for domain in negotiation_domains):
            return ProficiencyLevel.ADVANCED
        else:
            return ProficiencyLevel.BEGINNER
    
    def _get_research_proficiency(self) -> ProficiencyLevel:
        """Get base research proficiency."""
        research_domains = ["science", "philosophy", "medicine", "history"]
        agent_domains = self.agent_data.get("categories", {}).get("domains", [])
        
        if any(domain in agent_domains for domain in research_domains):
            return ProficiencyLevel.ADVANCED
        else:
            return ProficiencyLevel.INTERMEDIATE
    
    def _get_engineering_proficiency(self) -> ProficiencyLevel:
        """Get base engineering proficiency."""
        engineering_domains = ["technology", "science", "mathematics"]
        agent_domains = self.agent_data.get("categories", {}).get("domains", [])
        
        if any(domain in agent_domains for domain in engineering_domains):
            return ProficiencyLevel.INTERMEDIATE
        else:
            return ProficiencyLevel.BEGINNER
    
    def _calculate_domain_boost(self, skill: str, domains: List[str], expertise: List[str]) -> int:
        """Calculate proficiency boost based on domain expertise."""
        skill_domain_map = {
            "analysis": ["science", "mathematics", "philosophy"],
            "creativity": ["arts", "technology", "science"],
            "leadership": ["politics", "military", "religion"],
            "teaching": ["philosophy", "religion", "science"],
            "writing": ["arts", "politics", "philosophy"],
            "negotiation": ["politics", "business", "law"],
            "research": ["science", "philosophy", "medicine"],
            "engineering": ["technology", "science", "mathematics"]
        }
        
        relevant_domains = skill_domain_map.get(skill, [])
        boost = 0
        
        for domain in relevant_domains:
            if domain in domains:
                boost += 1
            # Extra boost for specific expertise
            for exp in expertise:
                if domain.lower() in exp.lower():
                    boost += 1
        
        return min(boost, 2)  # Cap boost at 2 levels
    
    def get_proficiency(self, skill: str) -> ProficiencyLevel:
        """Get proficiency level for specific skill."""
        return self.proficiencies.get(skill, ProficiencyLevel.BEGINNER)
    
    def set_proficiency(self, skill: str, level: ProficiencyLevel):
        """Manually set proficiency level (for learning system)."""
        self.proficiencies[skill] = level
    
    def improve_proficiency(self, skill: str, amount: int = 1):
        """Improve proficiency through practice/experience."""
        current = self.get_proficiency(skill)
        new_level = min(ProficiencyLevel.MASTER, ProficiencyLevel(current.value + amount))
        self.proficiencies[skill] = new_level
        return new_level
    
    def get_all_proficiencies(self) -> Dict[str, ProficiencyLevel]:
        """Get all proficiency levels."""
        return self.proficiencies.copy()
    
    def get_proficiency_score(self, skill: str) -> float:
        """Get numeric proficiency score (0.0 to 1.0)."""
        level = self.get_proficiency(skill)
        return level.value / 5.0
    
    def can_execute_skill(self, skill: str, min_level: ProficiencyLevel = ProficiencyLevel.BEGINNER) -> bool:
        """Check if agent can execute skill at minimum level."""
        return self.get_proficiency(skill).value >= min_level.value

class ProficiencyEnhancedSkill:
    """Skill execution with proficiency-based modifications."""
    
    def __init__(self, base_skill, proficiency: ProficiencyLevel):
        self.base_skill = base_skill
        self.proficiency = proficiency
    
    def execute(self, agent_id: int, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute skill with proficiency-based enhancements."""
        result = self.base_skill._execute_skill(self.base_skill.agent_data, context)
        
        # Add proficiency-based modifications
        proficiency_modifier = self.proficiency.value / 5.0
        
        result["proficiency_level"] = self.proficiency.name
        result["proficiency_score"] = proficiency_modifier
        result["quality_multiplier"] = 0.5 + (proficiency_modifier * 0.5)  # 0.5 to 1.0
        
        # Adjust confidence based on proficiency
        if "confidence" in result:
            result["confidence"] = min(1.0, result["confidence"] * (0.7 + proficiency_modifier * 0.3))
        
        # Add proficiency-specific insights
        result["proficiency_insights"] = self._get_proficiency_insights()
        
        return result
    
    def _get_proficiency_insights(self) -> str:
        """Get insights based on proficiency level."""
        insights = {
            ProficiencyLevel.BEGINNER: "I'm still developing this skill, but I'll apply my core principles diligently.",
            ProficiencyLevel.INTERMEDIATE: "I have solid experience with this and can provide reliable guidance.",
            ProficiencyLevel.ADVANCED: "I'm quite accomplished in this area and can offer nuanced perspectives.",
            ProficiencyLevel.EXPERT: "I have mastered this domain and can provide authoritative insights.",
            ProficiencyLevel.MASTER: "I've achieved the highest level of expertise and can offer transformative wisdom."
        }
        
        return insights.get(self.proficiency, "Unknown proficiency level.")
