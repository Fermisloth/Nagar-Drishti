# 20_FUTURE_ROADMAP.md

## 🚀 Future Milestones & Technical Roadmap

This roadmap outlines upcoming features and improvements planned for NagarDrishti.

### Technical Enhancements

#### 1. Multilingual Voice Intake
- Integrate speech-to-text models (e.g., Whisper) to allow citizens to submit grievances via voice messages.
- Translate local languages (e.g., Hindi, Tamil, Kannada) into standard English for AI extraction.

#### 2. Advanced Geospatial Filtering
- Implement geospatial indexing in Qdrant using geo-coordinate payloads.
- Restrict ticket deduplication to physical ward boundaries or set a maximum distance limit (e.g., 500 meters) from existing incidents.

#### 3. Automatic Notifications & Updates
- Integrate notification channels (SMS, WhatsApp, Email) to alert citizens when their complaint is grouped or updated.
- Automatically notify department heads when ticket density boosts an incident's priority level.

#### 4. Model Switching & Fallbacks
- Add a model routing layer to support switching between Gemini, local LLMs (e.g., Llama-3), or other providers based on latency and cost.
- Implement offline processing fallback states for network outages.

---

*This concludes the NagarDrishti Backend Developer Onboarding Handbook.*
