import uuid
from typing import Tuple
from app.exceptions.base import ValidationException
from app.core.config import settings

# Magic byte signatures for image formats
MAGIC_BYTES = {
    "jpeg": b"\xFF\xD8\xFF",
    "png": b"\x89PNG\r\n\x1a\n",
    "gif": b"GIF8",
    "webp": b"RIFF"
}

def validate_image_file(file_content: bytes, filename: str) -> Tuple[str, str]:
    """
    Validates uploaded image content by checking:
    1. Maximum upload size limit
    2. Header magic bytes signature matching JPEG, PNG, GIF, or WebP.
    
    Returns a tuple of (secure_uuid_filename, detected_extension).
    """
    if len(file_content) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise ValidationException(
            f"File size exceeds maximum permitted limit of {settings.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)}MB."
        )

    detected_ext = None
    for ext, signature in MAGIC_BYTES.items():
        if file_content.startswith(signature):
            detected_ext = ext
            break
            
    if not detected_ext:
        raise ValidationException(
            "Invalid file format. Uploaded file magic bytes do not match JPEG, PNG, GIF, or WebP image formats."
        )

    secure_filename = f"{uuid.uuid4().hex}.{detected_ext}"
    return secure_filename, detected_ext
