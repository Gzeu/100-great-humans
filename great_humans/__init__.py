"""
Great Humans - Agent Persona Library

Instant personas ready for LLM prompting.
"""

from .loader import load_all, by_id, filter_agents, search_by_name
from .prompt import build_system_prompt

__version__ = "1.0.0"
__all__ = ["load_all", "by_id", "filter_agents", "search_by_name", "build_system_prompt"]
