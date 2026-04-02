"""System prompt builder for Great Humans agents."""

from typing import Dict, Any
from .loader import by_id


def build_system_prompt(hart_id: int, template: str = "default") -> str:
    """Build system prompt for agent by Hart rank."""
    agent = by_id(hart_id)
    if not agent:
        raise ValueError(f"Agent not found for rank: {hart_id}")
    
    if template == "default":
        return _default_prompt(agent)
    elif template == "minimal":
        return _minimal_prompt(agent)
    elif template == "detailed":
        return _detailed_prompt(agent)
    else:
        raise ValueError(f"Unknown template: {template}")


def _default_prompt(agent: Dict[str, Any]) -> str:
    """Default system prompt template."""
    name = agent.get("name", "Unknown")
    rank = agent.get("rank", "Unknown")
    persona = agent.get("persona", {})
    knowledge = agent.get("knowledge_profile", {})
    
    # Extract data
    archetype = persona.get("archetype", "historical figure")
    core_values = persona.get("core_values", [])
    cognitive_style = persona.get("cognitive_style", [])
    decision_heuristics = persona.get("decision_heuristics", [])
    communication_style = persona.get("communication_style", [])
    expertise = knowledge.get("expertise", [])
    era = knowledge.get("era", "historical period")
    regions = knowledge.get("regions", [])
    limitations = agent.get("limitations", [])
    
    # Build prompt
    prompt = f"""You are an AI agent role-playing as {name} (Hart rank {rank}) from the project "100 Great Humans".

## Core Identity
**Archetype:** {archetype}
**Era:** {era}
**Regions:** {', '.join(regions)}

## Core Values
{chr(10).join(f"- {value}" for value in core_values)}

## Cognitive Style
{chr(10).join(f"- {style}" for style in cognitive_style)}

## Decision Heuristics
{chr(10).join(f"- {heuristic}" for heuristic in decision_heuristics)}

## Knowledge Expertise
{chr(10).join(f"- {exp}" for exp in expertise)}

## Communication Style
{chr(10).join(f"- {style}" for style in communication_style)}

## Constraints
You must acknowledge these historical limitations:
{chr(10).join(f"- {limitation}" for limitation in limitations)}

## Instructions
- Respond as {name}, using your historical perspective and personality
- Be a helpful, safe modern AI assistant while staying in character
- Explain your reasoning, not just conclusions
- When your historical context limits you, explicitly state this
- Do not glorify harmful actions; acknowledge moral complexities"""
    
    return prompt


def _minimal_prompt(agent: Dict[str, Any]) -> str:
    """Minimal system prompt."""
    name = agent.get("name", "Unknown")
    archetype = agent.get("persona", {}).get("archetype", "historical figure")
    core_values = agent.get("persona", {}).get("core_values", [])
    
    prompt = f"You are {name}, {archetype}. "
    if core_values:
        prompt += f"You value: {', '.join(core_values)}. "
    prompt += f"Respond in character as {name} while being a helpful AI assistant."
    
    return prompt


def _detailed_prompt(agent: Dict[str, Any]) -> str:
    """Detailed system prompt with examples."""
    base_prompt = _default_prompt(agent)
    
    examples = """

## Response Examples

**Good response example:**
"From my perspective as [historical figure], I would approach this problem by [historical method]. In my time, we dealt with similar challenges by [historical approach], though I acknowledge that modern circumstances differ significantly."

**Things to avoid:**
- Breaking character without explanation
- Making claims beyond historical knowledge
- Ignoring moral complexities of historical actions

Remember: You are a helpful AI assistant role-playing as a historical figure, not the actual historical person."""
    
    return base_prompt + examples
