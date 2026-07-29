# UrbanMind AI ????

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Qdrant](https://img.shields.io/badge/Qdrant-Vector_DB-red?style=for-the-badge)
![Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

> **An AI-Powered Urban Grievance Intelligence Platform**  
> An intelligence layer that transforms fragmented citizen complaints into actionable urban knowledge�enabling faster municipal decisions, better governance, and smarter cities.

---

## ?? Overview

India�s cities generate millions of citizen grievances every year across platforms like CPGRAMS and state municipal portals. Existing systems focus on **complaint management** (tickets and status tracking), but lack **semantic understanding and duplicate clustering**. 

**UrbanMind AI** acts as a non-disruptive **Cognitive Intelligence Layer** that sits on top of existing government infrastructure to understand citizen intent, route issues accurately, group duplicates, and deliver actionable briefings to officers.

---

## ?? Key Features

* ?? **Multilingual AI Structuring:** Parses raw text or voice inputs in 20+ Indian languages using **Whisper** and **Gemini 1.5 Flash** to extract categories, locations, and urgency scores.
* ?? **Vector Duplicate Clustering:** Embeds complaint descriptions into 768-dimensional vector space via **Gemini `text-embedding-004`** and local **Qdrant** to group dozens of redundant reports into single actionable incidents.
* ?? **Officer Copilot:** Replaces hundreds of raw individual reports with a single structured AI intelligence brief containing suggested actions and routing confidence scores.
* ?? **Urban Knowledge Graph:** Connects complaints to specific infrastructure assets, contractors, ward budgets, and maintenance histories using **Neo4j**.
* ?? **Predictive SLA Analytics:** Identifies high-risk complaints likely to breach resolution deadlines before failure occurs.

---

## ??? 10-Stage AI Pipeline Architecture

```mermaid
flowchart TD
    A["1. Citizen Input (Voice / Text)"] --> B["2. Language Detection & Whisper STT"]
    B --> C["3. Gemini LLM Semantic Parsing"]
    C --> D["4. OpenStreetMap Geo Coordinate Extraction"]
    D --> E["5. Qdrant Vector DB Duplicate Clustering"]
    E --> F["6. Priority & SLA Risk Prediction"]
    F --> G["7. Department Routing + Confidence Score"]
    G --> H["8. Officer Copilot Briefing"]
    G --> I["9. Neo4j Urban Knowledge Graph"]
    I --> J["10. Actionable Decision Dashboard"]
