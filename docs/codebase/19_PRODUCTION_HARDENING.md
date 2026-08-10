# 19_PRODUCTION_HARDENING.md

## 🛡️ Production Hardening & Deployment Checklist

Before deploying NagarDrishti to production, ensure the following configurations are applied to protect the system.

### Production Security Checklist

- **Disable Debug Mode:** Set `ENV=production` and ensure FastAPI `debug=False` is set to prevent stack traces from being exposed in API responses.
- **Rotate Secrets:** Update all secret keys in the environment configuration:
  - `JWT_SECRET_KEY`
  - `JWT_REFRESH_SECRET_KEY`
  - `OFFICER_API_KEY`
- **Enable SSL/TLS:** Ensure all traffic is routed through HTTPS. The HSTS middleware (`Strict-Transport-Security`) is enabled by default to enforce secure connections.
- **Set CORS Origins:** Update `CORS_ORIGINS` in `.env` to restrict requests to your domain instead of allowing all origins (`*`).
- **Configure Database Pooling:** In production, tune pool parameters in [database.py](file:///d:/Project/NagarDrishti/app/core/database.py) to match your load and database size.
- **Scale Vector DB:** Migrate Qdrant from local embedded mode to a standalone clustered container configured with persistence.

---

**Proceed** to the next document: [20_FUTURE_ROADMAP.md](file:///d:/Project/NagarDrishti/docs/codebase/20_FUTURE_ROADMAP.md)
