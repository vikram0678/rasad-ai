"""
========================================================================================
RASAD-AI: Military Temporal Fusion Transformer (TFT) Training Engine
Hardware Target: NVIDIA GeForce RTX (CUDA 12.x Accelerated)
Training Dataset: 86-Year Daily Historical Climate Records of Leh, Ladakh (1940-2026)
Task: Multi-Horizon Quantile Supply Forecasting (D+1 to D+7 Ahead with P10, P50, P90)
========================================================================================
"""

import os
import sys
import time
import json
import numpy as np
import pandas as pd
from tqdm import tqdm

# Ensure utf-8 output compatibility
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Base Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(BASE_DIR, "backend"))

from app.core.tft_model import MilitaryTemporalFusionTransformer, QuantileLoss, TORCH_AVAILABLE

TSV_DIR = os.path.join(BASE_DIR, "datasets", "processed_tsv")
MODELS_DIR = os.path.join(BASE_DIR, "backend", "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)

class Color:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def train_tft_pipeline():
    print(Color.BOLD + Color.HEADER + "\n>>> INITIALIZING MILITARY TEMPORAL FUSION TRANSFORMER (TFT)" + Color.ENDC)
    
    if not TORCH_AVAILABLE:
        print(Color.FAIL + "PyTorch not yet installed. Please wait for pip installation to finish." + Color.ENDC)
        return

    import torch
    import torch.nn as nn
    from torch.utils.data import TensorDataset, DataLoader

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(Color.GREEN + f"  [+] Active Compute Device: {device} ({torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'})" + Color.ENDC)

    # 1. Load Data
    leh_tsv = os.path.join(TSV_DIR, "leh_ladakh_climate_1940_2026.tsv")
    print(Color.BLUE + f"  [+] Ingesting Leh Climate Dataset: {os.path.basename(leh_tsv)}" + Color.ENDC)
    df = pd.read_csv(leh_tsv, sep='\t')
    print(f"      Loaded {len(df):,} chronological daily records (1940 - 2026)")

    # 2. Physics & Military Grounding
    np.random.seed(42)
    n = len(df)
    temp_min = df['temp_min_c'].fillna(-15.0).values
    apparent_temp = df['apparent_temp_min_c'].fillna(-18.0).values
    snowfall = df['snowfall_cm'].fillna(0.0).values
    wind_kmh = df['wind_speed_max_kmh'].fillna(20.0).values

    # Forward outpost simulated attributes
    troops = np.random.randint(180, 320, size=n)
    altitude = np.random.choice([3500.0, 4200.0, 5065.0], size=n)
    bunkers = np.round(troops / 8.0)

    # Grounded target calculation
    cold_delta = np.maximum(0.0, -temp_min)
    fuel = (bunkers * 18.5) + (cold_delta * 38.0) + (snowfall * 12.0) + np.random.normal(0, 10, size=n)
    rations = (troops * 2.85) + (cold_delta * 2.5) + np.random.normal(0, 4, size=n)
    ammo = troops * 30.0 + np.random.normal(0, 30, size=n)
    medical = (troops * 0.06) + (altitude >= 4500) * 6.0 + (temp_min < -20) * 4.0

    targets = np.stack([
        np.maximum(400.0, fuel),
        np.maximum(200.0, rations),
        np.maximum(800.0, ammo),
        np.maximum(1.0, medical)
    ], axis=-1) # [n, 4]

    # Normalize inputs for stable deep transformer convergence
    mean_temp, std_temp = temp_min.mean(), temp_min.std() + 1e-6
    mean_app, std_app = apparent_temp.mean(), apparent_temp.std() + 1e-6
    mean_snow, std_snow = snowfall.mean(), snowfall.std() + 1e-6
    mean_wind, std_wind = wind_kmh.mean(), wind_kmh.std() + 1e-6

    hist_feats_norm = np.stack([
        (temp_min - mean_temp) / std_temp,
        (apparent_temp - mean_app) / std_app,
        (snowfall - mean_snow) / std_snow,
        (wind_kmh - mean_wind) / std_wind,
        fuel / 1000.0,
        rations / 500.0
    ], axis=-1)

    future_feats_norm = np.stack([
        (temp_min - mean_temp) / std_temp,
        (snowfall - mean_snow) / std_snow,
        (wind_kmh < 40.0).astype(float) # Pass transit open window flag
    ], axis=-1)

    static_feats_norm = np.stack([
        altitude / 5000.0,
        troops / 400.0,
        bunkers / 50.0
    ], axis=-1)

    # 3. Create Multi-Horizon Sliding Windows
    # Historical context: 14 days | Forecast horizon: 7 days
    hist_len = 14
    future_len = 7
    total_seq = hist_len + future_len
    sample_stride = 4 # Fast efficient sampling
    
    indices = list(range(0, n - total_seq, sample_stride))
    num_samples = len(indices)

    static_list = []
    hist_list = []
    future_list = []
    target_list = []

    for idx in indices:
        static_list.append(static_feats_norm[idx])
        hist_list.append(hist_feats_norm[idx:idx + hist_len])
        future_list.append(future_feats_norm[idx + hist_len:idx + total_seq])
        target_list.append(targets[idx + hist_len:idx + total_seq])

    X_static = torch.tensor(np.array(static_list), dtype=torch.float32)
    X_hist = torch.tensor(np.array(hist_list), dtype=torch.float32)
    X_future = torch.tensor(np.array(future_list), dtype=torch.float32)
    Y_targets = torch.tensor(np.array(target_list), dtype=torch.float32)

    print(Color.CYAN + f"  [+] Assembled {num_samples:,} Multi-Horizon Sequence Windows" + Color.ENDC)
    print(f"      Static Shape   : {X_static.shape}")
    print(f"      Historical Seq : {X_hist.shape} (14 days past)")
    print(f"      Future Horizon : {X_future.shape} (7 days ahead)")
    print(f"      Target Forecast: {Y_targets.shape} (P10, P50, P90 for 4 Supply Classes)")

    # 4. Train / Val Split & DataLoader
    split_idx = int(0.85 * num_samples)
    train_dataset = TensorDataset(X_static[:split_idx], X_hist[:split_idx], X_future[:split_idx], Y_targets[:split_idx])
    val_dataset = TensorDataset(X_static[split_idx:], X_hist[split_idx:], X_future[split_idx:], Y_targets[split_idx:])

    batch_size = 64
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    # 5. Initialize Model & Optimizer
    model = MilitaryTemporalFusionTransformer(
        num_static_features=3,
        num_historical_features=6,
        num_future_features=3,
        num_targets=4,
        hidden_dim=64,
        n_heads=4,
        dropout=0.1
    ).to(device)

    criterion = QuantileLoss(quantiles=[0.10, 0.50, 0.90])
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=10)

    # 6. GPU Training Loop
    epochs = 8
    print(Color.BOLD + f"\n  [TRAIN] Training TFT on {device} across {epochs} Epochs with Quantile Loss..." + Color.ENDC)
    
    t_start = time.time()
    for epoch in range(1, epochs + 1):
        model.train()
        train_loss = 0.0
        for s_b, h_b, f_b, y_b in train_loader:
            s_b, h_b, f_b, y_b = s_b.to(device), h_b.to(device), f_b.to(device), y_b.to(device)
            optimizer.zero_grad()
            out = model(s_b, h_b, f_b)
            loss = criterion(out["quantiles"], y_b)
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=2.0)
            optimizer.step()
            train_loss += loss.item() * s_b.size(0)

        scheduler.step()
        train_loss /= len(train_dataset)

        # Validation
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for s_b, h_b, f_b, y_b in val_loader:
                s_b, h_b, f_b, y_b = s_b.to(device), h_b.to(device), f_b.to(device), y_b.to(device)
                out = model(s_b, h_b, f_b)
                loss = criterion(out["quantiles"], y_b)
                val_loss += loss.item() * s_b.size(0)
        val_loss /= len(val_dataset)

        print(f"      Epoch {epoch:02d}/{epochs:02d} | Train Quantile Loss: {train_loss:.2f} | Val Loss: {val_loss:.2f} | LR: {scheduler.get_last_lr()[0]:.6f}")

    total_time = time.time() - t_start
    print(Color.GREEN + f"\n  [SUCCESS] TFT Training Completed in {total_time:.2f}s on {device}!" + Color.ENDC)

    # 7. Model Evaluation Sample
    model.eval()
    with torch.no_grad():
        sample_s = X_static[split_idx:split_idx+1].to(device)
        sample_h = X_hist[split_idx:split_idx+1].to(device)
        sample_f = X_future[split_idx:split_idx+1].to(device)
        sample_pred = model(sample_s, sample_h, sample_f)["quantiles"][0].cpu().numpy() # [7, 4, 3]

    print(Color.CYAN + "\n  [SAMPLE FORECAST] Multi-Horizon 7-Day Quantile Projections for Fuel (Liters):" + Color.ENDC)
    print("      Day | P10 (Optimistic) | P50 (Expected) | P90 (Worst-Case Blizzard Buffer)")
    print("      ----+------------------+----------------+---------------------------------")
    for d in range(7):
        p10, p50, p90 = sample_pred[d, 0, 0], sample_pred[d, 0, 1], sample_pred[d, 0, 2]
        print(f"      D+{d+1}| {p10:14.1f} L | {p50:12.1f} L | {p90:22.1f} L")

    # 8. Export Model Artifact
    artifact_path = os.path.join(MODELS_DIR, "tft_multi_horizon_forecaster.pt")
    torch.save({
        "state_dict": model.state_dict(),
        "hyperparameters": {
            "num_static_features": 3,
            "num_historical_features": 6,
            "num_future_features": 3,
            "num_targets": 4,
            "hidden_dim": 64,
            "n_heads": 4
        },
        "stats": {
            "mean_temp": float(mean_temp), "std_temp": float(std_temp),
            "mean_app": float(mean_app), "std_app": float(std_app),
            "mean_snow": float(mean_snow), "std_snow": float(std_snow),
            "mean_wind": float(mean_wind), "std_wind": float(std_wind)
        },
        "quantiles": [0.10, 0.50, 0.90],
        "device": str(device),
        "trained_epochs": epochs,
        "final_val_loss": round(float(val_loss), 2),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S IST")
    }, artifact_path)

    print(Color.BOLD + Color.GREEN + f"\n  [SAVED] TFT PyTorch Artifact Serialized to: {artifact_path}" + Color.ENDC)
    print(f"          Model Size: {os.path.getsize(artifact_path) / (1024*1024):.2f} MB\n")

if __name__ == "__main__":
    train_tft_pipeline()
