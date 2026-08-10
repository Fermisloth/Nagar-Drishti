"""
alembic/env.py — Async-compatible Alembic environment for NagarDrishti.

Supports both:
- Offline mode (generates SQL without a live DB connection)
- Online mode  (applies migrations against a live async PostgreSQL database)

All SQLAlchemy models must be imported so that Base.metadata is populated
before autogenerate runs.
"""
import asyncio
from logging.config import fileConfig
from typing import Optional

from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import async_engine_from_config

from alembic import context

# ── Load NagarDrishti settings & Base metadata ─────────────────────────────
# These imports must happen BEFORE any alembic configuration, so that
# Base.metadata is populated with all table definitions.

from app.core.config import settings  # noqa: E402
from app.core.database import Base     # noqa: E402

# Import ALL models so they register with Base.metadata
import app.models  # noqa: E402, F401 — side-effect import: registers Incident, Complaint, User

# ── Alembic Config object ───────────────────────────────────────────────────
config = context.config

# Inject the runtime database URL (from .env via Pydantic settings) so we
# don't need to hard-code credentials in alembic.ini.
config.set_main_option("sqlalchemy.url", settings.ASYNC_DATABASE_URI)

# Interpret the config file for Python logging setup.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata for autogenerate support
target_metadata = Base.metadata


# ── Offline mode ────────────────────────────────────────────────────────────

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode (generates SQL without a connection)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


# ── Online / Async mode ─────────────────────────────────────────────────────

def do_run_migrations(connection: Connection) -> None:
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


async def run_async_migrations() -> None:
    """Run migrations against a live async PostgreSQL connection."""
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    await connectable.dispose()


def run_migrations_online() -> None:
    """Entry point for online mode: runs the async migration coroutine."""
    asyncio.run(run_async_migrations())


# ── Dispatch ────────────────────────────────────────────────────────────────

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
