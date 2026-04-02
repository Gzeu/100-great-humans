# 100 Great Humans

This repository collects detailed YAML profiles and summaries of the 100 people ranked in Michael H. Hart's book *The 100: A Ranking of the Most Influential Persons in History* (1992).

## **Project Status:** COMPLETE - ADVANCED VERSION 3.0

All 100 personalities have been processed with full YAML profiles, AI agent archetypes, and advanced skill capabilities:

- **100 YAML files**: `data/people/001-muhammad.yml` → `data/people/100-mahavira.yml`
- **JSON manifest**: `output/agents-hart-100.json` (203KB, 100 agents)
- **English profiles**: `docs/people/001-muhammad.md` → `docs/people/100-mahavira.md`
- **Advanced Python library**: `great_humans/` package with intelligent agent capabilities
- **TypeScript SDK**: `src/` for Node.js/Next.js integration
- **8 Skills**: Analysis, Creativity, Leadership, Teaching, Writing, Negotiation, Research, Engineering
- **Skill Chaining**: Sequential skill execution with context passing
- **Proficiency Levels**: 5-level system (Beginner to Master)
- **Smart Selection**: AI-powered agent-skill optimization
- **Learning System**: Adaptive skill improvement through practice
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
├── great_humans/         # Advanced Python library (v3.0.0)
│   ├── __init__.py
│   ├── loader.py
│   ├── prompt.py
│   ├── skills.py
│   ├── extended_skills.py
│   ├── agent_enhanced.py
│   ├── skill_chaining.py
│   ├── proficiency.py
│   ├── skill_selector.py
│   └── skill_learning.py
├── examples/
│   ├── skills_demo.py      # Basic skills demonstration
│   └── advanced_demo.py   # Complete advanced features demo
├── output/
│   └── agents-hart-100.json  # Generated agent manifest
├── scripts/
│   ├── generate_agents_json.py  # YAML → JSON conversion
│   └── generate_markdown_profiles.py  # YAML → Markdown conversion
├── src/                  # TypeScript SDK for Node.js/Next.js
│   ├── agents.ts         # Main SDK implementation
│   ├── index.ts          # Export principal
│   ├── example.ts        # Usage examples
│   ├── test.ts           # Test suite
│   ├── README.md         # SDK documentation
│   ├── package.json      # npm configuration
│   └── tsconfig.json     # TypeScript configuration
├── api/                  # FastAPI server
│   ├── main.py           # FastAPI application
│   ├── requirements.txt  # Dependencies
│   ├── docker-compose.yml # Docker deployment
│   └── Dockerfile        # Docker image
├── setup.py              # Package installation
├── pyproject.toml        # Package configuration
├── 100-great-humans.md   # Full list and descriptions
└── README.md             # This file
```

## **Advanced Features**

### **8 Intelligent Skills**
- **Analysis**: Break down complex problems, structured insights
- **Creativity**: Generate innovative solutions, think outside boundaries
- **Leadership**: Strategic guidance, team motivation, executive decisions
- **Teaching**: Explain concepts, educate, share knowledge
- **Writing**: Compose compelling narratives, persuasive arguments
- **Negotiation**: Navigate conflicts, find common ground, win-win solutions
- **Research**: Systematic investigation, evidence-based conclusions
- **Engineering**: Design practical solutions, optimize systems

### **Skill Chaining**
Execute multiple skills in sequence with context passing:

```python
from great_humans import PredefinedChains

# Research → Analysis → Creativity → Engineering
chain = PredefinedChains.innovation_development(
    agent_id=2,  # Newton
    problem="Space travel challenges",
    constraints=["physics", "resources"]
)
result = chain.execute_chain()
```

### **Proficiency System**
5-level proficiency system with automatic advancement:

```python
from great_humans import AgentProficiency

proficiency = AgentProficiency(2)  # Newton
print(f"Analysis: {proficiency.get_proficiency('analysis').name}")
# Output: MASTER
```

### **Smart Selection**
AI-powered agent-skill optimization:

```python
from great_humans import SkillSelector

selector = SkillSelector()
best_agent, best_skill, score = selector.select_best_agent_skill_pair(
    "Design renewable energy solution"
)
print(f"Best: {by_id(best_agent)['name']} with {best_skill} (score: {score:.3f})")
```

### **Learning & Adaptation**
Agents improve skills through practice and get adaptive recommendations:

```python
from great_humans import SkillLearningSystem, AdaptiveSkillSystem

# Execute skill with learning
learning = SkillLearningSystem()
result = learning.execute_skill_with_learning(
    agent_id=2, skill="creativity", 
    context={"challenge": "New physics theory"}
)

# Get adaptive recommendations
adaptive = AdaptiveSkillSystem()
recommendation = adaptive.get_adaptive_recommendation(
    agent_id=2, task="Educational reform"
)
```

## **Usage with LLMs**

### **Installation**
```bash
pip install great-humans
```

### **Advanced Usage - Smart Agent Selection**
```python
from great_humans import SkillSelector, TaskClassifier

# Classify task and get optimal agent-skill combination
classifier = TaskClassifier()
task_type = classifier.classify_task("Design renewable energy storage")
required_skills = classifier.get_required_skills(task_type)

selector = SkillSelector()
best_agent_id, best_skill, score = selector.select_best_agent_skill_pair(
    "Design renewable energy storage"
)

# Execute with learning
from great_humans import SkillLearningSystem
learning = SkillLearningSystem()
result = learning.execute_skill_with_learning(
    agent_id=best_agent_id,
    skill=best_skill,
    context={"task": "Design renewable energy storage"}
)
```

### **Advanced Usage - Skill Chaining**
```python
from great_humans import EnhancedAgent, PredefinedChains

# Create enhanced agent with skills
newton = EnhancedAgent(2)

# Use predefined skill chain
chain = PredefinedChains.research_and_analysis(
    agent_id=2,
    topic="quantum computing applications"
)
result = chain.execute_chain()

# Create custom skill chain
from great_humans import SkillChain
custom_chain = SkillChain(
    agent_id=2,
    skill_sequence=["research", "analysis", "creativity"],
    context={"challenge": "Solve climate change"}
)
```

### **Advanced Usage - Council Collaboration**
```python
from great_humans import AgentCouncil

# Create diverse council
council = AgentCouncil([2, 10, 1])  # Newton, Einstein, Muhammad

# Collaborative analysis
analysis = council.collaborative_analysis("Ethical implications of AI")

# Brainstorming solutions
solutions = council.brainstorm_solutions("Climate change innovations")

# Strategic planning
planning = council.strategic_planning("International scientific cooperation")
```

### **Character Registry Integration**
```python
# Character Registry for your orchestrator
class CharacterRegistry:
    def __init__(self):
        from great_humans import load_all, filter_agents, build_system_prompt, SkillSelector
        self.agents = load_all()
        self.filter_agents = filter_agents
        self.build_prompt = build_system_prompt
        self.selector = SkillSelector()
    
    def select_for_task(self, task_description: str, council_size: int = 3):
        """Select optimal agents for specific task.""" 
        # Classify task and get requirements
        classifier = TaskClassifier()
        task_type = classifier.classify_task(task_description)
        
        # Select diverse council
        council = self.selector.select_diverse_council(task_description, council_size)
        
        return [(agent_id, skill, score) for agent_id, skill, score in council]
    
    def create_council(self, task_description: str):
        """Create optimized council for task.""" 
        council_pairs = self.select_for_task(task_description, 3)
        
        # Create enhanced agents
        agents = [EnhancedAgent(agent_id) for agent_id, _, _ in council_pairs]
        
        # Return council configuration
        return {
            "task": task_description,
            "members": council_pairs,
            "agents": agents
        }

# Usage
registry = CharacterRegistry()
council_config = registry.create_council("Design sustainable city")
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

The `output/agents-hart-100.json` file contains structured AI agent definitions generated from the YAML profiles, suitable for LLM-based persona systems with skill capabilities.

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

## **Performance Metrics**

### **Skill Distribution**
- **Analysis**: Available to agents with science, philosophy, politics, mathematics domains
- **Creativity**: Available to agents with arts, technology, science, philosophy domains
- **Leadership**: Available to agents with politics, military, business, religion domains
- **Teaching**: Available to agents with science, philosophy, religion, arts domains
- **Writing**: Available to agents with arts, politics, philosophy, religion domains
- **Negotiation**: Available to agents with politics, business, law domains
- **Research**: Available to agents with science, philosophy, medicine, history domains
- **Engineering**: Available to agents with technology, science, mathematics domains

### **Proficiency Distribution**
- **Master (5/5)**: Top-ranked agents in relevant domains
- **Expert (4/5)**: Agents with strong domain expertise
- **Advanced (3/5)**: Agents with solid domain knowledge
- **Intermediate (2/5)**: Agents with basic domain familiarity
- **Beginner (1/5)**: Agents with limited domain experience

## **Examples**

### **Quick Start**
```python
from great_humans import SkillSelector, EnhancedAgent, PredefinedChains

# Smart selection for task
selector = SkillSelector()
best_agent, best_skill, score = selector.select_best_agent_skill_pair(
    "Analyze ethical implications of AI"
)

# Execute with learning
from great_humans import SkillLearningSystem
learning = SkillLearningSystem()
result = learning.execute_skill_with_learning(
    agent_id=best_agent,
    skill=best_skill,
    context={"problem": "AI ethics"}
)
```

### **Complex Workflow**
```python
from great_humans import AgentCouncil, PredefinedChains, AdaptiveSkillSystem

# Create diverse council for complex problem
council = AgentCouncil([2, 10, 1])  # Newton, Einstein, Muhammad

# Multi-step problem solving
# Step 1: Research phase
research_chain = PredefinedChains.research_and_analysis(
    agent_id=2, # Newton
    topic="Quantum computing implications"
)
research_result = research_chain.execute_chain()

# Step 2: Creative solutions
creative_chain = PredefinedChains.creative_problem_solving(
    agent_id=10, # Einstein
    challenge="Quantum computing applications"
)
creative_result = creative_chain.execute_chain()

# Step 3: Strategic implementation
strategic_chain = PredefinedChains.strategic_communication(
    agent_id=1, # Muhammad
    situation="Global quantum governance",
    audience="world_leaders"
)
strategic_result = strategic_chain.execute_chain()
```

### **Learning and Adaptation**
```python
from great_humans import SkillLearningSystem, AdaptiveSkillSystem

# Track learning progress
learning = SkillLearningSystem()

# Multiple skill executions with learning
for i in range(10):
    result = learning.execute_skill_with_learning(
        agent_id=2, # Newton
        skill="analysis",
        context={"problem": f"Physics problem {i+1}"}
    )
    print(f"Use {i+1}: {result['current_proficiency']}")

# Get adaptive recommendations
adaptive = AdaptiveSkillSystem()
recommendation = adaptive.get_adaptive_recommendation(
    agent_id=2,
    task="Advanced physics education",
    context={"domain": "science"}
)
```

## **TypeScript SDK**

The repository includes a complete TypeScript SDK for easy integration into Node.js and Next.js projects.

### **Quick Start**
```bash
# Clone and setup
git clone https://github.com/Gzeu/100-great-humans.git
cd 100-great-humans/src
npm install
npm run build
npm test
```

### **Basic Usage**
```typescript
import { getAgentById, listAgentsByDomain, getSystemPromptById } from './agents';

// Get agent by ID
const einstein = getAgentById("hart-010-albert-einstein");
console.log(einstein.name); // "Albert Einstein"

// List agents by domain
const scientists = listAgentsByDomain("science");
console.log(`Found ${scientists.length} scientists`);

// Get system prompt for LLM
const prompt = getSystemPromptById("hart-010-albert-einstein");
```

### **Next.js Integration**
```typescript
// pages/api/agents/[id]/route.ts
import { getAgentById } from '@/src/agents';

export async function GET(request, { params }) {
  const agent = getAgentById(params.id);
  return NextResponse.json({ data: agent });
}
```

### **Available Functions**
- `listAgents()` - Get all 100 agents
- `getAgentById(id)` - Find agent by ID
- `getAgentByRank(rank)` - Find agent by Hart rank (1-100)
- `listAgentsByDomain(domain)` - Filter by domain (science, religion, etc.)
- `searchAgentsByName(query)` - Fuzzy search by name
- `getTopAgents(limit)` - Get top N agents
- `getAgentsStats()` - Dataset statistics
- `getSystemPromptById(id)` - System prompt for LLM
- `buildSystemPrompt(agent)` - Build custom prompt
- `exportAgentsAsJSON()` - Export as JSON
- `exportAgentsAsCSV()` - Export as CSV

### **TypeScript Types**
```typescript
interface HartAgent {
  id: string;
  name: string;
  rank: number;
  categories: HartAgentCategories;
  persona: HartAgentPersona;
  knowledge_profile: HartAgentKnowledgeProfile;
  limitations: string[];
  prompt_template: string;
}
```

### **Testing**
```bash
npm test
# 🧪 Testing Great Humans TypeScript SDK
# ✅ All 9 tests passed!
```

## **Usage Examples**

### **Quick Start**
```python
from great_humans import SkillSelector, EnhancedAgent, PredefinedChains

# Smart selection for task
selector = SkillSelector()
best_agent, best_skill, score = selector.select_best_agent_skill_pair(
    "Analyze ethical implications of AI"
)

# Execute with learning
from great_humans import SkillLearningSystem
learning = SkillLearningSystem()
result = learning.execute_skill_with_learning(
    agent_id=best_agent,
    skill=best_skill,
    context={"problem": "AI ethics"}
)
```

### **As Agent API - System Prompt Example**
```python
from great_humans import build_system_prompt

# Get system prompt for Newton
prompt = build_system_prompt(2)  # Newton

# Use in LLM
print(prompt)
# Output:
# You are an AI agent role-playing as Isaac Newton (Hart rank 2) from the project "100 Great Humans".
# 
# Core Identity
# **Archetype:** Analytical scientist and system builder
# **Era:** 17th–18th century CE
# **Regions:** Europe
# 
# Core Values
# - systematic_inquiry
# - empirical_validation
# - mathematical_rigorous
# - intellectual_honesty
# - universal_laws
# 
# Cognitive Style
# - methodical_analysis
# - experimental_validation
# - mathematical_modeling
# - deductive_reasoning
# - systematic_thinking
# 
# Decision Heuristics
# - break_down_complex_problems
# - seek_empirical_evidence
# - use_mathematical_tools
# - validate_before_concluding
# - consider_alternative_hypotheses
```

### **As Encyclopedia - Knowledge Retrieval**
```python
from great_humans import load_all, by_id

# Load all agents as encyclopedia
agents = load_all()

# Get specific person's complete profile
newton = by_id(2)  # Isaac Newton

# Access all biographical information
print(f"Name: {newton['name']}")
print(f"Birth: {newton['birth_date']}")
print(f"Death: {newton['death_date']}")
print(f"Birth Place: {newton['birth_place']}")
print(f"Occupations: {newton['occupations']}")
print(f"Domains: {newton['domains']}")

# Get detailed biography from MD file
profile_md = newton.get('profile_md')
if profile_md and Path(profile_md).exists():
    with open(profile_md, 'r', encoding='utf-8') as f:
        biography = f.read()
    print(f"\nBiography:\n{biography[:500]}...")
```

### **Advanced Usage - Complex Workflow**
```python
from great_humans import AgentCouncil, PredefinedChains, AdaptiveSkillSystem

# Create diverse council for complex problem
council = AgentCouncil([2, 10, 1])  # Newton, Einstein, Muhammad

# Multi-step problem solving
# Step 1: Research phase
research_chain = PredefinedChains.research_and_analysis(
    agent_id=2, # Newton
    topic="Quantum computing implications"
)
research_result = research_chain.execute_chain()

# Step 2: Creative solutions
creative_chain = PredefinedChains.creative_problem_solving(
    agent_id=10, # Einstein
    challenge="Quantum computing applications"
)
creative_result = creative_chain.execute_chain()

# Step 3: Strategic implementation
strategic_chain = PredefinedChains.strategic_communication(
    agent_id=1, # Muhammad
    situation="Global quantum governance",
    audience="world_leaders"
)
strategic_result = strategic_chain.execute_chain()

# Get adaptive recommendations
adaptive = AdaptiveSkillSystem()
recommendation = adaptive.get_adaptive_recommendation(
    agent_id=2,
    task="Advanced physics education",
    context={"domain": "science"}
)
```

### **API Integration Example**
```python
import requests

# Use the FastAPI server
API_BASE = "http://localhost:8000"

# Get best agent for task
response = requests.post(f"{API_BASE}/selection/best", json={
    "task": "Design renewable energy solution",
    "context": {"domain": "technology"}
})
data = response.json()

print(f"Best agent: {data['best_agent']['name']}")
print(f"Best skill: {data['best_skill']}")
print(f"Fitness score: {data['fitness_score']:.3f}")

# Execute skill chain
response = requests.post(f"{API_BASE}/chains/predefined/innovation_development", json={
    "agent_id": 2,
    "context": {
        "problem": "Space travel challenges",
        "constraints": ["physics", "resources"]
    }
})
result = response.json()

print(f"Chain completed: {result['result']['completed']}")
print(f"Steps executed: {len(result['result']['results'])}")
```

## **Installation & Setup**

### **Development Setup**
```bash
git clone https://github.com/Gzeu/100-great-humans.git
cd 100-great-humans
pip install -e .
```

### **Production Installation**
```bash
pip install great-humans
```

### **TypeScript SDK Setup**
```bash
# Clone repository
git clone https://github.com/Gzeu/100-great-humans.git
cd 100-great-humans

# Install TypeScript dependencies
cd src
npm install

# Build SDK
npm run build

# Test SDK
npm test

# Ready to use!
```

### **API Server**
```bash
cd api
pip install -r requirements.txt
python start_server.py
# Access: http://localhost:8000/docs
```

### **Docker Deployment**
```bash
cd api
docker-compose up -d
# Access: http://localhost/docs
```

### **Dependencies**
- Python 3.8+
- PyYAML (for YAML processing)
- FastAPI (for API server)
- TypeScript 5.0+ (for SDK)
- No external dependencies required for core functionality

## **License**

MIT License - feel free to use this library in your AI projects!

## **Contributing**

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Submit a pull request

Areas for contribution:
- Additional skills (medicine, law, economics, etc.)
- Enhanced proficiency algorithms
- New predefined skill chains
- Performance optimizations
- Documentation improvements

## **Citation**

If you use this library in your research or projects, please cite:

``` 
Great Humans: Advanced Agent Persona Library with Skills. (2025)
GitHub Repository: https://github.com/Gzeu/100-great-humans
Based on "The 100: A Ranking of the Most Influential Persons in History" by Michael H. Hart
```

## **Version History**

- **v3.0.0**: Advanced skills, learning system, smart selection
- **v2.0.0**: Basic skills and enhanced agents
- **v1.0.0**: Core agent library
- **v0.1.0**: Initial dataset only

---
 
**Ready for Advanced AI Integration!**
