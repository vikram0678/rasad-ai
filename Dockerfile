# -------------------------------------------------------------
# 🇮🇳 RASAD-AI: Military Predictive Logistics Edge Container
# Multi-stage production container for Northern Command Server
# -------------------------------------------------------------
FROM python:3.10-slim-bullseye AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -U pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application source and test harnesses
COPY backend /app/backend
COPY tests /app/tests
COPY run_backend.py /app/

EXPOSE 8000

# Health check probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["python", "run_backend.py"]
