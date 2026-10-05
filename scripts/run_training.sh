#!/usr/bin/env bash
# ==============================================================================
# RASAD-AI: Military AI Pipeline Git Bash Runner
# Target Hardware: NVIDIA RTX GPU (CUDA 12.x Accelerated)
# ==============================================================================

echo -e "\033[1;36m====================================================================\033[0m"
echo -e "\033[1;32m  [RASAD-AI] INITIALIZING TACTICAL DEFENSE AI TRAINING PIPELINE     \033[0m"
echo -e "\033[1;36m====================================================================\033[0m"

# Resolve python interpreter from .venv
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ -f "$PROJECT_ROOT/.venv/Scripts/python.exe" ]; then
    PYTHON_EXEC="$PROJECT_ROOT/.venv/Scripts/python.exe"
elif [ -f "$PROJECT_ROOT/.venv/bin/python" ]; then
    PYTHON_EXEC="$PROJECT_ROOT/.venv/bin/python"
else
    PYTHON_EXEC="python"
fi

echo -e "\033[1;34m[INFO] Using Python: $PYTHON_EXEC\033[0m"
echo -e "\033[1;34m[INFO] Project Root: $PROJECT_ROOT\033[0m"

# Execute GPU Training Pipeline with live streaming output
cd "$PROJECT_ROOT"
"$PYTHON_EXEC" "$PROJECT_ROOT/scripts/train_pipeline.py"

echo -e "\033[1;32m====================================================================\033[0m"
echo -e "\033[1;32m  [SUCCESS] TRAINING COMPLETE! MODELS EXPORTED TO saved_models/     \033[0m"
echo -e "\033[1;32m====================================================================\033[0m"
