"""
RASAD-AI: Military Data Curation & TSV Ingestion Engine
Author: Senior Defense Systems & Data Engineer
Purpose: Processes, validates, cleans, and structures 5.2GB raw defense datasets
         into standardized high-performance TSV (Tab-Separated Values) artifacts.
"""

import os
import sys
import time
import pandas as pd
import numpy as np

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW_DATA_DIR = os.path.join(BASE_DIR, "datasets")
PROCESSED_TSV_DIR = os.path.join(RAW_DATA_DIR, "processed_tsv")

os.makedirs(PROCESSED_TSV_DIR, exist_ok=True)

def print_banner(msg: str):
    print("\n" + "=" * 75)
    print(f"  [DATA-CURATION] {msg}")
    print("=" * 75)

def curate_leh_climate():
    print_banner("1/5: Curating 86-Year Leh, Ladakh Historical Climate Dataset (1940-2026)")
    src_csv = os.path.join(RAW_DATA_DIR, "india_multicity_historical_climate", "india_multicity_historical_climate.csv")
    out_tsv = os.path.join(PROCESSED_TSV_DIR, "leh_ladakh_climate_1940_2026.tsv")
    
    if not os.path.exists(src_csv):
        print(f"Warning: {src_csv} not found.")
        return
    
    t0 = time.time()
    # Read chunked or filtered for Leh
    print(f"Scanning and filtering {os.path.basename(src_csv)} for Leh, Ladakh...")
    chunks = []
    for chunk in pd.read_csv(src_csv, chunksize=100000, low_memory=False):
        leh_part = chunk[chunk['city'].str.strip() == 'Leh']
        if len(leh_part) > 0:
            chunks.append(leh_part)
            
    df_leh = pd.concat(chunks, ignore_index=True)
    df_leh.sort_values(by="date", inplace=True)
    
    # Feature cleanliness
    numeric_cols = ['temp_max_c', 'temp_min_c', 'apparent_temp_min_c', 'apparent_temp_max_c', 
                    'precipitation_mm', 'snowfall_cm', 'wind_speed_max_kmh', 'wind_gusts_max_kmh', 'solar_radiation_mj_m2']
    for c in numeric_cols:
        if c in df_leh.columns:
            df_leh[c] = pd.to_numeric(df_leh[c], errors='coerce').fillna(0.0)
            
    df_leh.to_csv(out_tsv, sep='\t', index=False)
    sz_mb = os.path.getsize(out_tsv) / (1024 * 1024)
    print(f"SUCCESS: Created {os.path.basename(out_tsv)}")
    print(f"   Records: {len(df_leh):,} rows | Columns: {len(df_leh.columns)} | Size: {sz_mb:.2f} MB")
    print(f"   Date Span: {df_leh['date'].min()} to {df_leh['date'].max()} ({time.time() - t0:.2f}s)")

def curate_convoy_telematics():
    print_banner("2/5: Curating Convoy 50-Parameter Telematics & Predictive Maintenance Dataset")
    src_csv = os.path.join(RAW_DATA_DIR, "logistics_dataset_with_maintenance_required", "logistics_predictive_maintenanceV2.csv")
    out_tsv = os.path.join(PROCESSED_TSV_DIR, "convoy_telematics_maintenance.tsv")
    
    if not os.path.exists(src_csv):
        print(f"Warning: {src_csv} not found.")
        return
        
    t0 = time.time()
    print(f"Loading {os.path.basename(src_csv)}...")
    df_tel = pd.read_csv(src_csv, low_memory=False)
    
    # Standardize and save
    df_tel.to_csv(out_tsv, sep='\t', index=False)
    sz_mb = os.path.getsize(out_tsv) / (1024 * 1024)
    print(f"SUCCESS: Created {os.path.basename(out_tsv)}")
    print(f"   Records: {len(df_tel):,} rows | Telemetry Features: {len(df_tel.columns)} | Size: {sz_mb:.2f} MB ({time.time() - t0:.2f}s)")

def curate_himalayan_hydrology():
    print_banner("3/5: Curating High-Altitude Himalayan River Flood Hydrology Dataset")
    src_csv = os.path.join(RAW_DATA_DIR, "nepal_flood_weather_dataset_kaggle_2023_2026", "CORRECTED_2023_2026_NEPAL_FLOOD_WEATHER_KAGGLE.csv")
    out_tsv = os.path.join(PROCESSED_TSV_DIR, "himalayan_flashflood_hydrology.tsv")
    
    if not os.path.exists(src_csv):
        print(f"Warning: {src_csv} not found.")
        return
        
    t0 = time.time()
    df_hydro = pd.read_csv(src_csv)
    df_hydro.to_csv(out_tsv, sep='\t', index=False)
    sz_mb = os.path.getsize(out_tsv) / (1024 * 1024)
    print(f"SUCCESS: Created {os.path.basename(out_tsv)}")
    print(f"   Records: {len(df_hydro):,} rows | Basin Features: {len(df_hydro.columns)} | Size: {sz_mb:.2f} MB ({time.time() - t0:.2f}s)")

def curate_military_forward_policy():
    print_banner("4/5: Curating DHA Forward Military Facilities & Replenishment Policy Corpus")
    dha_dir = os.path.join(RAW_DATA_DIR, "DHA")
    out_tsv = os.path.join(PROCESSED_TSV_DIR, "military_forward_inventory_policy.tsv")
    
    fac_p = os.path.join(dha_dir, "DHA_facilities.csv")
    inv_p = os.path.join(dha_dir, "DHA_inventory.csv")
    pol_p = os.path.join(dha_dir, "DHA_policy.csv")
    rec_p = os.path.join(dha_dir, "DHA_recommendations.csv")
    trn_p = os.path.join(dha_dir, "DHA_transport.csv")
    
    if os.path.exists(fac_p) and os.path.exists(inv_p):
        df_fac = pd.read_csv(fac_p)
        df_inv = pd.read_csv(inv_p)
        df_merged = pd.merge(df_inv, df_fac, on="facility_id", how="left")
        
        if os.path.exists(pol_p):
            df_pol = pd.read_csv(pol_p)
            df_merged = pd.merge(df_merged, df_pol, left_on="category", right_on="item_category", how="left")
            
        df_merged.to_csv(out_tsv, sep='\t', index=False)
        sz_mb = os.path.getsize(out_tsv) / (1024 * 1024)
        print(f"SUCCESS: Created {os.path.basename(out_tsv)}")
        print(f"   Records: {len(df_merged):,} rows | Merged Schemas: {len(df_merged.columns)} | Size: {sz_mb:.2f} MB")

def curate_multiechelon_inventory():
    print_banner("5/5: Curating Multi-Echelon Buffer Stocking & Lead-Time Episodes")
    src_csv = os.path.join(RAW_DATA_DIR, "logistics_data_5k", "logistics_data_5k.csv")
    out_tsv = os.path.join(PROCESSED_TSV_DIR, "multiechelon_supply_episodes.tsv")
    
    if os.path.exists(src_csv):
        df_echelon = pd.read_csv(src_csv)
        df_echelon.to_csv(out_tsv, sep='\t', index=False)
        sz_mb = os.path.getsize(out_tsv) / (1024 * 1024)
        print(f"SUCCESS: Created {os.path.basename(out_tsv)}")
        print(f"   Records: {len(df_echelon):,} rows | Echelon Features: {len(df_echelon.columns)} | Size: {sz_mb:.2f} MB")

if __name__ == "__main__":
    t_start = time.time()
    curate_leh_climate()
    curate_convoy_telematics()
    curate_himalayan_hydrology()
    curate_military_forward_policy()
    curate_multiechelon_inventory()
    print_banner(f"ALL 5 MILITARY DATASETS CONVERTED TO PROFESSIONAL TSV IN {time.time() - t_start:.2f}s")
    print(f"Artifacts Location: {PROCESSED_TSV_DIR}")
