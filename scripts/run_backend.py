import sys
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

root_dir = Path(__file__).resolve().parent.parent if Path(__file__).resolve().parent.name == "scripts" else Path(__file__).resolve().parent
backend_dir = root_dir / "backend"
sys.path.insert(0, str(backend_dir))

if __name__ == "__main__":
    import uvicorn
    print("Serving RASAD-AI API at http://127.0.0.1:8001")
    print("Swagger docs at http://127.0.0.1:8001/docs")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8001, reload=False, app_dir=str(backend_dir))
