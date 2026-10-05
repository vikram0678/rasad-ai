import pytest
from app.core.demand_engine import demand_engine
from app.core.route_engine import route_optimizer
from app.core.guardrail_engine import guardrail_system, DispatchOrderRequest
from app.core.rag_engine import sop_copilot

def test_demand_engine_hypoxia_and_cold_scaling():
    # Base calculation at low elevation and mild temp
    mild = demand_engine.predict_daily_burn(troops=100, altitude_m=1500, ambient_temp_c=10.0, defcon_level=5)
    
    # Extreme high altitude (-25C at 5000m)
    extreme = demand_engine.predict_daily_burn(troops=100, altitude_m=5000, ambient_temp_c=-25.0, defcon_level=5)

    # Rations burn must be significantly higher due to caloric thermal demands
    assert extreme["daily_burn"]["class1_rations_kg"] > mild["daily_burn"]["class1_rations_kg"]
    
    # POL (fuel) for heating must increase markedly in sub-zero temps
    assert extreme["daily_burn"]["class3_pol_liters"] > mild["daily_burn"]["class3_pol_liters"] * 1.5

def test_route_optimizer_shyok_bypass_pathfinding():
    # Clear path should choose standard DS-DBO highway
    clear_path = route_optimizer.calculate_optimal_route(
        origin="FSB_KHALSAR",
        destination="OP_DBO",
        blocked_nodes=[],
        weather_hazard_level="NORMAL"
    )
    assert clear_path["status"] == "OPTIMAL_PATH_FOUND"
    assert "MURGO_CHOKE" in clear_path["path_nodes"]

    # Blocked Murgo Choke must automatically divert to Shyok Bypass
    blocked_path = route_optimizer.calculate_optimal_route(
        origin="FSB_KHALSAR",
        destination="OP_DBO",
        blocked_nodes=["MURGO_CHOKE"],
        weather_hazard_level="NORMAL"
    )
    assert blocked_path["status"] == "OPTIMAL_PATH_FOUND"
    assert blocked_path["hazard_rerouted"] is True
    assert "SHYOK_BYPASS" in blocked_path["path_nodes"]
    assert "MURGO_CHOKE" not in blocked_path["path_nodes"]

def test_guardrails_overweight_rejection():
    # Tatra capacity is 10,000kg each; 2 Tatras = 20,000kg limit
    overweight_order = DispatchOrderRequest(
        order_id="DSP-OVERWEIGHT-01",
        origin_depot="DEPOT-KHALSAR",
        target_outpost="OP-DBO-01",
        vehicle_type="Tatra 8x8 Heavy Utility Truck",
        vehicle_count=2,
        cargo_weight_kg=25000.0, # 25 tons exceeds 20 ton limit
        payload_fuel_liters=2000.0,
        payload_ammo_rounds=5000,
        assigned_route="Western Shyok Ridge Bypass",
        route_is_blocked=False
    )
    result = guardrail_system.validate_dispatch(overweight_order)
    assert result.is_approved is False
    assert "exceed" in result.rejection_reason.lower() or "limit" in result.rejection_reason.lower()

def test_rag_copilot_retrieval():
    res = sop_copilot.query("How should acute mountain sickness HAPE be treated?")
    assert len(res["citations"]) > 0
    citation = res["citations"][0]
    assert "HAPE" in citation["content"] or "oxygen" in citation["content"].lower()
