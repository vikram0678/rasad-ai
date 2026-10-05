@echo off
echo ====================================================================
echo   [RASAD-AI] INITIALIZING TACTICAL DEFENSE AI TRAINING PIPELINE
echo ====================================================================
cd /d "%~dp0\.."
if exist ".venv\Scripts\python.exe" (
    ".venv\Scripts\python.exe" scripts\train_pipeline.py
) else (
    python scripts\train_pipeline.py
)
pause
