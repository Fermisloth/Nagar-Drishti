# 12_IMAGE_VALIDATION.md

## 🖼️ Image Upload Validation

To secure image uploads and prevent malicious files (e.g., shell scripts disguised as images) from entering the system, NagarDrishti implements byte-level image validation.

### Validation Engine
- Code Reference: [image_validator.py](file:///d:/Project/NagarDrishti/app/utils/image_validator.py)
- Performs the following validation steps:

#### 1. Size Constraints
Checks the file size against the configured limit (`MAX_UPLOAD_SIZE_BYTES`, default: 5MB). Files exceeding this limit are rejected.

#### 2. Signature Validation (Magic Bytes)
Instead of relying on the file extension or MIME type (which can be easily spoofed), the system inspects the file's header bytes to confirm its format:

```python
MAGIC_BYTES = {
    "jpeg": b"\xFF\xD8\xFF",
    "png": b"\x89PNG\r\n\x1a\n",
    "gif": b"GIF8",
    "webp": b"RIFF"
}
```

Files that do not match these signatures are rejected with a `ValidationException`.

#### 3. Secure Renaming
To prevent directory traversal attacks, files are renamed to a unique UUID string combined with the validated format extension (e.g., `8e3b97cd9f4a4d2c88c11fb8e61258ef.png`).

---

**Proceed** to the next document: [13_ASYNC_PROCESSING.md](file:///d:/Project/NagarDrishti/docs/codebase/13_ASYNC_PROCESSING.md)
