from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Dict, Any

from app.core.federated_learning import federated_coordinator

router = APIRouter(tags=["Federated Machine Learning (FedAvg)"])

class FedRoundRequest(BaseModel):
    differential_privacy_epsilon: float = Field(default=1.2, ge=0.1, le=10.0, example=1.2)

@router.post(
    "/federated/simulate_round",
    summary="Execute Federated Averaging (FedAvg) Consensus Round",
    description="Simulates decentralized multi-corps training across HQ 14 Corps, 33 Corps, and 3 Corps with Laplace Differential Privacy noise."
)
def execute_federated_round(req: FedRoundRequest = FedRoundRequest()):
    return federated_coordinator.execute_federated_round(dp_epsilon=req.differential_privacy_epsilon)

@router.get(
    "/federated/status",
    summary="Get Multi-Corps Federated Network Status",
    description="Returns participating Corps client nodes, global model weights, and convergence history."
)
def get_federated_status():
    return federated_coordinator.get_federated_status()
