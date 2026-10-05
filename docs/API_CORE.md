# 🇮🇳 RASAD-AI: API Core & Defense FastAPI Architecture
### Headquarters 14 Corps Northern Command — Predictive Forward Supply Chain & Logistics Engine
*SIH26251 — Ministry of Defence (MoD) / Defence Services Staff College (DSSC)*

---

## 🏛️ 1. Architecture Overview

The **RASAD-AI API Core** is a production-grade FastAPI system engineered for high-altitude forward defense operations in the Ladakh and Siachen sectors. It connects multi-output machine learning models, terrain-aware GIS pathfinding, 4-stage safety guardrails, doctrine RAG copilot, and optical cargo scanning into a unified, high-performance edge backend.

```
D:\Gpp-Tasks\RASAD-AI\backend\
├── app/
│   ├── api/
│   │   ├── endpoints.py              # Root router re-exporting v1 endpoints
│   │   └── v1/
│   │       ├── router.py             # Modular v1 router aggregating domain endpoints
│   │       └── endpoints/
│   │           ├── health.py         # Liveness probe & deep diagnostic self-test
│   │           ├── demand.py         # Multi-output ML & physiological demand burns
│   │           ├── routes.py         # NetworkX GIS graph routing with avalanche diversion
│   │           ├── guardrails.py     # 4-stage dispatch clearance & audit logging
│   │           ├── copilot.py        # Indian Army doctrine SOP RAG copilot
│   │           ├── cargo.py          # Simulated YOLOv8 optical cargo manifest
│   │           └── aar.py            # After-Action Review audit reports
│   ├── core/
│   │   ├── database.py               # Tactical state manager & dispatch audit store
│   │   ├── demand_engine.py          # Hypoxia & sub-zero thermal calorie scaling
│   │   ├── diagnostics.py            # Deep automated subsystem health & self-test
│   │   ├── exceptions.py             # Custom domain exceptions & error codes
│   │   ├── guardrail_engine.py       # 4-stage safety state-machine & HMAC tokens
│   │   ├── middleware.py             # Request timing, request ID & structured errors
│   │   ├── ml_model.py               # Multi-output Random Forest regressor
│   │   ├── rag_engine.py             # SOP manual search & citations
│   │   ├── route_engine.py           # NetworkX graph topology & Shyok bypass logic
│   │   └── synthetic_data.py         # Multi-feature Ladakh tactical supply log generator
│   ├── schemas/
│   │   ├── __init__.py               # Central schema exports
│   │   ├── common.py                 # API envelope & error models
│   │   ├── demand.py                 # Forecast request/response & DOS schemas
│   │   ├── route.py                  # Route request/response & elevation profiles
│   │   ├── guardrail.py              # Dispatch order & validation result schemas
│   │   ├── copilot.py                # Doctrine query & citation schemas
│   │   ├── cargo.py                  # Optical manifest & YOLO detection schemas
│   │   └── telemetry.py              # Health, diagnostics & AAR report schemas
│   ├── config.py                     # Pydantic configuration & defense thresholds
│   └── main.py                       # FastAPI application & CORS configuration
├── tests/
│   ├── conftest.py                   # Pytest/TestClient test fixtures
│   ├── test_api_endpoints.py         # Endpoint contract & status tests
│   ├── test_core_engines.py          # Pure mathematical & algorithmic tests
│   └── test_suite.py                 # Self-contained unittest suite (13 tests)
├── run_backend.py                    # Standalone UTF-8 launcher script
└── verify_backend.py                 # 12-point automated verification & diagnostic CLI
```

---

## 🚀 2. Quickstart & Verification Commands

### A. Run Automated System Diagnostic (12-Point Self-Test)
```powershell
& "d:\Gpp-Tasks\RASAD-AI\.venv\Scripts\python.exe" "d:\Gpp-Tasks\RASAD-AI\verify_backend.py"
```
*Output: Verifies live daemon connection, ML inference, NetworkX routing, avalanche diversion, guardrails, and RAG retrieval.*

### B. Run Full Test Suite (Python Standard Library Unittest)
```powershell
& "d:\Gpp-Tasks\RASAD-AI\.venv\Scripts\python.exe" -m unittest "d:\Gpp-Tasks\RASAD-AI\backend\tests\test_suite.py" -v
```

### C. Launch / Restart Backend Server Manually
```powershell
& "d:\Gpp-Tasks\RASAD-AI\.venv\Scripts\python.exe" "d:\Gpp-Tasks\RASAD-AI\run_backend.py"
```
*Accessible at: `http://127.0.0.1:8000` (Interactive Swagger at `http://127.0.0.1:8000/docs`)*

---

## 📡 3. Key Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System liveness, RISAT-2B link, and ML model status |
| `GET` | `/api/diagnostics` | Deep automated dry-run of all core subsystems with latency stats |
| `GET` | `/api/posts` | All monitored forward defense posts (DBO, Siachen, Galwan, Pangong) |
| `GET` | `/api/depots` | Central base supply depots (Leh, Khalsar) |
| `POST` | `/api/forecast` | ML multi-output regressor + physiological sub-zero demand projection |
| `POST` | `/api/route/optimize` | GIS shortest path with Murgo Choke avalanche diversion |
| `GET` | `/api/route/network` | Full graph topology with waypoints and pass elevations |
| `POST` | `/api/dispatch/guardrails` | 4-stage safety clearance & cryptographic HMAC token issuance |
| `GET` | `/api/dispatch/history` | Immutable log of authorized convoy movements |
| `POST` | `/api/copilot/query` | RAG doctrine search over Indian Army high-altitude warfare manuals |
| `POST` | `/api/copilot/semantic_search` | Dense vector cosine similarity search over military doctrines |
| `POST` | `/api/copilot/ragas_eval` | Automated RAGAS evaluation (Faithfulness, Relevance, Semantic Match) |
| `POST` | `/api/security/scan_prompt` | AI Security threat filter defending against prompt injection & OPSEC breaches |
| `GET` | `/api/security/metrics` | Real-time defense firewall status & neutralized attack telemetry |
| `POST` | `/api/federated/simulate_round` | Multi-Corps Federated Averaging (FedAvg) consensus round with Differential Privacy |
| `GET` | `/api/federated/status` | Federated network status across 14 Corps, 33 Corps, and 3 Corps |
| `GET` | `/api/sql/dispatches` | Parameterized SQL query for relational convoy records |
| `GET` | `/api/sql/inventory_summary` | Relational SQL join of outposts and supply health |
| `GET` | `/api/cargo/cv_manifest` | YOLOv8 simulated optical cargo crate scan & seal verification |
| `GET` | `/api/aar/report` | After-Action Review audit report for commanding officers |

---

## 🔍 4. Sample Request & Response Payloads

### 1. Demand Forecasting (`POST /api/forecast`)
**Request:**
```json
{
  "troops": 340,
  "altitude_m": 5065.0,
  "ambient_temp_c": -24.0,
  "defcon_level": 2,
  "snow_depth_cm": 35.0,
  "wind_speed_kmh": 45.0
}
```
**Response Highlights:**
```json
{
  "forecast_result": {
    "daily_burn": {
      "class1_rations_kg": 856.1,
      "class3_pol_liters": 1768.0,
      "class5_ammo_rounds": 1428,
      "class8_medical_kits": 10
    }
  },
  "ml_tabular_inference": {
    "predictions": {
      "class1_rations_kg": 856.1,
      "class3_fuel_liters": 1768.0,
      "class5_ammo_rounds": 1428,
      "class8_medical_kits": 10
    }
  },
  "inventory_health": {
    "overall_days_of_supply": 1.8,
    "health_status": "CRITICAL"
  }
}
```

### 2. GIS Route Optimization (`POST /api/route/optimize`)
**Request:**
```json
{
  "origin": "FSB_KHALSAR",
  "destination": "OP_DBO",
  "blocked_nodes": ["MURGO_CHOKE"],
  "weather_hazard_level": "NORMAL"
}
```
**Response Highlights:**
```json
{
  "status": "OPTIMAL_PATH_FOUND",
  "origin": "FSB_KHALSAR",
  "destination": "OP_DBO",
  "path_nodes": ["FSB_KHALSAR", "SHYOK_BEND", "SHYOK_BYPASS", "OP_DBO"],
  "distance_km": 248.0,
  "estimated_transit_hours": 9.8,
  "hazard_rerouted": true,
  "corridor_type": "ALTERNATE_ALL_TERRAIN_BYPASS",
  "hazard_status": "REROUTED_CLEAR"
}
```

### 3. 4-Stage Dispatch Safety Guardrails (`POST /api/dispatch/guardrails`)
**Request:**
```json
{
  "order_id": "DSP-LADAKH-8842",
  "origin_depot": "DEPOT-KHALSAR",
  "target_outpost": "OP-DBO-01",
  "vehicle_type": "Tatra 8x8 Heavy Utility Truck",
  "vehicle_count": 4,
  "cargo_weight_kg": 18500.0,
  "payload_fuel_liters": 4500.0,
  "payload_ammo_rounds": 12000,
  "assigned_route": "Western Shyok Ridge Bypass",
  "route_is_blocked": false
}
```
**Response Highlights:**
```json
{
  "is_approved": true,
  "authorization_token": "AUTH-CORPS14-3864115AC5",
  "stages": [
    {"stage_id": 1, "name": "Depot Reserve Buffer Verification", "status": "PASSED"},
    {"stage_id": 2, "name": "Route Risk & Weather Clearance", "status": "PASSED"},
    {"stage_id": 3, "name": "Vehicle Payload & Snow-Traverse Limit", "status": "PASSED"},
    {"stage_id": 4, "name": "Cryptographic Clearance Token Issuance", "status": "PASSED"}
  ]
}
```

---

## 🛠️ 5. Debugging & Verification Best Practices

1. **Interactive OpenAPI (Swagger) UI:**
   Navigate to [http://localhost:8000/docs](http://localhost:8000/docs) in your browser. Every endpoint has realistic mock inputs pre-configured in `json_schema_extra` so you can click "Try it out" and execute live requests without manually typing JSON.
2. **Structured Error Handling:**
   All 400, 404, 409, and 422 errors return a structured JSON response with an `error_code`, human-readable `detail`, and actionable `suggestion`.
3. **Telemetry & Tracing Headers:**
   Every HTTP response includes:
   - `X-Request-ID`: Unique correlation ID for tracing transactions.
   - `X-Process-Time-Ms`: High-precision microsecond execution time.
   - `X-Theater-Sector`: `NORTHERN_COMMAND_LADAKH`.
