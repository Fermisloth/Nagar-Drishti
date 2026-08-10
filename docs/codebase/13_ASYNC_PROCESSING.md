# 13_ASYNC_PROCESSING.md

## ⏳ Asynchronous Background Task Processing

Because AI extraction and similarity search operations are computationally expensive and can block requests, NagarDrishti offloads these tasks to background workers.

### Architecture Overview

```
[ FastAPI App ] ──(Publishes Task)──> [ Redis Queue ] ──> [ Celery Workers ]
```

### Component Details

#### 1. Celery Config
- Code Reference: [celery_app.py](file:///d:/Project/NagarDrishti/app/tasks/celery_app.py)
- Connects to Redis (configured via the `REDIS_URL` environment variable) and applies task execution limits:
  ```python
  task_time_limit=300 # 5 minutes max
  ```

#### 2. Worker Task Definitions
- Code Reference: [tasks.py](file:///d:/Project/NagarDrishti/app/workers/tasks.py)
- Runs the task in a background worker process, keeping API response times fast:
  ```python
  @celery_app.task(name="async_process_complaint_task")
  def async_process_complaint_task(complaint_text: str, location: str = None):
      ...
  ```

---

**Proceed** to the next document: [14_REPOSITORIES_PATTERN.md](file:///d:/Project/NagarDrishti/docs/codebase/14_REPOSITORIES_PATTERN.md)
