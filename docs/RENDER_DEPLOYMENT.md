# Render Deployment Guide - RASAD-AI

This document outlines the zero-downtime production deployment workflow for **RASAD-AI** on [Render](https://render.com).

---

## 1. Architecture On Render

RASAD-AI is deployed using a decoupled microservices architecture:
1. **Backend Web Service (`rasad-ai-api`)**:
   - Runtime: Python 3.10
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --app-dir backend`
   - Healthcheck: `/api/v1/health`
2. **Frontend Static Site (`rasad-ai-web`)**:
   - Runtime: Static Site
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Rewrite Rule: `/*` -> `/index.html` (SPA routing)

---

## 2. Automated CI/CD Deploy Hook

Whenever new changes pass automated verification on the `main` branch, GitHub Actions triggers the Render Deploy Hook:

```yaml
- name: Trigger Render Deployment
  run: |
    curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK_URL }}"
```

### Setup in GitHub Repository Secrets:
1. Go to **Settings > Secrets and variables > Actions** in your GitHub repo.
2. Add `RENDER_DEPLOY_HOOK_URL` containing your private webhook URL from Render.
