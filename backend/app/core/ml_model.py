import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, List
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score

from app.config import settings
from app.core.synthetic_data import generate_army_logistics_dataset

MODEL_PATH = settings.MODELS_DIR / "demand_forecaster.joblib"

class MLModelManager:
    """
    Manages training, artifact persistence, and real-time inference
    for multi-output forward supply demand forecasting.
    """

    FEATURE_COLS = [
        "troops", "altitude_m", "ambient_temp_c", 
        "snow_depth_cm", "wind_speed_kmh", "blizzard_active", "defcon_level"
    ]
    
    TARGET_COLS = [
        "daily_rations_kg", "daily_fuel_liters", 
        "daily_ammo_rounds", "daily_medical_kits"
    ]

    def __init__(self):
        self.model = None
        self.metrics = {}
        self.feature_importances = {}
        self.load_or_train()

    def train(self, df: pd.DataFrame = None):
        """
        Trains multi-output Random Forest Regressor on tactical supply logs.
        """
        if df is None:
            df = generate_army_logistics_dataset(n_samples=3000)

        X = df[self.FEATURE_COLS]
        y = df[self.TARGET_COLS]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        regressor = RandomForestRegressor(
            n_estimators=60, 
            max_depth=12, 
            random_state=42, 
            n_jobs=-1
        )
        regressor.fit(X_train, y_train)

        # Evaluation
        y_pred = regressor.predict(X_test)
        mae_overall = mean_absolute_error(y_test, y_pred)
        r2_overall = r2_score(y_test, y_pred)

        self.model = regressor
        self.metrics = {
            "overall_mae": round(float(mae_overall), 2),
            "overall_r2": round(float(r2_overall), 4),
            "model_type": "RandomForestMultiOutputRegressor",
            "n_samples": len(df)
        }

        # Feature Importances
        importances = regressor.feature_importances_
        self.feature_importances = {
            col: round(float(val), 4) 
            for col, val in zip(self.FEATURE_COLS, importances)
        }

        # Save to disk
        joblib.dump({
            "model": self.model,
            "metrics": self.metrics,
            "feature_importances": self.feature_importances
        }, MODEL_PATH)

        return self.metrics

    def load_or_train(self):
        """
        Loads pre-trained model or automatically trains a fresh calibrated artifact.
        """
        if MODEL_PATH.exists():
            try:
                data = joblib.load(MODEL_PATH)
                self.model = data["model"]
                self.metrics = data["metrics"]
                self.feature_importances = data.get("feature_importances", {})
                return
            except Exception:
                pass
        self.train()

    def predict(self, features_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes fast tabular inference for a specific outpost condition.
        """
        if self.model is None:
            self.load_or_train()

        input_data = pd.DataFrame([{
            "troops": features_dict.get("troops", 200),
            "altitude_m": features_dict.get("altitude_m", 4000.0),
            "ambient_temp_c": features_dict.get("ambient_temp_c", -15.0),
            "snow_depth_cm": features_dict.get("snow_depth_cm", 25.0),
            "wind_speed_kmh": features_dict.get("wind_speed_kmh", 30.0),
            "blizzard_active": features_dict.get("blizzard_active", 0),
            "defcon_level": features_dict.get("defcon_level", 2)
        }])[self.FEATURE_COLS]

        pred = self.model.predict(input_data)[0]

        return {
            "predictions": {
                "class1_rations_kg": round(float(pred[0]), 1),
                "class3_fuel_liters": round(float(pred[1]), 1),
                "class5_ammo_rounds": round(float(pred[2])),
                "class8_medical_kits": max(1, round(float(pred[3])))
            },
            "model_metrics": self.metrics,
            "feature_attribution": self.feature_importances
        }

ml_manager = MLModelManager()
