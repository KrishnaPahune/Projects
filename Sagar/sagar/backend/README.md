# Backend Postgres setup

This file explains how to start a local PostgreSQL instance for development and run the FastAPI backend.

Prerequisites
- Docker (recommended) or a local Postgres install
- Python 3.10+

Quick start (Docker)

1. Start Postgres with Docker Compose (project root):

```powershell
docker compose up -d
```

2. Install backend dependencies:

```powershell
python -m pip install -r backend/requirements.txt
```

3. Create a `.env` (copy from `.env.example`) and set your credentials:

```
DATABASE_URL=postgresql://sagar_user:securepassword@localhost:5432/sagardb
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

4. Run the backend:

```powershell
# from project root
uvicorn backend.main:app --reload --port 8000
```

Notes
- On startup the app will run `create_db_and_tables()` and `seed_db()` (see `backend/main.py`).
- Do not commit real secrets — use environment variables or a secrets manager for production.
- For schema migrations consider adding Alembic later.