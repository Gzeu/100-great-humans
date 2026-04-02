"""FastAPI server for Great Humans Advanced Agent System."""

from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import sys
from pathlib import Path

# Add src to path for imports
sys.path.append(str(Path(__file__).parent.parent))

from great_humans import (
    load_all, by_id, filter_agents, search_by_name, build_system_prompt,
    EnhancedAgent, AgentCouncil, SkillSelector, TaskClassifier,
    SkillLearningSystem, AdaptiveSkillSystem, PredefinedChains,
    AgentProficiency, ProficiencyLevel
)

# Initialize FastAPI app
app = FastAPI(
    title="Great Humans API",
    description="Advanced AI Agent System with Skills, Learning, and Intelligence",
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for API
class AgentInfo(BaseModel):
    id: str
    name: str
    rank: int
    domains: List[str]
    era: str
    regions: List[str]

class SkillRequest(BaseModel):
    agent_id: int
    skill: str
    context: Dict[str, Any] = Field(default_factory=dict)

class SkillChainRequest(BaseModel):
    agent_id: int
    skill_sequence: List[str]
    context: Dict[str, Any] = Field(default_factory=dict)

class CouncilRequest(BaseModel):
    agent_ids: List[int]
    task: str

class TaskRequest(BaseModel):
    task: str
    context: Dict[str, Any] = Field(default_factory=dict)
    council_size: int = 3

class LearningRequest(BaseModel):
    agent_id: int
    skill: str
    context: Dict[str, Any] = Field(default_factory=dict)

# Initialize components
registry = load_all()
skill_selector = SkillSelector()
task_classifier = TaskClassifier()
learning_system = SkillLearningSystem()
adaptive_system = AdaptiveSkillSystem()

@app.get("/")
async def root():
    """Root endpoint with API info."""
    return {
        "name": "Great Humans API v3.0",
        "description": "Advanced AI Agent System with Skills, Learning, and Intelligence",
        "features": [
            "100 historical agents",
            "8 intelligent skills",
            "Skill chaining",
            "Proficiency levels",
            "Smart selection",
            "Learning system",
            "Adaptive recommendations"
        ],
        "endpoints": {
            "agents": "/agents",
            "skills": "/skills",
            "selection": "/selection",
            "chains": "/chains",
            "council": "/council",
            "learning": "/learning",
            "proficiency": "/proficiency"
        },
        "docs": "/docs",
        "redoc": "/redoc"
    }

# ===== AGENT ENDPOINTS =====

@app.get("/agents", response_model=List[AgentInfo])
async def get_agents(
    domain: Optional[str] = Query(None, description="Filter by domain"),
    era: Optional[str] = Query(None, description="Filter by era"),
    region: Optional[str] = Query(None, description="Filter by region"),
    min_rank: Optional[int] = Query(None, description="Minimum rank filter"),
    max_rank: Optional[int] = Query(None, description="Maximum rank filter"),
    limit: int = Query(100, description="Limit results"),
    offset: int = Query(0, description="Offset results")
):
    """Get agents with optional filtering."""
    try:
        agents = registry
        
        # Apply filters
        if domain:
            agents = [a for a in agents if domain in a.get("categories", {}).get("domains", [])]
        if era:
            era_lower = era.lower()
            agents = [a for a in agents if era_lower in a.get("knowledge_profile", {}).get("era", "").lower()]
        if region:
            agents = [a for a in agents if region in a.get("knowledge_profile", {}).get("regions", [])]
        if min_rank is not None and max_rank is not None:
            agents = [a for a in agents if min_rank <= a.get("rank", 999) <= max_rank]
        
        # Apply pagination
        total = len(agents)
        agents = agents[offset:offset + limit]
        
        # Format response
        agent_info = []
        for agent in agents:
            agent_info.append(AgentInfo(
                id=agent.get("id", ""),
                name=agent.get("name", ""),
                rank=agent.get("rank", 0),
                domains=agent.get("categories", {}).get("domains", []),
                era=agent.get("knowledge_profile", {}).get("era", ""),
                regions=agent.get("knowledge_profile", {}).get("regions", [])
            ))
        
        return JSONResponse(
            content=agent_info,
            headers={"X-Total-Count": str(total)}
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agents/{agent_id}")
async def get_agent_by_id(agent_id: str):
    """Get specific agent by ID."""
    try:
        # Handle both rank-based and ID-based lookups
        if agent_id.isdigit():
            agent = by_id(int(agent_id))
        else:
            agent = next((a for a in registry if a.get("id") == agent_id), None)
        
        if not agent:
            raise HTTPException(status_code=404, detail=f"Agent not found: {agent_id}")
        
        return agent
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agents/{agent_id}/prompt")
async def get_agent_prompt(
    agent_id: str,
    template: str = Query("default", description="Prompt template: default, minimal, detailed")
):
    """Get system prompt for agent."""
    try:
        # Handle both rank-based and ID-based lookups
        if agent_id.isdigit():
            hart_id = int(agent_id)
        else:
            agent = next((a for a in registry if a.get("id") == agent_id), None)
            if not agent:
                raise HTTPException(status_code=404, detail=f"Agent not found: {agent_id}")
            hart_id = agent.get("rank")
        
        prompt = build_system_prompt(hart_id, template)
        
        return {
            "agent_id": agent_id,
            "template": template,
            "system_prompt": prompt,
            "length": len(prompt)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== SKILL ENDPOINTS =====

@app.get("/skills")
async def get_all_skills():
    """Get all available skills with descriptions."""
    try:
        from great_humans.extended_skills import ExtendedSkillRegistry
        skill_registry = ExtendedSkillRegistry()
        skills = skill_registry.get_all_skills()
        
        skill_info = {}
        for skill_name, skill in skills.items():
            skill_info[skill_name] = {
                "name": skill_name,
                "description": skill.description,
                "domains": skill.domains
            }
        
        return skill_info
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/skills/{agent_id}")
async def get_agent_skills(agent_id: str):
    """Get available skills for specific agent."""
    try:
        # Handle both rank-based and ID-based lookups
        if agent_id.isdigit():
            hart_id = int(agent_id)
        else:
            agent = next((a for a in registry if a.get("id") == agent_id), None)
            if not agent:
                raise HTTPException(status_code=404, detail=f"Agent not found: {agent_id}")
            hart_id = agent.get("rank")
        
        from great_humans.extended_skills import ExtendedSkillRegistry
        skill_registry = ExtendedSkillRegistry()
        available_skills = skill_registry.get_available_skills(hart_id)
        
        return {
            "agent_id": agent_id,
            "available_skills": available_skills
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/skills/execute")
async def execute_skill(request: SkillRequest):
    """Execute a skill for an agent."""
    try:
        from great_humans.extended_skills import ExtendedSkillRegistry
        skill_registry = ExtendedSkillRegistry()
        
        result = skill_registry.execute_skill(request.agent_id, request.skill, request.context)
        
        return {
            "success": True,
            "result": result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== SELECTION ENDPOINTS =====

@app.post("/selection/best")
async def get_best_selection(request: TaskRequest):
    """Get best agent-skill combination for task."""
    try:
        best_agent_id, best_skill, score = skill_selector.select_best_agent_skill_pair(
            request.task, request.context
        )
        
        agent = by_id(best_agent_id)
        
        return {
            "task": request.task,
            "best_agent": {
                "id": agent.get("id"),
                "name": agent.get("name"),
                "rank": agent.get("rank")
            },
            "best_skill": best_skill,
            "fitness_score": score,
            "context": request.context
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/selection/council")
async def get_council_selection(request: TaskRequest):
    """Get diverse council selection for task."""
    try:
        council = skill_selector.select_diverse_council(
            request.task, request.council_size, request.context
        )
        
        council_info = []
        for agent_id, skill, score in council:
            agent = by_id(agent_id)
            council_info.append({
                "agent": {
                    "id": agent.get("id"),
                    "name": agent.get("name"),
                    "rank": agent.get("rank")
                },
                "skill": skill,
                "fitness_score": score
            })
        
        return {
            "task": request.task,
            "council_size": request.council_size,
            "council": council_info
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/selection/classify")
async def classify_task(request: TaskRequest):
    """Classify task and get required skills."""
    try:
        task_type = task_classifier.classify_task(request.task)
        required_skills = task_classifier.get_required_skills(task_type)
        
        return {
            "task": request.task,
            "task_type": task_type,
            "required_skills": required_skills
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== SKILL CHAINING ENDPOINTS =====

@app.post("/chains/execute")
async def execute_skill_chain(request: SkillChainRequest):
    """Execute a custom skill chain."""
    try:
        from great_humans.skill_chaining import SkillChain
        
        chain = SkillChain(request.agent_id, request.skill_sequence, request.context)
        result = chain.execute_chain()
        
        return {
            "success": True,
            "result": result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chains/predefined/{chain_type}")
async def execute_predefined_chain(
    chain_type: str,
    agent_id: int,
    context: Dict[str, Any]
):
    """Execute a predefined skill chain."""
    try:
        if chain_type == "research_analysis":
            chain = PredefinedChains.research_and_analysis(agent_id, context.get("topic", ""))
        elif chain_type == "creative_problem_solving":
            chain = PredefinedChains.creative_problem_solving(
                agent_id, 
                context.get("challenge", ""),
                context.get("constraints", [])
            )
        elif chain_type == "strategic_communication":
            chain = PredefinedChains.strategic_communication(
                agent_id,
                context.get("situation", ""),
                context.get("audience", "general")
            )
        elif chain_type == "diplomatic_solution":
            chain = PredefinedChains.diplomatic_solution(
                agent_id,
                context.get("conflict", ""),
                context.get("parties", [])
            )
        elif chain_type == "educational_program":
            chain = PredefinedChains.educational_program(
                agent_id,
                context.get("topic", ""),
                context.get("audience", "general")
            )
        elif chain_type == "innovation_development":
            chain = PredefinedChains.innovation_development(
                agent_id,
                context.get("problem", ""),
                context.get("constraints", [])
            )
        else:
            raise HTTPException(status_code=400, detail=f"Unknown chain type: {chain_type}")
        
        result = chain.execute_chain()
        
        return {
            "chain_type": chain_type,
            "agent_id": agent_id,
            "context": context,
            "result": result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== COUNCIL ENDPOINTS =====

@app.post("/council/create")
async def create_council(request: CouncilRequest):
    """Create an agent council."""
    try:
        council = AgentCouncil(request.agent_ids)
        
        council_info = {
            "members": [
                {
                    "id": agent.agent_id,
                    "name": agent.name,
                    "available_skills": agent.available_skills
                }
                for agent in council.agents
            ],
            "council_skills": council.get_council_skills()
        }
        
        return council_info
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/council/analyze")
async def council_analysis(request: CouncilRequest):
    """Perform collaborative analysis with council."""
    try:
        council = AgentCouncil(request.agent_ids)
        result = council.collaborative_analysis(request.task)
        
        return {
            "task": request.task,
            "council_members": request.agent_ids,
            "analysis": result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/council/brainstorm")
async def council_brainstorm(request: CouncilRequest):
    """Brainstorm solutions with council."""
    try:
        council = AgentCouncil(request.agent_ids)
        result = council.brainstorm_solutions(request.task)
        
        return {
            "task": request.task,
            "council_members": request.agent_ids,
            "solutions": result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/council/strategic")
async def council_strategic_planning(request: CouncilRequest):
    """Strategic planning with council."""
    try:
        council = AgentCouncil(request.agent_ids)
        result = council.strategic_planning(request.task)
        
        return {
            "task": request.task,
            "council_members": request.agent_ids,
            "strategic_plan": result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== LEARNING ENDPOINTS =====

@app.post("/learning/execute")
async def execute_with_learning(request: LearningRequest):
    """Execute skill with learning tracking."""
    try:
        result = learning_system.execute_skill_with_learning(
            request.agent_id, request.skill, request.context
        )
        
        return {
            "success": True,
            "result": result
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/learning/stats/{agent_id}")
async def get_learning_statistics(agent_id: str):
    """Get learning statistics for agent."""
    try:
        # Handle both rank-based and ID-based lookups
        if agent_id.isdigit():
            hart_id = int(agent_id)
        else:
            agent = next((a for a in registry if a.get("id") == agent_id), None)
            if not agent:
                raise HTTPException(status_code=404, detail=f"Agent not found: {agent_id}")
            hart_id = agent.get("rank")
        
        stats = learning_system.get_learning_statistics(hart_id)
        
        return stats
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/learning/focus/{agent_id}")
async def get_learning_focus(agent_id: str):
    """Get learning focus recommendations for agent."""
    try:
        # Handle both rank-based and ID-based lookups
        if agent_id.isdigit():
            hart_id = int(agent_id)
        else:
            agent = next((a for a in registry if a.get("id") == agent_id), None)
            if not agent:
                raise HTTPException(status_code=404, detail=f"Agent not found: {agent_id}")
            hart_id = agent.get("rank")
        
        focus = learning_system.recommend_learning_focus(hart_id)
        
        return {
            "agent_id": agent_id,
            "learning_focus": focus
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/learning/adaptive")
async def get_adaptive_recommendation(request: TaskRequest):
    """Get adaptive recommendation based on learning."""
    try:
        # Get best agent-skill combination first
        best_agent_id, best_skill, score = skill_selector.select_best_agent_skill_pair(
            request.task, request.context
        )
        
        recommendation = adaptive_system.get_adaptive_recommendation(
            best_agent_id, request.task, request.context
        )
        
        return {
            "task": request.task,
            "adaptive_recommendation": recommendation
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== PROFICIENCY ENDPOINTS =====

@app.get("/proficiency/{agent_id}")
async def get_proficiency_levels(agent_id: str):
    """Get proficiency levels for agent."""
    try:
        # Handle both rank-based and ID-based lookups
        if agent_id.isdigit():
            hart_id = int(agent_id)
        else:
            agent = next((a for a in registry if a.get("id") == agent_id), None)
            if not agent:
                raise HTTPException(status_code=404, detail=f"Agent not found: {agent_id}")
            hart_id = agent.get("rank")
        
        proficiency = AgentProficiency(hart_id)
        all_proficiencies = proficiency.get_all_proficiencies()
        
        # Convert to serializable format
        proficiencies = {}
        for skill, level in all_proficiencies.items():
            proficiencies[skill] = {
                "level": level.name,
                "value": level.value,
                "score": level.value / 5.0
            }
        
        return {
            "agent_id": agent_id,
            "proficiencies": proficiencies
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/proficiency/simulate")
async def simulate_learning_progress(
    agent_id: str,
    skill: str,
    target_level: str
):
    """Simulate learning progress to target proficiency."""
    try:
        # Handle both rank-based and ID-based lookups
        if agent_id.isdigit():
            hart_id = int(agent_id)
        else:
            agent = next((a for a in registry if a.get("id") == agent_id), None)
            if not agent:
                raise HTTPException(status_code=404, detail=f"Agent not found: {agent_id}")
            hart_id = agent.get("rank")
        
        # Convert target level string to enum
        target_level_enum = ProficiencyLevel[target_level.upper()]
        
        simulation = learning_system.simulate_learning_progress(hart_id, skill, target_level_enum)
        
        return simulation
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ===== UTILITY ENDPOINTS =====

@app.get("/domains")
async def get_domains():
    """Get all available domains."""
    try:
        domains = set()
        for agent in registry:
            domains.update(agent.get("categories", {}).get("domains", []))
        
        return {"domains": sorted(list(domains))}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/eras")
async def get_eras():
    """Get all available eras."""
    try:
        eras = set()
        for agent in registry:
            era = agent.get("knowledge_profile", {}).get("era")
            if era:
                eras.add(era)
        
        return {"eras": sorted(list(eras))}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/regions")
async def get_regions():
    """Get all available regions."""
    try:
        regions = set()
        for agent in registry:
            regions.update(agent.get("knowledge_profile", {}).get("regions", []))
        
        return {"regions": sorted(list(regions))}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    """Get comprehensive system statistics."""
    try:
        domains = set()
        regions = set()
        eras = set()
        
        for agent in registry:
            domains.update(agent.get("categories", {}).get("domains", []))
            regions.update(agent.get("knowledge_profile", {}).get("regions", []))
            era = agent.get("knowledge_profile", {}).get("era")
            if era:
                eras.add(era)
        
        return {
            "total_agents": len(registry),
            "domains": sorted(list(domains)),
            "regions": sorted(list(regions)),
            "eras": sorted(list(eras)),
            "skills_available": 8,
            "proficiency_levels": 5,
            "api_version": "3.0.0"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/search")
async def search_agents(
    q: str = Query(..., description="Search query"),
    search_type: str = Query("name", description="Search type: name, domain, era")
):
    """Search agents by various criteria."""
    try:
        if search_type == "name":
            results = search_by_name(q)
        elif search_type == "domain":
            results = [a for a in registry if q in a.get("categories", {}).get("domains", [])]
        elif search_type == "era":
            q_lower = q.lower()
            results = [a for a in registry if q_lower in a.get("knowledge_profile", {}).get("era", "").lower()]
        else:
            raise HTTPException(status_code=400, detail=f"Invalid search type: {search_type}")
        
        # Format results
        search_results = []
        for agent in results:
            search_results.append({
                "id": agent.get("id"),
                "name": agent.get("name"),
                "rank": agent.get("rank"),
                "domains": agent.get("categories", {}).get("domains", []),
                "era": agent.get("knowledge_profile", {}).get("era", "")
            })
        
        return {
            "query": q,
            "search_type": search_type,
            "results": search_results,
            "total": len(search_results)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
