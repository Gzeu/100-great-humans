"""Smart skill selection system for Great Humans agents."""

from typing import List, Dict, Any, Tuple, Optional
from .extended_skills import ExtendedSkillRegistry
from .proficiency import AgentProficiency, ProficiencyLevel
from .loader import load_all

class SkillSelector:
    """Intelligent skill selection system."""
    
    def __init__(self):
        self.skill_registry = ExtendedSkillRegistry()
        self.all_agents = load_all()
    
    def select_best_agent_skill_pair(self, task: str, context: Dict[str, Any] = None) -> Tuple[int, str, float]:
        """Select the best agent-skill combination for a given task."""
        if context is None:
            context = {}
        
        candidates = []
        
        # Evaluate all agent-skill combinations
        for agent in self.all_agents:
            agent_id = agent.get("rank")
            proficiency = AgentProficiency(agent_id)
            
            available_skills = self.skill_registry.get_available_skills(agent_id)
            
            for skill in available_skills:
                score = self._evaluate_agent_skill_fitness(agent, skill, task, context, proficiency)
                candidates.append((agent_id, skill, score))
        
        # Sort by score (descending)
        candidates.sort(key=lambda x: x[2], reverse=True)
        
        return candidates[0] if candidates else (None, None, 0.0)
    
    def select_top_n_pairs(self, task: str, n: int = 5, context: Dict[str, Any] = None) -> List[Tuple[int, str, float]]:
        """Select top N agent-skill combinations."""
        if context is None:
            context = {}
        
        candidates = []
        
        for agent in self.all_agents:
            agent_id = agent.get("rank")
            proficiency = AgentProficiency(agent_id)
            
            available_skills = self.skill_registry.get_available_skills(agent_id)
            
            for skill in available_skills:
                score = self._evaluate_agent_skill_fitness(agent, skill, task, context, proficiency)
                candidates.append((agent_id, skill, score))
        
        candidates.sort(key=lambda x: x[2], reverse=True)
        return candidates[:n]
    
    def select_diverse_council(self, task: str, council_size: int = 3, context: Dict[str, Any] = None) -> List[Tuple[int, str, float]]:
        """Select diverse council members with different skills."""
        if context is None:
            context = {}
        
        # Get top candidates
        top_candidates = self.select_top_n_pairs(task, council_size * 3, context)
        
        # Ensure diversity in domains and skills
        selected = []
        used_domains = set()
        used_skills = set()
        
        for agent_id, skill, score in top_candidates:
            if len(selected) >= council_size:
                break
            
            agent = next(a for a in self.all_agents if a.get("rank") == agent_id)
            agent_domains = set(agent.get("categories", {}).get("domains", []))
            
            # Check for diversity
            domain_diversity = len(agent_domains - used_domains) > 0 or len(selected) == 0
            skill_diversity = skill not in used_skills or len(selected) == 0
            
            if domain_diversity and skill_diversity:
                selected.append((agent_id, skill, score))
                used_domains.update(agent_domains)
                used_skills.add(skill)
        
        return selected
    
    def _evaluate_agent_skill_fitness(self, agent: Dict[str, Any], skill: str, task: str, 
                                   context: Dict[str, Any], proficiency: AgentProficiency) -> float:
        """Evaluate fitness score for agent-skill combination."""
        score = 0.0
        
        # Base score from Hart rank (lower rank = higher score)
        rank = agent.get("rank", 100)
        rank_score = (100 - rank) / 100.0  # 0.0 to 1.0
        score += rank_score * 0.2  # 20% weight
        
        # Skill proficiency score
        prof_level = proficiency.get_proficiency(skill)
        prof_score = prof_level.value / 5.0  # 0.0 to 1.0
        score += prof_score * 0.3  # 30% weight
        
        # Domain relevance score
        domains = agent.get("categories", {}).get("domains", [])
        skill_obj = self.skill_registry.get_skill(skill)
        if skill_obj:
            domain_relevance = len(set(skill_obj.domains) & set(domains)) / len(skill_obj.domains)
            score += domain_relevance * 0.2  # 20% weight
        
        # Task relevance score
        task_relevance = self._calculate_task_relevance(task, skill, domains)
        score += task_relevance * 0.2  # 20% weight
        
        # Context matching score
        context_score = self._calculate_context_match(agent, skill, context)
        score += context_score * 0.1  # 10% weight
        
        return min(score, 1.0)
    
    def _calculate_task_relevance(self, task: str, skill: str, domains: List[str]) -> float:
        """Calculate relevance of skill to task based on keywords."""
        task_lower = task.lower()
        
        # Task type to skill mapping
        task_skill_keywords = {
            "analysis": ["analyze", "understand", "examine", "break down", "evaluate", "assess"],
            "creativity": ["create", "innovate", "design", "imagine", "brainstorm", "invent"],
            "leadership": ["lead", "manage", "organize", "guide", "direct", "coordinate"],
            "teaching": ["teach", "explain", "educate", "train", "mentor", "instruct"],
            "writing": ["write", "communicate", "document", "report", "compose", "express"],
            "negotiation": ["negotiate", "mediate", "compromise", "resolve", "agree", "diplomacy"],
            "research": ["research", "investigate", "study", "explore", "discover", "examine"],
            "engineering": ["build", "design", "construct", "develop", "implement", "technical"]
        }
        
        # Check for keyword matches
        keywords = task_skill_keywords.get(skill, [])
        keyword_matches = sum(1 for keyword in keywords if keyword in task_lower)
        keyword_score = min(keyword_matches / len(keywords), 1.0) if keywords else 0.0
        
        # Domain relevance
        domain_keywords = {
            "science": ["experiment", "hypothesis", "data", "research", "theory", "discovery"],
            "politics": ["government", "policy", "election", "democracy", "power", "society"],
            "arts": ["art", "music", "literature", "creative", "culture", "expression"],
            "technology": ["technology", "innovation", "digital", "software", "hardware", "system"],
            "philosophy": ["philosophy", "ethics", "meaning", "wisdom", "truth", "knowledge"],
            "religion": ["religion", "faith", "spiritual", "divine", "beliefs", "worship"]
        }
        
        domain_score = 0.0
        for domain in domains:
            domain_keywords_list = domain_keywords.get(domain, [])
            domain_matches = sum(1 for keyword in domain_keywords_list if keyword in task_lower)
            if domain_keywords_list:
                domain_score = max(domain_score, domain_matches / len(domain_keywords_list))
        
        return (keyword_score + domain_score) / 2.0
    
    def _calculate_context_match(self, agent: Dict[str, Any], skill: str, context: Dict[str, Any]) -> float:
        """Calculate how well agent-skill matches the given context."""
        if not context:
            return 0.5  # Neutral score for no context
        
        score = 0.0
        context_items = len(context)
        
        # Check era relevance
        if "era" in context:
            agent_era = agent.get("knowledge_profile", {}).get("era", "")
            target_era = context["era"]
            if target_era.lower() in agent_era.lower():
                score += 1.0
        
        # Check region relevance
        if "region" in context:
            agent_regions = agent.get("knowledge_profile", {}).get("regions", [])
            target_region = context["region"]
            if target_region in agent_regions:
                score += 1.0
        
        # Check domain relevance
        if "domain" in context:
            agent_domains = agent.get("categories", {}).get("domains", [])
            target_domain = context["domain"]
            if target_domain in agent_domains:
                score += 1.0
        
        # Check audience relevance
        if "audience" in context:
            # Some agents are better with certain audiences
            audience = context["audience"].lower()
            if audience == "academic" and "science" in agent.get("categories", {}).get("domains", []):
                score += 0.5
            elif audience == "general" and skill in ["teaching", "writing"]:
                score += 0.5
        
        return min(score / context_items, 1.0) if context_items > 0 else 0.0

class TaskClassifier:
    """Classifies tasks to determine optimal skill requirements."""
    
    def __init__(self):
        self.task_patterns = {
            "analysis_task": ["analyze", "evaluate", "assess", "examine", "understand", "break down"],
            "creative_task": ["create", "innovate", "design", "imagine", "brainstorm", "invent"],
            "leadership_task": ["lead", "manage", "organize", "guide", "direct", "coordinate"],
            "teaching_task": ["teach", "explain", "educate", "train", "mentor", "instruct"],
            "writing_task": ["write", "communicate", "document", "report", "compose"],
            "negotiation_task": ["negotiate", "mediate", "compromise", "resolve", "agree"],
            "research_task": ["research", "investigate", "study", "explore", "discover"],
            "engineering_task": ["build", "design", "construct", "develop", "implement"]
        }
    
    def classify_task(self, task_description: str) -> str:
        """Classify task type based on description."""
        task_lower = task_description.lower()
        
        scores = {}
        for task_type, keywords in self.task_patterns.items():
            matches = sum(1 for keyword in keywords if keyword in task_lower)
            scores[task_type] = matches
        
        if not scores or max(scores.values()) == 0:
            return "general_task"
        
        return max(scores, key=scores.get)
    
    def get_required_skills(self, task_type: str) -> List[str]:
        """Get recommended skills for task type."""
        skill_mapping = {
            "analysis_task": ["analysis"],
            "creative_task": ["creativity", "analysis"],
            "leadership_task": ["leadership", "analysis"],
            "teaching_task": ["teaching", "research"],
            "writing_task": ["writing", "analysis"],
            "negotiation_task": ["negotiation", "analysis"],
            "research_task": ["research", "analysis"],
            "engineering_task": ["engineering", "analysis", "creativity"],
            "general_task": ["analysis"]
        }
        
        return skill_mapping.get(task_type, ["analysis"])
