# UrbanMind AI 🏙️

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-red?style=for-the-badge)](https://qdrant.tech)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)
[![Security](https://img.shields.io/badge/Security-Hardened-green?style=for-the-badge)](#security-layer)

UrbanMind AI is a smart **Cognitive Intelligence Layer** designed to optimize how municipal corporations handle citizen complaints. By understanding what complaints mean (rather than just matching words) and grouping duplicates, it helps city officers react faster and work smarter.

---

## 🌟 Simple Explanation (For Non-Technical Readers)

### The Problem
When citizens report issues in a city (like a broken pipe or a pothole), many people report the exact same problem using different words, in different languages. A city officer gets flooded with hundreds of separate tickets for the same physical pothole. Sorting through them manually takes days, stalling repairs.

### The Solution: UrbanMind AI
UrbanMind AI acts as a **smart assistant** that listens to citizens, translates and extracts key details automatically, and cleans up the mess:
1. **Reads complaints in any language:** (e.g. Hindi, English, Tamil) and understands the core issue.
2. **Recognizes duplicates:** If 20 people complain about the same water leak, it links all of them to **one master incident file**.
3. **Prioritizes automatically:** It flags urgent issues (like sewage flooding near a hospital) and notifies the right department immediately.
4. **Protects itself:** It blocks malicious activity and ensures only authorized officers can view private city data.

---

## 🛠️ Architecture & Tech Stack (For Experts)

UrbanMind AI separates business logic, AI operations, and database infrastructure to maintain scalability and maintainability.

```
                  ┌──────────────────────┐
                  │   Citizen Portal     │
                  └──────────┬───────────┘
                             │ (Complaints Input)
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │                   FastAPI Backend                      │
 │                                                        │
 │ ┌──────────────────┐             ┌───────────────────┐ │
 │ │ Security Headers │             │ Rate Limiter (IP) │ │
 │ └─────────┬────────┘             └─────────┬─────────┘ │
 │           └─────────────────┬──────────────┘           │
 │                             ▼                          │
 │                       API Endpoints                    │
 │            (Validated via schemas/ Pydantic)           │
 │                             │                          │
 │                             ▼                          │
 │                    Business Services                   │
 │                             │                          │
 │          ┌──────────────────┼──────────────────┐       │
 │          ▼                  ▼                  ▼       │
 │   ┌──────────────┐   ┌──────────────┐   ┌────────────┐ │
 │   │ Gemini LLM   │   │  Embedding   │   │  Incident  │ │
 │   │ (Extraction) │   │ (text-emb-04)│   │ Clustering │ │
 │   └──────────────┘   └──────────────┘   └──────┬─────┘ │
 └─────────────────────────────┬──────────────────┼───────┘
                               │                  │
                               ▼                  ▼
                       ┌──────────────┐   ┌──────────────┐
                       │ PostgreSQL   │   │  Qdrant DB   │
                       │ (Relational) │   │ (Vector Sim) │
                       └──────────────┘   └──────────────┘
```

### 1. Unified 10-Stage AI Pipeline
* **Ingestion:** Raw text or speech inputs are received.
* **Translation & Extraction:** Using **Gemini 1.5 Flash** with custom JSON schema prompt constraints to extract structured attributes: `issue`, `department`, `location`, `priority`, and `summary`.
* **Semantic Vector Embedding:** Text is converted to a 768-dimensional vector using Google's **`text-embedding-004`** model.
* **Vector Similarity Database:** Embeddings are cross-referenced in **Qdrant** using Cosine similarity.
* **Deduplication Engine:** If a new complaint shares high vector similarity (>= 0.82) with an existing incident in proximity, it is automatically grouped. If not, a new `Incident` is generated.
* **Persistence:** Complaints are bound via foreign keys to Incidents and persisted in **PostgreSQL**.

### 2. Database Models (`SQLAlchemy`)
* **`Complaint` (`complaints` table):** Tracks citizen inputs, raw text, image references, and extracted metadata JSON. Linked via a foreign key relation to an `Incident`.
* **`Incident` (`incidents` table):** Represents a master cluster containing summary, department routing classification, consolidated priority, location, and references to all child complaints.

---

## 🔒 Security Architecture

UrbanMind AI is hardened with multiple layers of defense-in-depth measures to protect system endpoints and data:

1. **Security Headers Middleware ([security.py](file:///d:/Project/NagarDrishti/app/middleware/security.py)):**
   - **Clickjacking Protection:** Injects `X-Frame-Options: DENY` preventing unauthorized sites from embedding the platform in iframe tags.
   - **XSS Mitigation:** Configures strict `Content-Security-Policy` and `X-XSS-Protection` to block inline script injection and malicious external resources.
   - **MIME Sniffing Prevention:** Injects `X-Content-Type-Options: nosniff`.
   - **Transport Security:** Forces HSTS (`Strict-Transport-Security`).

2. **Rate Limiting Middleware ([rate_limit.py](file:///d:/Project/NagarDrishti/app/middleware/rate_limit.py)):**
   - Implements an IP-based sliding-window rate limiter.
   - Restricts clients to a configurable limit (default: **100 requests per 60 seconds**) preventing brute-force attacks and denial-of-service attempts.

3. **API Key Authentication ([auth.py](file:///d:/Project/NagarDrishti/app/dependencies/auth.py)):**
   - Standard citizen submission endpoints remain public.
   - Administrative dashboards and officer endpoints (e.g. retrieving incidents/analytics) are locked behind key verification via custom `X-API-Key` headers matching `OFFICER_API_KEY` defined securely in `.env`.

---

## 💬 Interview Preparation (Expert Q&A)

If asked about the details of this implementation in a technical review, use these points to defend the architecture:

<details>
<summary><b>Q1: Why did you split database persistence between PostgreSQL and Qdrant?</b></summary>
<blockquote>
We use <b>PostgreSQL</b> as our relational source of truth because it guarantees transactional consistency (ACID), handles referential integrity (e.g. cascading updates from Incidents to raw Complaints), and allows complex SQL joins for analytics. We use <b>Qdrant</b> strictly for high-dimensional vector search, index clustering, and spatial querying. Storing heavy vector profiles inside Postgres (even with pgvector) increases memory overhead and locks up relational databases under high load.
</blockquote>
</details>

<details>
<summary><b>Q2: How does the deduplication threshold work? What if two similar issues occur in different wards?</b></summary>
<blockquote>
Similarity search is not solely global. When querying Qdrant, we retrieve similar complaint records using cosine distance matching against the new complaint's text embedding. We then filter results by geographical coordinates or Ward location metadata. A complaint is only merged into an incident if both the <b>semantic score is above the threshold (0.82)</b> and the <b>locations match</b>, preventing tickets in opposite sides of the city from merging incorrectly.
</blockquote>
</details>

<details>
<summary><b>Q3: Why use custom FastAPI middlewares instead of Nginx or external reverse proxy controls?</b></summary>
<blockquote>
Implementing security headers and rate limiting at the application middleware level guarantees safety out-of-the-box in developer environments and cloud containers without requiring specialized proxy settings. It makes our containerized app <b>portable</b>. In production environments, these can be complemented by cloud load balancers or Cloudflare, acting as defense-in-depth layers.
</blockquote>
</details>

<details>
<summary><b>Q4: How does the Gemini extraction schema validation prevent malformed LLM responses?</b></summary>
<blockquote>
We pass our Pydantic validation schema definitions directly to the Gemini API prompts. Additionally, the backend service uses Pydantic <code>TypeAdapter.validate_json()</code> on the response string. If the response contains markdown backticks or missing properties, our parser cleans the text and validates structure. If validation fails, it defaults to routing the raw complain text to a manual review queue, preserving reliability.
</blockquote>
</details>
