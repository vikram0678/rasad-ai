import sys
from pathlib import Path

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

backend_dir = Path(__file__).resolve().parent / "backend"
sys.path.insert(0, str(backend_dir))

if __name__ == "__main__":
    import uvicorn
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8005
    print(f"Serving RASAD-AI API at http://127.0.0.1:{port}")
    print(f"Swagger docs at http://127.0.0.1:{port}/docs")
    uvicorn.run("app.main:app", host="127.0.0.1", port=port, reload=False, app_dir=str(backend_dir))
