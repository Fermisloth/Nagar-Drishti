# Docker & Local Run Instructions

## Prerequisites
- Install **Docker Desktop** for Windows (https://www.docker.com/products/docker-desktop).
- Ensure Docker CLI is in your system PATH (`docker --version` should work).
- Install **Python 3.11+** and `uvicorn` if you prefer running locally without Docker.

## Using Docker
```bash
# Build and start all services (FastAPI app, PostgreSQL, Qdrant)
cd d:/Project/NagarDrishti
docker compose up --build
```
- The FastAPI app will be available at `http://localhost:8000`.
- PostgreSQL runs on port `5432` and Qdrant on `6333` (both mapped to localhost).

## Running Locally (no Docker)
```powershell
# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- Ensure a PostgreSQL instance is running and the `.env` file contains the correct connection strings.
- Qdrant can be started locally via `docker run -p 6333:6333 qdrant/qdrant` if you don't want full Docker Compose.

## Troubleshooting
- **"docker is not recognized"** – Docker is not installed or not added to PATH. Install Docker Desktop and restart your terminal.
- **Empty Dockerfile / docker-compose.yml** – These have been populated with working configurations.
- **Port conflicts** – Change the host ports in `docker-compose.yml` if 8000/5432/6333 are already in use.

Feel free to modify the files as needed for your environment.
