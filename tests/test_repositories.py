import pytest
from unittest.mock import AsyncMock, MagicMock
from app.repositories.base import BaseRepository
from app.exceptions.base import RepositoryException

@pytest.mark.asyncio
async def test_base_repository_optimistic_locking_conflict():
    db_mock = AsyncMock()
    model_mock = MagicMock()
    model_mock.version = 1
    
    repo = BaseRepository(model_mock, db_mock)
    
    # Try updating with outdated version (expected current version 1)
    db_obj = MagicMock()
    db_obj.version = 1
    
    update_data = {"title": "Updated Title", "version": 0}  # Conflict!
    
    with pytest.raises(RepositoryException) as exc_info:
        await repo.update(db_obj, update_data)
        
    assert "Optimistic lock failed" in str(exc_info.value)
