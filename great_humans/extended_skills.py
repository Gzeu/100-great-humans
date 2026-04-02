"""Extended skills for Great Humans agents."""

from typing import Dict, List, Any
from .skills import Skill
from .loader import by_id

class WritingSkill(Skill):
    """Writing and communication skill."""
    
    def __init__(self):
        super().__init__(
            name="writing",
            description="Compose compelling narratives, write persuasive arguments, create clear documentation",
            domains=["arts", "politics", "philosophy", "religion"]
        )
    
    def _execute_skill(self, agent: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        task = context.get("task", "")
        audience = context.get("audience", "general")
        agent_name = agent.get("name", "Unknown")
        communication_style = agent.get("persona", {}).get("communication_style", [])
        
        writing = f"""As {agent_name}, I approach this writing task with my characteristic {', '.join(communication_style[:2])} style.

**Writing Strategy:**
Based on my historical experience and communication approach, here's how I would structure this piece.

**Key Elements:**
I would include these essential components and arguments, drawing from my core values and expertise.

**Tone and Style:**
My writing would reflect my authentic voice while adapting to the {audience} audience.

**Historical Context:**
I would incorporate these relevant historical parallels and lessons from my time."""
        
        return {
            "agent": agent_name,
            "skill": "writing",
            "written_content": writing,
            "writing_style": communication_style[0] if communication_style else "persuasive",
            "word_count_estimate": len(writing.split()) * 1.5
        }

class NegotiationSkill(Skill):
    """Negotiation and diplomacy skill."""
    
    def __init__(self):
        super().__init__(
            name="negotiation",
            description="Navigate conflicts, find common ground, achieve win-win solutions",
            domains=["politics", "business", "diplomacy", "law"]
        )
    
    def _execute_skill(self, agent: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        conflict = context.get("conflict", "")
        parties = context.get("parties", [])
        agent_name = agent.get("name", "Unknown")
        decision_heuristics = agent.get("persona", {}).get("decision_heuristics", [])
        core_values = agent.get("persona", {}).get("core_values", [])
        
        negotiation = f"""As {agent_name}, I approach this negotiation guided by my core values: {', '.join(core_values[:2])}.

**Negotiation Framework:**
Using my decision-making approach of {', '.join(decision_heuristics[:2])}, here's my strategy.

**Stakeholder Analysis:**
I would assess each party's interests and constraints based on my historical diplomatic experience.

**Common Ground Opportunities:**
These areas represent potential win-win solutions that honor all parties' core needs.

**Implementation Strategy:**
Here's how I would structure the agreement and ensure long-term success."""
        
        return {
            "agent": agent_name,
            "skill": "negotiation",
            "negotiation_strategy": negotiation,
            "success_probability": 0.78,
            "approach": "diplomatic"
        }

class ResearchSkill(Skill):
    """Research and investigation skill."""
    
    def __init__(self):
        super().__init__(
            name="research",
            description="Conduct systematic investigation, gather evidence, draw evidence-based conclusions",
            domains=["science", "philosophy", "medicine", "history"]
        )
    
    def _execute_skill(self, agent: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        topic = context.get("topic", "")
        methodology = context.get("methodology", "systematic")
        agent_name = agent.get("name", "Unknown")
        expertise = agent.get("knowledge_profile", {}).get("expertise", [])
        cognitive_style = agent.get("persona", {}).get("cognitive_style", [])
        
        research = f"""As {agent_name}, I would research this topic using my expertise in {', '.join(expertise[:2])}.

**Research Methodology:**
My cognitive style of {', '.join(cognitive_style[:2])} leads me to adopt this systematic approach.

**Data Collection Strategy:**
I would gather these types of evidence and sources, prioritizing reliability and relevance.

**Analysis Framework:**
Here's how I would structure my investigation and ensure methodological rigor.

**Expected Outcomes:**
Based on my historical research experience, I anticipate these types of findings and conclusions."""
        
        return {
            "agent": agent_name,
            "skill": "research",
            "research_plan": research,
            "methodology": methodology,
            "expertise_areas": expertise[:3],
            "reliability_score": 0.91
        }

class EngineeringSkill(Skill):
    """Engineering and technical problem-solving skill."""
    
    def __init__(self):
        super().__init__(
            name="engineering",
            description="Design practical solutions, optimize systems, solve technical challenges",
            domains=["technology", "science", "architecture", "mathematics"]
        )
    
    def _execute_skill(self, agent: Dict[str, Any], context: Dict[str, Any]) -> Dict[str, Any]:
        problem = context.get("problem", "")
        constraints = context.get("constraints", [])
        agent_name = agent.get("name", "Unknown")
        expertise = agent.get("knowledge_profile", {}).get("expertise", [])
        decision_heuristics = agent.get("persona", {}).get("decision_heuristics", [])
        
        engineering = f"""As {agent_name}, I would approach this engineering challenge using my expertise in {', '.join(expertise[:2])}.

**Engineering Approach:**
My decision-making heuristics of {', '.join(decision_heuristics[:2])} guide my technical problem-solving.

**Design Considerations:**
I would optimize for these key factors while working within the given constraints.

**Implementation Strategy:**
Here's my systematic approach to developing and testing the solution.

**Innovation Elements:**
Based on my historical innovations, I would incorporate these novel approaches."""
        
        return {
            "agent": agent_name,
            "skill": "engineering",
            "technical_solution": engineering,
            "feasibility_score": 0.85,
            "innovation_level": "high"
        }

class ExtendedSkillRegistry:
    """Registry including extended skills."""
    
    def __init__(self):
        from .skills import SkillRegistry
        self.base_registry = SkillRegistry()
        
        # Add extended skills
        self.base_registry.skills.update({
            "writing": WritingSkill(),
            "negotiation": NegotiationSkill(),
            "research": ResearchSkill(),
            "engineering": EngineeringSkill()
        })
    
    def get_skill(self, skill_name: str):
        """Get skill by name."""
        return self.base_registry.get_skill(skill_name)
    
    def get_available_skills(self, agent_id: int) -> List[str]:
        """Get list of skills available to specific agent."""
        return self.base_registry.get_available_skills(agent_id)
    
    def execute_skill(self, agent_id: int, skill_name: str, context: Dict[str, Any]):
        """Execute skill for agent."""
        return self.base_registry.execute_skill(agent_id, skill_name, context)
    
    def get_all_skills(self):
        """Get all available skills."""
        return self.base_registry.get_all_skills()
    
    def get_skills_by_domain(self, domain: str) -> List[str]:
        """Get skills relevant to specific domain."""
        domain_skills = []
        for skill_name, skill in self.get_all_skills().items():
            if domain in skill.domains:
                domain_skills.append(skill_name)
        return domain_skills
