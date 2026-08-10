# 01_PROJECT_OVERVIEW.md

## 🏙️ NagarDrishti Project Overview

NagarDrishti (implemented as the **UrbanMind AI** system backend) is an intelligent Cognitive Intelligence Layer built to revolutionize how municipal corporations ingest, analyze, cluster, and prioritize citizen complaints.

### The Problem Space
In standard municipal grievance platforms, the same physical problem (e.g., a ruptured water pipeline on MG Road) is reported by dozens of citizens using completely different vocabularies, languages, and contexts:
- *"Major water pipeline leakage near metro station."*
- *"Water flowing heavily on MG Road."*
- *"MG road side pipeline block and water leakage."*

Traditional keyword-based routing or manual dispatching leads to:
1. **Ticket Inundation:** Hundreds of duplicate tickets cluttering department queues.
2. **Resource Misallocation:** Multiple teams dispatched to investigate the same issue.
3. **Lack of Priority Awareness:** Critical complaints (e.g., sewage leakage near a school) sitting at the same level as low-priority ones.

### The NagarDrishti Solution
NagarDrishti addresses these challenges through a unified database pipeline and smart clustering layer:
1. **Automated AI Schema Extraction:** Normalizes arbitrary multilingual text into structural attributes (issue type, department, priority, location, and clean summary) using Gemini 1.5 Flash.
2. **Semantic Similarity Clustering:** Converts complaint texts into 768-dimensional vector profiles and utilizes Qdrant vector database search to locate matching complaints nearby.
3. **Deduplication Engine:** Evaluates candidate incidents dynamically based on composite distance scoring, merging complaints into a single **Master Incident** or initiating a new one.
4. **Hard Security Boundaries:** Restricts access via role-based access control (RBAC), HSTS middleware, client rate-limiting, and stored XSS sanitization.

---

**Proceed** to the next document: [02_ARCHITECTURE.md](file:///d:/Project/NagarDrishti/docs/codebase/02_ARCHITECTURE.md)
