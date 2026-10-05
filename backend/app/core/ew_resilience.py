import math
import time
from typing import Dict, Any, List, Tuple, Optional

class KalmanFilter1D:
    def __init__(self, initial_state: float, process_variance: float = 1e-4, measurement_variance: float = 0.05):
        self.state = initial_state
        self.variance = 1.0
        self.process_variance = process_variance
        self.measurement_variance = measurement_variance

    def update(self, measurement: float) -> float:
        self.variance += self.process_variance
        kalman_gain = self.variance / (self.variance + self.measurement_variance)
        self.state = self.state + kalman_gain * (measurement - self.state)
        self.variance = (1 - kalman_gain) * self.variance
        return self.state

class AdversarialEWResilienceEngine:
    def __init__(self):
        self.kalman_ammo = KalmanFilter1D(initial_state=48000.0)
        self.kalman_temp = KalmanFilter1D(initial_state=-24.0)
        self.last_known_positions: Dict[str, Tuple[float, float, float]] = {
            "CONVOY_ALPHA_01": (34.5020, 77.6820, time.time())
        }
        self.ew_incidents: List[Dict[str, Any]] = []

    def validate_gps_telemetry(
        self,
        asset_id: str,
        reported_lat: float,
        reported_lng: float,
        reported_timestamp: Optional[float] = None
    ) -> Dict[str, Any]:
        curr_time = reported_timestamp or time.time()
        prev_lat, prev_lng, prev_time = self.last_known_positions.get(asset_id, (reported_lat, reported_lng, curr_time - 60))

        r_earth = 6371.0
        d_lat = math.radians(reported_lat - prev_lat)
        d_lng = math.radians(reported_lng - prev_lng)
        a = (math.sin(d_lat / 2) ** 2 + 
             math.cos(math.radians(prev_lat)) * math.cos(math.radians(reported_lat)) * math.sin(d_lng / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        distance_km = r_earth * c

        dt_hours = max((curr_time - prev_time) / 3600.0, 0.001)
        calculated_speed_kmh = distance_km / dt_hours

        is_spoofed = calculated_speed_kmh > 75.0
        verdict = "GPS_SIGNAL_AUTHENTIC"
        action = "COORDINATE_LOGGED"

        if is_spoofed:
            verdict = "ADVERSARIAL_EW_GPS_SPOOF_DETECTED"
            action = "COORDINATE_REJECTED_REVERTING_TO_DEAD_RECKONING"
            incident = {
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
                "asset_id": asset_id,
                "threat_type": "GPS_COORDINATE_SPOOFING",
                "implied_speed_kmh": round(calculated_speed_kmh, 1),
                "threshold_kmh": 75.0,
                "mitigation": "Dead-Reckoning Kalman Vector Engaged"
            }
            self.ew_incidents.append(incident)
        else:
            self.last_known_positions[asset_id] = (reported_lat, reported_lng, curr_time)

        return {
            "asset_id": asset_id,
            "verdict": verdict,
            "is_spoofed": is_spoofed,
            "implied_velocity_kmh": round(calculated_speed_kmh, 1),
            "distance_jump_km": round(distance_km, 2),
            "defense_action": action,
            "safe_estimated_lat": prev_lat if is_spoofed else reported_lat,
            "safe_estimated_lng": prev_lng if is_spoofed else reported_lng
        }

    def validate_inventory_telemetry(
        self,
        post_id: str,
        reported_ammo_rds: float,
        reported_temp_c: float,
        active_combat_declared: bool = False
    ) -> Dict[str, Any]:
        prev_ammo = self.kalman_ammo.state
        delta_ammo = prev_ammo - reported_ammo_rds

        anomaly_detected = False
        warning = None

        if delta_ammo > 10000.0 and not active_combat_declared:
            anomaly_detected = True
            warning = f"CYBER_ANOMALY: Sudden drop of {delta_ammo:.0f} rounds without active firefight signal."
            filtered_ammo = self.kalman_ammo.state
        else:
            filtered_ammo = self.kalman_ammo.update(reported_ammo_rds)

        filtered_temp = self.kalman_temp.update(reported_temp_c)

        return {
            "post_id": post_id,
            "anomaly_detected": anomaly_detected,
            "warning": warning,
            "reported_ammo_rds": reported_ammo_rds,
            "kalman_filtered_ammo_rds": round(filtered_ammo),
            "kalman_filtered_temp_c": round(filtered_temp, 1),
            "sensor_integrity_status": "TAMPER_SUSPECTED" if anomaly_detected else "TELEMETRY_AUTHENTIC"
        }

ew_engine = AdversarialEWResilienceEngine()
