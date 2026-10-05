from pathlib import Path
try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseModel as BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RASAD-AI"
    CORPS_NAME: str = "HQ 14 Corps Northern Command (Ladakh Sector)"
    VERSION: str = "2.4.0-DEFENSE"
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    DEBUG: bool = False
    
    # Base Directories
    BASE_DIR: Path = Path(__file__).resolve().parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    MODELS_DIR: Path = BASE_DIR / "saved_models"
    
    # Military Logistics Thresholds
    CRITICAL_DOS_THRESHOLD: float = 4.0   # Days of supply below which alert is triggered
    WARNING_DOS_THRESHOLD: float = 7.0    # Days of supply below which caution is triggered
    MIN_DEPOT_BUFFER_RATIO: float = 0.25  # Origin depot must retain > 25% post-dispatch
    MAX_CONVOY_WEIGHT_KG: float = 32000.0 # Standard 4x Tatra 8x8 convoy maximum

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()

# Ensure model and data dirs exist
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
settings.MODELS_DIR.mkdir(parents=True, exist_ok=True)
