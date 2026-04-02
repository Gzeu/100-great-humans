"""Skill system for Great Humans agents."""

from typing import Dict, List, Any, Optional
from .loader import by_id

class Skill:
    """Base skill class for agents."""
    
    def __init__(self, name: str, description: str, domains: List[str]):
        self.name = name
        self.description = description
        self.domains = domains
    
    def can_execute(self, agent_id: int) -> bool:
        """Check if agent can execute this skill."""
        agent = by_id(agent_id)
        if not agent:
            return False
        
        agent_domains = set(agent.get("categories", {}).get("domains", []))
        skill_domains = set(self.domains)
        
        return bool(agent_domains.intersection(skill_domains))
    
    def execute(self, agent_id: int, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute skill with agent context."""
        if not self.can_execute(agent_id):
            raise ValueError(f"Agent {agent_id} cannot execute skill {self.name}")
        
        agent = by_id(agent_id)
        return self._execute_skill(agent, context)
    
    def _execute_skill(self, agent: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        """Override in subclasses."""
        raise NotImplementedError

class AnalysisSkill(Skill):
    """Analysis and critical thinking skill."""
    
    def __init__(self):
        super().__init__(
            name="analysis",
            description="Analyze problems, break down complex issues, provide structured insights",
            domains=["science", "philosophy", "politics", "mathematics"]
        )
    
    def _execute_skill(self, agent: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        problem = context.get("problem", "")
        agent_name = agent.get("name", "Unknown")
        archetype = agent.get("persona", {}).get("archetype", "")
        expertise = agent.get("knowledge_profile", {}).get("expertise", [])
        
        analysis = f"""As {agent_name} ({archetype}), I analyze this problem through my expertise in {', '.join(expertise[:3])}:

**Problem Decomposition:**
I break this down into key components based on my historical perspective and methodological approach.

**Key Insights:**
From my experience, I identify these critical factors and patterns.

**Recommended Approach:**
Based on my cognitive style and decision-making heuristics, here's how I would approach this systematically.

**Potential Limitations:**
I acknowledge these constraints from my historical context and knowledge base."""
        
        return {
            "agent": agent_name,
            "skill": "analysis",
            "analysis": analysis,
            "confidence": 0.85,
            "methodology": archetype
        }

class CreativeSkill(Skill):
    """Creative problem-solving and innovation skill."""
    
    def __init__(self):
        super().__init__(
            name="creativity",
            description="Generate innovative solutions, think outside conventional boundaries",
            domains=["arts", "technology", "science", "philosophy"]
        )
    
    def _execute_skill(self, agent: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        challenge = context.get("challenge", "")
        agent_name = agent.get("name", "Unknown")
        core_values = agent.get("persona", {}).get("core_values", [])
        cognitive_style = agent.get("persona", {}).get("cognitive_style", [])
        
        creativity = f"""As {agent_name}, I approach this challenge creatively through my core values: {', '.join(core_values[:2])}.

**Creative Process:**
My cognitive style of {', '.join(cognitive_style[:2])} leads me to consider unconventional approaches.

**Innovative Solutions:**
Here are novel ideas that emerge from my unique perspective and historical context.

**Implementation Strategy:**
Based on my decision-making heuristics, here's how to bring these creative ideas to reality.

**Ethical Considerations:**
I consider these values and constraints in my creative process."""
        
        return {
            "agent": agent_name,
            "skill": "creativity",
            "creative_solutions": creativity,
            "innovation_score": 0.88,
            "approach": "innovative"
        }

class LeadershipSkill(Skill):
    """Leadership and strategic planning skill."""
    
    def __init__(self):
        super().__init__(
            name="leadership",
            description="Provide strategic guidance, motivate teams, make executive decisions",
            domains=["politics", "military", "business", "religion"]
        )
    
    def _execute_skill(self, agent: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        situation = context.get("situation", "")
        agent_name = agent.get("name", "Unknown")
        archetype = agent.get("persona", {}).get("archetype", "")
        decision_heuristics = agent.get("persona", {}).get("decision_heuristics", [])
        
        leadership = f"""As {agent_name} ({archetype}), I provide leadership for this situation:

**Strategic Assessment:**
I evaluate this situation using my decision-making principles: {', '.join(decision_heuristics[:2])}.

**Leadership Approach:**
Based on my historical experience and cognitive style, here's how I would lead.

**Action Plan:**
These are the specific steps I would take, organized by priority and timeline.

**Team Motivation:**
This is how I would inspire and guide others toward our shared goals.

**Risk Management:**
I identify these potential challenges and mitigation strategies."""
        
        return {
            "agent": agent_name,
            "skill": "leadership",
            "strategic_guidance": leadership,
            "leadership_style": archetype,
            "decision_confidence": 0.92
        }

class TeachingSkill(Skill):
    """Education and knowledge sharing skill."""
    
    def __init__(self):
        super().__init__(
            name="teaching",
            description="Explain complex concepts, educate others, share knowledge effectively",
            domains=["science", "philosophy", "religion", "arts"]
        )
    
    def _execute_skill(self, agent: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        topic = context.get("topic", "")
        audience = context.get("audience", "general")
        agent_name = agent.get("name", "Unknown")
        expertise = agent.get("knowledge_profile", {}).get("expertise", [])
        communication_style = agent.get("persona", {}).get("communication_style", [])
        
        teaching = f"""As {agent_name}, I teach this topic to {audience} audience:

**Teaching Philosophy:**
My approach is shaped by my communication style: {', '.join(communication_style[:2])}.

**Lesson Structure:**
Based on my expertise in {', '.join(expertise[:2])}, here's how I would explain this:

**Key Concepts:**
These are the essential ideas that must be understood, presented in my characteristic manner.

**Learning Objectives:**
By the end of this lesson, students should be able to demonstrate these understandings.

**Assessment Method:**
This is how I would evaluate comprehension and retention."""
        
        return {
            "agent": agent_name,
            "skill": "teaching",
            "lesson_plan": teaching,
            "teaching_style": communication_style[0] if communication_style else "explanatory",
            "expertise_level": "expert"
        }

class SkillRegistry:
    """Registry of all available skills."""
    
    def __init__(self):
        self.skills = {
            "analysis": AnalysisSkill(),
            "creativity": CreativeSkill(),
            "leadership": LeadershipSkill(),
            "teaching": TeachingSkill()
        }
    
    def get_skill(self, skill_name: str) -> Optional[Skill]:
        """Get skill by name."""
        return self.skills.get(skill_name)
    
    def get_available_skills(self, agent_id: int) -> List[str]:
        """Get list of skills available to specific agent."""
        available = []
        for skill_name, skill in self.skills.items():
            if skill.can_execute(agent_id):
                available.append(skill_name)
        return available
    
    def execute_skill(self, agent_id: int, skill_name: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute skill for agent."""
        skill = self.get_skill(skill_name)
        if not skill:
            raise ValueError(f"Skill '{skill_name}' not found")
        
        return skill.execute(agent_id, context)
    
    def get_all_skills(self) -> Dict[str, Skill]:
        """Get all available skills."""
        return self.skills.copy()
