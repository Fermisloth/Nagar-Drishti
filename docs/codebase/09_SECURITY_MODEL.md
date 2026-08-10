# 09_SECURITY_MODEL.md

## 🔒 Hardened Security Architecture

NagarDrishti implements a multi-layered security model to protect system endpoints, administrative features, and database integrity.

### 1. HTTP Security Headers Middleware
- Code Reference: [security.py (Middleware)](file:///d:/Project/NagarDrishti/app/middleware/security.py)
- Appends defense-in-depth headers to every HTTP response:
  - **Clickjacking Protection:** Injects `X-Frame-Options: DENY` preventing unauthorized sites from embedding the application in frames.
  - **MIME Sniffing Mitigation:** Injects `X-Content-Type-Options: nosniff`.
  - **Cross-Site Scripting (XSS):** Injects `X-XSS-Protection: 1; mode=block`.
  - **Content Security Policy (CSP):** Sets strict default script, style, connection, and image sources.
  - **Strict Transport Security (HSTS):** Enforces HTTPS usage.

### 2. Admin & Officer Authorization
- Code Reference: [auth.py (Dependencies)](file:///d:/Project/NagarDrishti/app/dependencies/auth.py)
- Administrative and analytics dashboards are secured by two mechanisms:
  - **API Key Check:** The `verify_api_key` dependency verifies the `X-API-Key` header against `OFFICER_API_KEY` defined in `.env`.
  - **Role-Based Access Control (RBAC):** Parses user claims from JWT payloads and enforces permissions via `require_roles()`.

### 3. Password Hashing (Argon2id)
- Code Reference: [security.py (Core)](file:///d:/Project/NagarDrishti/app/core/security.py)
- NagarDrishti uses Argon2id (via `argon2-cffi`) for hashing, providing strong defense against GPU-based brute-force attacks:
  ```python
  ph = PasswordHasher(
      time_cost=2,
      memory_cost=102400, # 100MB
      parallelism=1,
      hash_len=32,
      salt_len=16,
  )
  ```

### 4. Input Sanitization
- Code Reference: [sanitizer.py](file:///d:/Project/NagarDrishti/app/utils/sanitizer.py)
- Form inputs are sanitized using `sanitize_input_text()` to strip HTML tags and escape characters (e.g., `<`, `>`, `&`, `"`, `'`). This mitigates stored XSS attacks.

---

**Proceed** to the next document: [10_RATE_LIMITING.md](file:///d:/Project/NagarDrishti/docs/codebase/10_RATE_LIMITING.md)
