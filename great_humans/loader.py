"""Simple loader for Great Humans agents."""

import json
from pathlib import Path
from typing import List, Dict, Any, Optional

DATA = Path(__file__).resolve().parent.parent / "output" / "agents-hart-100.json"


def load_all() -> List[Dict[str, Any]]:
    """Load all agents from JSON manifest."""
    return json.loads(DATA.read_text())


def by_id(hart_id: int) -> Optional[Dict[str, Any]]:
    """Get agent by Hart rank ID."""
    try:
        return next(a for a in load_all() if a["rank"] == hart_id)
    except StopIteration:
        return None


def filter_agents(domain: Optional[str] = None, era: Optional[str] = None, region: Optional[str] = None) -> List[Dict[str, Any]]:
    """Filter agents by domain, era, or region."""
    agents = load_all()
    
    if domain:
        agents = [a for a in agents if domain in a.get("categories", {}).get("domains", [])]
    
    if era:
        agents = [a for a in agents if era.lower() in a.get("knowledge_profile", {}).get("era", "").lower()]
    
    if region:
        agents = [a for a in agents if region in a.get("knowledge_profile", {}).get("regions", [])]
    
    return agents


def search_by_name(query: str) -> List[Dict[str, Any]]:
    """Search agents by name (case-insensitive)."""
    agents = load_all()
    query_lower = query.lower()
    return [a for a in agents if query_lower in a.get("name", "").lower()]


def get_domains() -> List[str]:
    """Get all unique domains."""
    agents = load_all()
    domains = set()
    for agent in agents:
        domains.update(agent.get("categories", {}).get("domains", []))
    return sorted(list(domains))


def get_eras() -> List[str]:
    """Get all unique eras."""
    agents = load_all()
    eras = set()
    for agent in agents:
        era = agent.get("knowledge_profile", {}).get("era")
        if era:
            eras.add(era)
    return sorted(list(eras))


def get_regions() -> List[str]:
    """Get all unique regions."""
    agents = load_all()
    regions = set()
    for agent in agents:
        regions.update(agent.get("knowledge_profile", {}).get("regions", []))
    return sorted(list(regions))
