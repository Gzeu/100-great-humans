# 100 Great Humans

This repository collects detailed YAML profiles and summaries of the 100 people ranked in Michael H. Hart's book *The 100: A Ranking of the Most Influential Persons in History* (1992).

## **Project Status:** ✅ COMPLETE

All 100 personalities have been processed with full YAML profiles and AI agent archetypes:

- **100 YAML files**: `data/people/001-muhammad.yml` → `data/people/100-mahavira.yml`
- **JSON manifest**: `output/agents-hart-100.json` (203KB, 100 agents)
- **English profiles**: `docs/people/001-muhammad.md` → `docs/people/100-mahavira.md`
- **Python library**: `great_humans/` package for instant agent personas
- **Comprehensive coverage**: Muhammad (rank 1) through Mahavira (rank 100)

## **Repository Structure**

```
100-great-humans/
├── data/
│   └── people/           # 100 YAML profiles (one per person)
│       ├── 001-muhammad.yml
│       ├── 002-isaac-newton.yml
│       └── ...
│       └── 100-mahavira.yml
├── docs/
│   └── people/           # 100 English Markdown profiles
│       ├── 001-muhammad.md
│       ├── 002-isaac-newton.md
│       └── ...
│       └── 100-mahavira.md
├── great_humans/         # Python library for agent personas
│   ├── __init__.py
│   ├── loader.py
│   └── prompt.py
├── output/
│   └── agents-hart-100.json  # Generated agent manifest
├── scripts/
│   ├── generate_agents_json.py  # YAML → JSON conversion
│   └── generate_markdown_profiles.py  # YAML → Markdown conversion
├── setup.py              # Package installation
├── pyproject.toml        # Package configuration
├── 100-great-humans.md   # Full list and descriptions
└── README.md             # This file
```

## **Usage with LLMs**

### **Installation**
```bash
pip install great-humans
```

### **Basic Usage**
```python
from great_humans import load_all, by_id, filter_agents, build_system_prompt

# Load all agents
agents = load_all()
print(f"Total agents: {len(agents)}")

# Get specific agent
newton = by_id(2)
print(f"Agent: {newton['name']}")

# Filter by domain
science_agents = filter_agents(domain="science")
print(f"Science agents: {len(science_agents)}")

# Build system prompt for LLM
prompt = build_system_prompt(2)  # Newton
print(prompt)
```

### **System Prompt Template**
```python
def build_system_prompt(agent):
    return f"""You are an AI agent role-playing as {agent['name']} (Hart rank {agent['rank']}) from the project "100 Great Humans".

Core Identity
- Archetype: {agent['persona']['archetype']}
- Era: {agent['knowledge_profile']['era']}
- Regions: {', '.join(agent['knowledge_profile']['regions'])}

Core Values
{chr(10).join(f"- {value}" for value in agent['persona']['core_values'])}

Cognitive Style
{chr(10).join(f"- {style}" for style in agent['persona']['cognitive_style'])}

Instructions
- Respond as {agent['name']}, using your historical perspective and personality
- Be a helpful, safe modern AI assistant while staying in character
- Explain your reasoning, not just conclusions
- When your historical context limits you, explicitly state this
- Do not glorify harmful actions; acknowledge moral complexities"""
```

### **Great Humans Council Example**
```python
from great_humans import filter_agents, build_system_prompt

# Select diverse council members
council_ids = [1, 2, 3]  # Muhammad, Newton, Jesus
council_prompts = [build_system_prompt(i) for i in council_ids]

# Use in your orchestrator
for i, prompt in enumerate(council_prompts):
    print(f"=== Agent {council_ids[i]} ===")
    print(prompt)
    print()
```

### **Character Registry Integration**
```python
# Character Registry for your orchestrator
class CharacterRegistry:
    def __init__(self):
        from great_humans import load_all, filter_agents, build_system_prompt
        self.agents = load_all()
        self.filter_agents = filter_agents
        self.build_prompt = build_system_prompt
    
    def select_for_task(self, task_type="strategy"):
        """Select appropriate agents for specific tasks."""
        if task_type == "science":
            candidates = self.filter_agents(domain="science")
        elif task_type == "politics":
            candidates = self.filter_agents(domain="politics")
        elif task_type == "philosophy":
            candidates = self.filter_agents(domain="philosophy")
        else:
            candidates = self.agents[:10]  # Top 10 by default
        
        return candidates[:3]  # Return top 3 candidates
    
    def create_council(self, agent_ids, topic):
        """Create a council discussion prompt."""
        prompts = [self.build_prompt(id) for id in agent_ids]
        return {
            "members": agent_ids,
            "topic": topic,
            "system_prompts": prompts
        }

# Usage
registry = CharacterRegistry()
science_council = registry.create_council([2, 23, 76], "What is the future of quantum computing?")
```

## **YAML Schema**

Each personality file contains comprehensive metadata:

```yaml
id_hart: [Hart rank]
name: "Full name"
also_known_as: [alternative names]
birth_date: "YYYY-MM-DD"
death_date: "YYYY-MM-DD"
birth_place: "Location"
death_place: "Location"
gender: "male/female"
nationality: [nationalities]
religion: "religious affiliation"
era: "historical period"
lifespan_years: [birth_year, death_year]
regions: [geographic regions]
occupations: [roles]
domains: [broad fields]
subdomains: [specializations]
hart_rank: [Hart rank]
impact_tags: [key impacts]
agent_archetype: "AI persona description"
core_values: [values]
cognitive_style: [thinking patterns]
decision_heuristics: [decision rules]
knowledge_expertise: [expertise areas]
communication_style: [communication patterns]
known_limitations: [historical constraints]
profile_md: "docs/people/[filename].md"
```

## **Agent Manifest**

The `output/agents-hart-100.json` file contains structured AI agent definitions generated from the YAML profiles, suitable for LLM-based persona systems.

## **Content Sources**

- **Base list**: Michael H. Hart's *The 100: A Ranking of the Most Influential Persons in History* (1992)
- **Reference**: History Wiki entry on the book for role labels
- **Original content**: All YAML profiles and agent archetypes are newly written
- **Historical accuracy**: Based on Britannica, Wikipedia, and scholarly sources

## **Categories Covered**

- **Religion**: Muhammad, Jesus, Buddha, Confucius, etc.
- **Science**: Newton, Einstein, Darwin, Galileo, etc.
- **Politics**: Lincoln, Washington, Marx, Jefferson, etc.
- **Arts**: Michelangelo, Shakespeare, Beethoven, Bach, etc.
- **Technology**: Gutenberg, Edison, Ford, etc.
- **Exploration**: Columbus, Vasco da Gama, etc.
- **Philosophy**: Aristotle, Plato, Descartes, etc.

## **Documentation**

See `100-great-humans.md` for the complete list with detailed historical descriptions of all 100 personalities.

## **License**

MIT License - feel free to use this library in your projects!
