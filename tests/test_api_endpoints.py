import pytest

def test_root_endpoint(client):
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "OPERATIONAL"
    assert "interactive_docs" in data

def test_system_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "OPERATIONAL"
    assert data["satellite_mesh"] == "RISAT-2B ONLINE"
    assert "model_mae" in data

def test_deep_diagnostics(client):
    res = client.get("/api/diagnostics")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] in ["ALL_SYSTEMS_GO", "DEGRADED"]
    assert data["total_checks"] >= 5
    assert data["passed_checks"] == data["total_checks"]
    # Check headers
    assert "x-request-id" in res.headers
    assert "x-process-time-ms" in res.headers

def test_list_posts_and_depots(client):
    posts_res = client.get("/api/posts")
    assert posts_res.status_code == 200
    posts = posts_res.json()
    assert posts["count"] >= 3
    assert any("dbo" in p["id"].lower() for p in posts["outposts"])

    depots_res = client.get("/api/depots")
    assert depots_res.status_code == 200
    depots = depots_res.json()
    assert depots["count"] >= 2

def test_demand_forecast(client):
    payload = {
        "troops": 340,
        "altitude_m": 5065.0,
        "ambient_temp_c": -24.0,
        "defcon_level": 2,
        "snow_depth_cm": 35.0,
        "wind_speed_kmh": 45.0
    }
    res = client.post("/api/forecast", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "forecast_result" in data
    assert "ml_tabular_inference" in data
    assert "inventory_health" in data

    # Verify military demand ranges
    burn = data["forecast_result"]["daily_burn"]
    assert burn["class1_rations_kg"] > 500
    assert burn["class3_pol_liters"] > 1000

def test_route_optimize_with_avalanche_rerouting(client):
    payload = {
        "origin": "FSB_KHALSAR",
        "destination": "OP_DBO",
        "blocked_nodes": ["MURGO_CHOKE"],
        "weather_hazard_level": "NORMAL"
    }
    res = client.post("/api/route/optimize", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "OPTIMAL_PATH_FOUND"
    assert data["hazard_rerouted"] is True
    assert "SHYOK_BYPASS" in data["path_nodes"]
    assert "MURGO_CHOKE" not in data["path_nodes"]
    assert data["distance_km"] > 0
    assert data["estimated_transit_hours"] > 0

def test_route_invalid_node_error(client):
    payload = {
        "origin": "NON_EXISTENT_HUB",
        "destination": "OP_DBO",
        "blocked_nodes": []
    }
    res = client.post("/api/route/optimize", json=payload)
    assert res.status_code == 404
    err_data = res.json()
    assert err_data["success"] is False
    assert err_data["error"]["error_code"] == "NODE_NOT_FOUND"

def test_dispatch_guardrails_approved(client):
    payload = {
        "order_id": "DSP-TEST-OK-01",
        "origin_depot": "DEPOT-KHALSAR",
        "target_outpost": "OP-DBO-01",
        "vehicle_type": "Tatra 8x8 Heavy Utility Truck",
        "vehicle_count": 4,
        "cargo_weight_kg": 18000.0,
        "payload_fuel_liters": 4000.0,
        "payload_ammo_rounds": 10000,
        "assigned_route": "Western Shyok Ridge Bypass",
        "route_is_blocked": False
    }
    res = client.post("/api/dispatch/guardrails", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_approved"] is True
    assert len(data["authorization_token"]) > 10
    assert len(data["stages"]) == 4

def test_dispatch_guardrails_rejected_on_hazard(client):
    payload = {
        "order_id": "DSP-TEST-FAIL-02",
        "origin_depot": "DEPOT-KHALSAR",
        "target_outpost": "OP-DBO-01",
        "vehicle_type": "Tatra 8x8 Heavy Utility Truck",
        "vehicle_count": 4,
        "cargo_weight_kg": 18000.0,
        "payload_fuel_liters": 4000.0,
        "payload_ammo_rounds": 10000,
        "assigned_route": "DS-DBO Km 134",
        "route_is_blocked": True  # Route blocked!
    }
    res = client.post("/api/dispatch/guardrails", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["is_approved"] is False
    assert "Route blocked" in data["rejection_reason"] or "avalanche" in data["rejection_reason"].lower()

def test_sop_copilot_rag(client):
    payload = {
        "query": "What is the winter SOP reserve requirement for Siachen Kumar Base?"
    }
    res = client.post("/api/copilot/query", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert len(data["citations"]) > 0
    assert any("siachen" in c["content"].lower() or "pol" in c["content"].lower() or "reserve" in c["content"].lower() for c in data["citations"])

def test_cargo_manifest(client):
    res = client.get("/api/cargo/cv_manifest")
    assert res.status_code == 200
    data = res.json()
    assert data["scan_status"] == "COMPLETED"
    assert len(data["yolo_detections"]) >= 3
    assert data["verdict"] == "VERIFIED_SAFE"

def test_aar_report(client):
    res = client.get("/api/aar/report")
    assert res.status_code == 200
    data = res.json()
    assert "audit_summary" in data
    assert data["audit_summary"]["total_dispatches"] >= 0
