# 18_DEVELOPMENT_WORKFLOW.md

## 💻 Onboarding & Local Development Workflow

This guide covers setting up the NagarDrishti development environment and running the application locally.

### Environment Setup

#### 1. Setup Python Virtual Environment
Initialize a virtual environment using Python 3.10+ and install project dependencies:
```bash
python -m venv venv
./venv/Scripts/activate # Windows
source venv/bin/activate # Linux/Mac
pip install -r requirements.txt
```

#### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in the required variables:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_SERVER`
- `POSTGRES_DB`
- `GEMINI_API_KEY` (Get a key from Google AI Studio)

---

### Running the Application

#### 1. Synchronize PostgreSQL Schema
The application automatically creates required database tables on startup. If you are using migrations, run:
```bash
alembic upgrade head
```

#### 2. Launch FastAPI App
Start the local development server:
```bash
uvicorn app.main:app --reload --port 8000
```
- API Docs will be available at `http://localhost:8000/docs`.
- The health check endpoint is at `http://localhost:8000/api/v1/health`.

#### 3. Run Celery Workers (Optional)
To process background tasks, start a Redis server and run:
```bash
celery -A app.tasks.celery_app worker --loglevel=info
```

---

**Proceed** to the next document: [19_PRODUCTION_HARDENING.md](file:///d:/Project/NagarDrishti/docs/codebase/19_PRODUCTION_HARDENING.md)
