# UrbanMind 🏙️⚡

> **AI-Powered Civic Infrastructure Management & Automated Complaint Deduplication System**

UrbanMind is an intelligent backend platform designed to transform how cities handle civic issues—from road potholes and water leakages to sanitation and lighting failures. Powered by **Google Gemini 1.5 Flash**, **Qdrant Vector Database**, and **FastAPI**, UrbanMind automatically structures unstructured citizen feedback, runs vector similarity searches to detect duplicates, and builds priority queues for municipal action.

---

## 🌟 Key Features

* 🧠 **AI Complaint Structuring:** Converts messy, raw citizen text into standardized JSON schemas using **Gemini 1.5 Flash** (categorization, severity scoring, location detection).
* 🔍 **Vector Deduplication Engine:** Uses **Gemini `text-embedding-004`** (768-dim) and local embedded **Qdrant** to flag duplicate complaints in real time via cosine similarity.
* 🚦 **Dynamic Priority Queue:** Ranks issues by urgency, cluster density, and severity to help city authorities focus on critical infrastructure first.
* ⚡ **Async High-Performance Backend:** Built with **FastAPI**, **SQLAlchemy (Async)**, and **`asyncpg`** for low-latency database queries.
* 🗺️ **Geo-spatial Ready:** Structured payload schema ready to feed interactive color-coded density maps.

---

## 🛠️ Tech Stack

| Domain | Technology / Library |
| :--- | :--- |
| **Framework** | [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+) |
| **Relational Database** | [PostgreSQL](https://www.postgresql.org/) + [SQLAlchemy Async](https://www.sqlalchemy.org/) + [`asyncpg`](https://github.com/MagicStack/asyncpg) |
| **Vector Database** | [Qdrant](https://qdrant.tech/) (Embedded Storage Mode) |
| **AI / LLM** | [Google Gemini API](https://ai.google.dev/) (`gemini-1.5-flash` & `text-embedding-004`) |
| **Environment & Package Mgmt** | Conda / `requirements.txt` |
| **Documentation** | Swagger UI / OpenAPI (`/docs`) |

---

flowchart TD
    %% Input Layer
    A[Citizen Input: Voice / Text\n20+ Indian Languages] --> B[Whisper Speech-to-Text & Lang Detect]
    
    %% AI Intelligence Layer
    B --> C[Gemini LLM: Semantic Parsing]
    C --> D[OpenStreetMap: Geo Coordinate Extraction]
    D --> E[Qdrant Vector DB: Duplicate Clustering]
    
    %% Decision & Routing
    E --> F[Priority & SLA Risk Prediction]
    F --> G[Department Routing + Confidence Score]
    
    %% Output & Knowledge Graph
    G --> H[Officer Copilot Briefing]
    G --> I[(Neo4j Urban Knowledge Graph)]
    
    I --> J[Budgets, Contractors, Infrastructure Assets]
    H --> K[Actionable Decision Dashboard]
