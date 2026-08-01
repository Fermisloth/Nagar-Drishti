import re

# Regex matching any HTML tags (e.g. <script>, <div>)
HTML_TAG_RE = re.compile(r"<[^>]*>")

def sanitize_input_text(text: str) -> str:
    """
    Remove all HTML tags from the input string to mitigate stored XSS risks.
    """
    if not text:
        return ""
    # Strip HTML tags
    cleaned = HTML_TAG_RE.sub("", text)
    # Escape simple HTML meta-characters
    cleaned = (
        cleaned.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#x27;")
    )
    return cleaned.strip()
