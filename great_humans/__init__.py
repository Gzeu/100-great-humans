"""
Great Humans - Advanced Agent Persona Library with Skills

Instant personas ready for LLM prompting with advanced skill capabilities,
proficiency levels, skill chaining, and adaptive learning.
"""

from .loader import load_all, by_id, filter_agents, search_by_name
from .prompt import build_system_prompt
from .skills import Skill, SkillRegistry, AnalysisSkill, CreativeSkill, LeadershipSkill, TeachingSkill
from .extended_skills import ExtendedSkillRegistry, WritingSkill, NegotiationSkill, ResearchSkill, EngineeringSkill
from .agent_enhanced import EnhancedAgent, AgentCouncil
from .skill_chaining import SkillChain, PredefinedChains, ChainOptimizer
from .proficiency import AgentProficiency, ProficiencyLevel, ProficiencyEnhancedSkill
from .skill_selector import SkillSelector, TaskClassifier
from .skill_learning import SkillLearningSystem, AdaptiveSkillSystem

__version__ = "3.0.0"
__all__ = [
    # Core functionality
    "load_all", "by_id", "filter_agents", "search_by_name", "build_system_prompt",
    
    # Basic skills
    "Skill", "SkillRegistry", "AnalysisSkill", "CreativeSkill", "LeadershipSkill", "TeachingSkill",
    
    # Extended skills
    "ExtendedSkillRegistry", "WritingSkill", "NegotiationSkill", "ResearchSkill", "EngineeringSkill",
    
    # Enhanced agents
    "EnhancedAgent", "AgentCouncil",
    
    # Skill chaining
    "SkillChain", "PredefinedChains", "ChainOptimizer",
    
    # Proficiency system
    "AgentProficiency", "ProficiencyLevel", "ProficiencyEnhancedSkill",
    
    # Smart selection
    "SkillSelector", "TaskClassifier",
    
    # Learning system
    "SkillLearningSystem", "AdaptiveSkillSystem"
]
