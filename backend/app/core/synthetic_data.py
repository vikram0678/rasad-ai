import numpy as np
import pandas as pd
from typing import Tuple

def generate_army_logistics_dataset(n_samples: int = 3500, random_seed: int = 42) -> pd.DataFrame:
    """
    Generates synthetic daily military logistics consumption logs for high-altitude posts.
    Simulates:
      - Troop count (50 to 500 soldiers per outpost)
      - Altitude (3,000m to 5,500m across Ladakh & Siachen)
      - Ambient temperatures (-35°C in glacial winter to +15°C in valley summer)
      - Snow depth (0 to 250 cm) & wind speed (5 to 80 km/h)
      - Readiness posture (DEFCON 1 to 4)
    """
    np.random.seed(random_seed)

    troops = np.random.randint(60, 480, size=n_samples)
    altitude_m = np.random.uniform(3100.0, 5300.0, size=n_samples)
    
    # Temperature correlates inversely with altitude
    temp_base = 5.0 - ((altitude_m - 3000.0) / 100.0) * 0.8
    ambient_temp_c = temp_base + np.random.normal(loc=-10.0, scale=8.0, size=n_samples)
    ambient_temp_c = np.clip(ambient_temp_c, -38.0, 18.0)

    snow_depth_cm = np.where(ambient_temp_c < 0.0, np.abs(ambient_temp_c) * np.random.uniform(1.5, 5.0, size=n_samples), 0.0)
    wind_speed_kmh = np.random.uniform(10.0, 75.0, size=n_samples)
    blizzard_active = ((ambient_temp_c < -12.0) & (wind_speed_kmh > 45.0) & (snow_depth_cm > 40.0)).astype(int)
    
    defcon_level = np.random.choice([1, 2, 3, 4], size=n_samples, p=[0.05, 0.40, 0.40, 0.15])

    # 1. Class I Rations (kg): base 2.2 kg/soldier + altitude hypoxia caloric surge
    alt_caloric_multiplier = 1.0 + np.maximum(0.0, (altitude_m - 3000.0) / 1000.0) * 0.07
    daily_rations_kg = troops * 2.2 * alt_caloric_multiplier * np.random.normal(1.0, 0.03, size=n_samples)

    # 2. Class III Fuel / POL (Liters): base 2.5 L/soldier + massive sub-zero bukhari heating surge
    cold_penalty = np.maximum(0.0, -ambient_temp_c)
    fuel_multiplier = 1.0 + (cold_penalty * 0.048) + (blizzard_active * 0.35)
    daily_fuel_liters = troops * 2.5 * fuel_multiplier * np.random.normal(1.0, 0.04, size=n_samples)

    # 3. Class V Ammo (rounds): operational tempo dependent
    tempo_multiplier = np.select(
        [defcon_level == 1, defcon_level == 2, defcon_level == 3, defcon_level == 4],
        [7.5, 2.5, 1.4, 1.0]
    )
    daily_ammo_rounds = troops * 1.5 * tempo_multiplier * np.random.normal(1.0, 0.06, size=n_samples)

    # 4. Class VIII Medical Kits: cold weather frostbite + altitude HAPE events
    medical_risk = 1.0 + (altitude_m / 4000.0) * 0.5 + (cold_penalty * 0.03)
    daily_medical_kits = np.maximum(1, np.round(troops * 0.02 * medical_risk)).astype(int)

    df = pd.DataFrame({
        "troops": troops,
        "altitude_m": np.round(altitude_m, 1),
        "ambient_temp_c": np.round(ambient_temp_c, 1),
        "snow_depth_cm": np.round(snow_depth_cm, 1),
        "wind_speed_kmh": np.round(wind_speed_kmh, 1),
        "blizzard_active": blizzard_active,
        "defcon_level": defcon_level,
        "daily_rations_kg": np.round(daily_rations_kg, 1),
        "daily_fuel_liters": np.round(daily_fuel_liters, 1),
        "daily_ammo_rounds": np.round(daily_ammo_rounds).astype(int),
        "daily_medical_kits": daily_medical_kits
    })

    return df

if __name__ == "__main__":
    df = generate_army_logistics_dataset()
    print("Synthetic dataset sample:")
    print(df.head())
    print(f"Total samples generated: {len(df)}")
