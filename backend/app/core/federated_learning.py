import numpy as np
from typing import Dict, Any, List
import time

class ArmyCorpsClientNode:
    def __init__(self, corps_id: str, name: str, sector: str, local_sample_count: int, base_calorie_bias: float):
        self.corps_id = corps_id
        self.name = name
        self.sector = sector
        self.sample_count = local_sample_count
        self.base_calorie_bias = base_calorie_bias
        self.local_weights = np.array([1.8, 0.45, -0.65, 0.35, 1.25]) + base_calorie_bias

    def local_train_epoch(self, global_weights: np.ndarray, differential_privacy_epsilon: float = 1.0) -> Dict[str, Any]:
        gradient = (self.local_weights - global_weights) * 0.35
        updated_weights = global_weights + gradient

        noise_scale = 1.0 / max(differential_privacy_epsilon, 0.1)
        dp_noise = np.random.laplace(0, noise_scale * 0.02, size=updated_weights.shape)
        sanitized_weights = updated_weights + dp_noise

        return {
            "corps_id": self.corps_id,
            "sample_weight": self.sample_count,
            "weights": sanitized_weights.tolist(),
            "differential_privacy_applied": True,
            "epsilon": differential_privacy_epsilon
        }

class FederatedLogisticsCoordinator:
    def __init__(self):
        self.global_weights = np.array([1.80, 0.45, -0.65, 0.35, 1.25])
        self.round_number = 14
        self.clients = [
            ArmyCorpsClientNode("14-CORPS", "HQ 14 Corps (Fire and Fury)", "Ladakh & Siachen Sector", 4200, 0.18),
            ArmyCorpsClientNode("33-CORPS", "HQ 33 Corps (Trishakti)", "Sikkim & Chumbi Sector", 3100, -0.05),
            ArmyCorpsClientNode("03-CORPS", "HQ 3 Corps (Spear Corps)", "Arunachal & Eastern Axis", 2800, -0.10)
        ]
        self.aggregation_history: List[Dict[str, Any]] = []

    def execute_federated_round(self, dp_epsilon: float = 1.2) -> Dict[str, Any]:
        self.round_number += 1
        client_updates = []
        total_samples = sum(c.sample_count for c in self.clients)

        new_weights = np.zeros_like(self.global_weights)

        for client in self.clients:
            update = client.local_train_epoch(self.global_weights, differential_privacy_epsilon=dp_epsilon)
            client_updates.append(update)
            weight_ratio = client.sample_count / total_samples
            new_weights += np.array(update["weights"]) * weight_ratio

        delta_norm = float(np.linalg.norm(new_weights - self.global_weights))
        self.global_weights = new_weights

        round_report = {
            "round_number": self.round_number,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "participating_corps": [c.corps_id for c in self.clients],
            "total_federated_samples": total_samples,
            "convergence_delta": round(delta_norm, 5),
            "differential_privacy_epsilon": dp_epsilon,
            "opsec_compliance": "STRICT_ZERO_DATA_SHARING",
            "global_weights": {
                "w_troop_multiplier": round(float(self.global_weights[0]), 4),
                "w_altitude_stress": round(float(self.global_weights[1]), 4),
                "w_subzero_thermal": round(float(self.global_weights[2]), 4),
                "w_snow_drag": round(float(self.global_weights[3]), 4),
                "w_defcon_tempo": round(float(self.global_weights[4]), 4)
            }
        }
        self.aggregation_history.append(round_report)
        return round_report

    def get_federated_status(self) -> Dict[str, Any]:
        return {
            "current_round": self.round_number,
            "registered_corps_nodes": len(self.clients),
            "consensus_weights": self.global_weights.tolist(),
            "last_round_report": self.aggregation_history[-1] if self.aggregation_history else None,
            "nodes": [
                {
                    "corps_id": c.corps_id,
                    "name": c.name,
                    "sector": c.sector,
                    "local_dataset_size": c.sample_count
                }
                for c in self.clients
            ]
        }

federated_coordinator = FederatedLogisticsCoordinator()
