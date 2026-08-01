import logging
import json
import time
from datetime import datetime

class JsonFormatter(logging.Formatter):
    """Custom logging Formatter that outputs logs in JSON format."""
    def format(self, record: logging.LogRecord) -> str:
        log_data = {
            "timestamp": datetime.utcfromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "func_name": record.funcName,
            "line_number": record.lineno,
        }
        
        # Attach exception trace if present
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        # Attach extra fields passed using `extra={...}`
        if hasattr(record, "extra_fields"):
            log_data.update(record.extra_fields)
            
        return json.dumps(log_data)

def configure_logging(level: str = "INFO"):
    logger = logging.getLogger("urbanmind")
    logger.setLevel(level)
    
    # Avoid duplicate handlers
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JsonFormatter())
        logger.addHandler(handler)
        logger.propagate = False
