"""Enhanced agent system with skills."""

from typing import Dict, List, Any, Optional
from .loader import by_id
from .prompt import build_system_prompt
from .skills import SkillRegistry

class EnhancedAgent:
    """Enhanced agent with skill capabilities."""
    
    def __init__(self, agent_id: int):
        self.agent_id = agent_id
        self.agent_data = by_id(agent_id)
        self.skill_registry = SkillRegistry()
        
        if not self.agent_data:
            raise ValueError(f"Agent not found: {agent_id}")
    
    @property
    def name(self) -> str:
        return self.agent_data.get("name", "Unknown")
    
    @property
    def available_skills(self) -> List[str]:
        """Get list of skills this agent can use."""
        return self.skill_registry.get_available_skills(self.agent_id)
    
    @property
    def domains(self) -> List[str]:
        """Get agent's domains."""
        return self.agent_data.get("categories", {}).get("domains", [])
    
    def use_skill(self, skill_name: str, context: Dict[str, Any]) -> Dict[str, Any]:
        """Execute a skill with context."""
        result = self.skill_registry.execute_skill(self.agent_id, skill_name, context)
        
        # Add agent metadata to result
        result.update({
            "agent_id": self.agent_id,
            "agent_name": self.name,
            "agent_domains": self.domains,
            "execution_timestamp": "2025-01-01"  # Would use real timestamp
        })
        
        return result
    
    def get_system_prompt(self, template: str = "default") -> str:
        """Get system prompt for this agent."""
        return build_system_prompt(self.agent_id, template)
    
    def get_skill_prompt(self, skill_name: str, context: Dict[str, Any]) -> str:
        """Get enhanced system prompt with skill context."""
        base_prompt = self.get_system_prompt()
        skill = self.skill_registry.get_skill(skill_name)
        
        if not skill:
            return base_prompt
        
        skill_context = f"""

## Current Task: {skill_name.title()}
You are currently using your {skill_name} skill to: {skill.description}

## Task Context:
{context.get('description', 'No specific context provided')}

## Skill Instructions:
Apply your {skill_name} abilities using your historical expertise and decision-making approach. Draw from your core values and cognitive style to provide the most authentic and helpful response possible."""
        
        return base_prompt + skill_context

class AgentCouncil:
    """Council of enhanced agents for collaborative problem-solving."""
    
    def __init__(self, agent_ids: List[int]):
        self.agents = [EnhancedAgent(agent_id) for agent_id in agent_ids]
        self.validate_council()
    
    def validate_council(self):
        """Ensure council has diverse capabilities."""
        if len(self.agents) < 2:
            raise ValueError("Council must have at least 2 agents")
        
        # Check for domain diversity
        all_domains = set()
        for agent in self.agents:
            all_domains.update(agent.domains)
        
        if len(all_domains) < 2:
            print("Warning: Council lacks domain diversity")
    
    def get_council_skills(self) -> Dict[str, List[str]]:
        """Get all available skills across council members."""
        council_skills = {}
        for agent in self.agents:
            council_skills[agent.name] = agent.available_skills
        return council_skills
    
    def collaborative_analysis(self, problem: str) -> Dict[str, Any]:
        """Perform collaborative analysis using all agents' analysis skills."""
        results = {}
        
        for agent in self.agents:
            if "analysis" in agent.available_skills:
                try:
                    result = agent.use_skill("analysis", {"problem": problem})
                    results[agent.name] = result
                except Exception as e:
                    results[agent.name] = {"error": str(e)}
        
        return {
            "problem": problem,
            "council_analysis": results,
            "summary": self._synthesize_analysis(results)
        }
    
    def brainstorm_solutions(self, challenge: str) -> Dict[str, Any]:
        """Brainstorm solutions using creativity skills."""
        solutions = {}
        
        for agent in self.agents:
            if "creativity" in agent.available_skills:
                try:
                    result = agent.use_skill("creativity", {"challenge": challenge})
                    solutions[agent.name] = result
                except Exception as e:
                    solutions[agent.name] = {"error": str(e)}
        
        return {
            "challenge": challenge,
            "solutions": solutions,
            "recommendations": self._rank_solutions(solutions)
        }
    
    def strategic_planning(self, situation: str) -> Dict[str, Any]:
        """Create strategic plan using leadership skills."""
        plans = {}
        
        for agent in self.agents:
            if "leadership" in agent.available_skills:
                try:
                    result = agent.use_skill("leadership", {"situation": situation})
                    plans[agent.name] = result
                except Exception as e:
                    plans[agent.name] = {"error": str(e)}
        
        return {
            "situation": situation,
            "strategic_plans": plans,
            "consensus_strategy": self._build_consensus(plans)
        }
    
    def _synthesize_analysis(self, results: Dict[str, Any]) -> str:
        """Synthesize analysis from multiple agents."""
        valid_results = [r for r in results.values() if "error" not in r]
        
        if not valid_results:
            return "No valid analysis results available."
        
        synthesis = "## Council Synthesis\n\n"
        synthesis += f"Analysis from {len(valid_results)} council members:\n\n"
        
        for i, result in enumerate(valid_results, 1):
            agent_name = result.get("agent", "Unknown")
            methodology = result.get("methodology", "Unknown")
            synthesis += f"{i}. **{agent_name}** ({methodology}): Provided structured analysis\n"
        
        synthesis += f"\n**Key Consensus Points:**\n"
        synthesis += "- Multiple perspectives considered\n"
        synthesis += "- Domain-specific insights integrated\n"
        synthesis += "- Historical context applied throughout\n"
        
        return synthesis
    
    def _rank_solutions(self, solutions: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Rank solutions by innovation score."""
        valid_solutions = [s for s in solutions.values() if "error" not in s]
        
        # Sort by innovation score
        ranked = sorted(valid_solutions, 
                      key=lambda x: x.get("innovation_score", 0), 
                      reverse=True)
        
        return ranked[:3]  # Return top 3
    
    def _build_consensus(self, plans: Dict[str, Any]) -> str:
        """Build consensus from strategic plans."""
        valid_plans = [p for p in plans.values() if "error" not in p]
        
        if not valid_plans:
            return "No valid strategic plans available."
        
        consensus = "## Strategic Consensus\n\n"
        consensus += f"Input from {len(valid_plans)} strategic leaders:\n\n"
        
        leadership_styles = [p.get("leadership_style", "Unknown") for p in valid_plans]
        consensus += f"**Leadership Approaches:** {', '.join(set(leadership_styles))}\n\n"
        
        consensus += "**Consensus Strategy:**\n"
        consensus += "- Combine diverse leadership approaches\n"
        consensus += "- Prioritize stakeholder alignment\n"
        consensus += "- Maintain ethical considerations\n"
        consensus += "- Focus on long-term sustainability\n"
        
        return consensus
