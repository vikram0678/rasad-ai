@echo off
cd /d "%~dp0\.."
call ".venv\Scripts\python.exe" scripts\run_backend.py
