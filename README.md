# RASAD-AI (रसद)

Predictive Logistics & Forward Supply Chain Management System for High-Altitude Military Operations.

Built for the **Ministry of Defence (MoD) / DSSC** under **SIH26251**.

---

## Architecture Overview

```
RASAD-AI/
├── frontend/             # Single-Page Dashboard (Vanilla JS + Leaflet + Chart.js + Vite)
│   ├── src/
│   │   ├── components/   # Modular UI components (Tactical Map, Demand Chart)
│   │   ├── data/         # Tactical sector mock data & schemas
│   │   ├── main.js       # Core application controller
│   │   └── style.css     # Military HUD design system
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # FastAPI High-Performance Asynchronous Backend
│   ├── app/
│   │   ├── api/v1/       # Versioned REST endpoints (Demand, Routing, Guardrails, XAI, EW)
│   │   ├── core/         # Core engines (CVRPTW, XAI SHAP, Tri-Modal, EW Kalman, RAG)
│   │   ├── schemas/      # Pydantic request/response schemas
│   │   ├── config.py     # Centralized settings & paths
│   │   └── main.py       # FastAPI application entry point
│   ├── data/             # SQLite database & local assets
│   └── saved_models/     # Serialized machine learning models
│
├── tests/                # Automated Verification & Test Harnesses
│   ├── test_suite.py     # End-to-end unittests across all API endpoints
│   ├── verify_backend.py # 22-point deep system diagnostic verification
│   ├── conftest.py       # Pytest fixtures & test clients
│   ├── test_api_endpoints.py
│   └── test_core_engines.py
│
├── scripts/              # Operational & Development Runners
│   ├── run_backend.py
│   ├── run_backend.bat
│   └── test_backend.bat
│
├── docs/                 # Engineering Specifications & Protocols
│   └── API_CORE.md
│
├── legacy/               # Reference implementations & exploratory prototypes
│   └── modules/
│
├── .venv/                # Isolated Python virtual environment
├── Dockerfile
├── docker-compose.yml
├── requirements.txt
└── package.json          # Root workspace scripts
```

---

## Quick Start

### 1. Backend Service (FastAPI)

Using the local Python virtual environment:

```powershell
# From project root
& ".venv\Scripts\python.exe" run_backend.py
```

* API Live Server: `http://127.0.0.1:8000`
* Interactive Documentation (Swagger UI): `http://127.0.0.1:8000/docs`
* ReDoc Specification: `http://127.0.0.1:8000/redoc`

### 2. Frontend Dashboard (Vite)

```powershell
# From project root
npm run dev

# Or directly in frontend/
cd frontend
npm run dev
```

* Dashboard UI: `http://localhost:5173`

---

## Running Verification & Tests

Run the complete test suite (22 system diagnostic checks + 23 unittests):

```powershell
# Windows Batch
test_backend.bat

# Or run unittests directly
& ".venv\Scripts\python.exe" -m unittest tests/test_suite.py -v

# Or run diagnostic verifier directly
& ".venv\Scripts\python.exe" tests/verify_backend.py
```

---

## Core Capabilities

1. **Operations Research (CVRPTW)**: Capacitated routing solver with Bridge MLC-24 constraints and mountain pass time windows (06:00–13:30 hrs).
2. **Explainable AI (XAI)**: SHAP-style feature attribution waterfall calculating exact percentage contributions for sub-zero cold, hypoxia, and DEFCON status.
3. **Tri-Modal Logistics Fusion**: Coordinated multimodal transport across heavy ground convoys (Tatra 8x8), IAF C-130J aerial parachute drops at DBO ALG, and autonomous logistics drones for medical plasma.
4. **Electronic Warfare (EW) Resilience**: 1D Kalman filter state tracker with velocity anti-spoofing ($v \le 120$ km/h) and cryptographic tamper verification.
5. **Zero-Cloud Air-Gapped Deployment**: 100% self-contained on ruggedized edge hardware over VHF tactical mesh networks.
