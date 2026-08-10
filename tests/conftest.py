"""
conftest.py — Root-level pytest configuration for NagarDrishti.

Ensures the repository root is on sys.path so `import app` resolves
correctly regardless of where pytest is invoked from.
"""
import sys
import os

# Insert the project root (parent of this tests/ directory) at the front of
# sys.path so that `import app` and all `app.*` imports resolve correctly.
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)
