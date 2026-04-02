#!/usr/bin/env python3
"""Start FastAPI server for Great Humans API."""

import sys
import os
from pathlib import Path

# Add parent directories to path
sys.path.append(str(Path(__file__).parent.parent))
sys.path.append(str(Path(__file__).parent.parent / "great_humans"))

if __name__ == "__main__":
    import uvicorn
    from main import app
    
    # Configuration
    host = os.getenv("GREAT_HUMANS_HOST", "0.0.0.0")
    port = int(os.getenv("GREAT_HUMANS_PORT", "8000"))
    
    print(f"🚀 Starting Great Humans API v3.0")
    print(f"📍 Server: http://{host}:{port}")
    print(f"📚 Docs: http://{host}:{port}/docs")
    print(f"📖 ReDoc: http://{host}:{port}/redoc")
    print(f"🔧 Environment: {os.getenv('PYTHONPATH', 'default')}")
    print(f"📊 Agents loaded: {len(__import__('great_humans').load_all())}")
    
    # Start server
    uvicorn.run(app, host=host, port=port, log_level="info")
