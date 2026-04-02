# 100 Great Humans

This repository collects detailed YAML profiles and summaries of the 100 people ranked in Michael H. Hart's book *The 100: A Ranking of the Most Influential Persons in History* (1992).

## **Project Status:** 

All 100 personalities have been processed with full YAML profiles and AI agent archetypes:

- **100 YAML files**: `data/people/001-muhammad.yml` → `data/people/100-mahavira.yml`
- **JSON manifest**: `output/agents-hart-100.json` (203KB, 100 agents)
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
├── output/
│   └── agents-hart-100.json  # Generated agent manifest
├── scripts/
│   └── generate_agents_json.py  # YAML → JSON conversion script
├── 100-great-humans.md     # Full list and descriptions
└── README.md               # This file
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
```

## **Agent Manifest**

The `output/agents-hart-100.json` file contains structured AI agent definitions generated from the YAML profiles, suitable for LLM-based persona systems.

## **Content Sources**

- **Base list**: Michael H. Hart's *The 100: A Ranking of the Most Influential Persons in History* (1992)
- **Reference**: History Wiki entry on the book for role labels
- **Original content**: All YAML profiles and agent archetypes are newly written
- **Historical accuracy**: Based on Britannica, Wikipedia, and scholarly sources

## **Usage**

### Generate JSON Manifest
```bash
python scripts/generate_agents_json.py \
    --input-dir data/people \
    --output-file output/agents-hart-100.json
```

### Load Individual Profile
```python
import yaml
with open('data/people/001-muhammad.yml', 'r') as f:
    profile = yaml.safe_load(f)
```

### Load All Agents
```python
import json
with open('output/agents-hart-100.json', 'r') as f:
    agents = json.load(f)  # List of 100 agent dictionaries
```

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
