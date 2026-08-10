from typing import Generic, TypeVar, Type, List, Optional, Any, Tuple, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, update, delete
from app.core.database import Base
from app.exceptions.base import RepositoryException
import logging

logger = logging.getLogger("nagardrishti")
ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], db: AsyncSession):
        self.model = model
        self.db = db

    async def create(self, obj_in: ModelType) -> ModelType:
        """Create a new record in the database."""
        try:
            self.db.add(obj_in)
            await self.db.flush()
            return obj_in
        except Exception as e:
            model_name = getattr(self.model, "__name__", getattr(self.model.__class__, "__name__", "Model"))
            logger.error(f"Error during create operation on {model_name}: {e}")
            raise RepositoryException(f"Create failed for {model_name}", e)

    async def get_by_id(self, id: Any) -> Optional[ModelType]:
        """Fetch a record by its primary key ID."""
        try:
            result = await self.db.execute(select(self.model).filter(self.model.id == id))
            obj = result.scalars().first()
            # If the model supports soft deletes, exclude if soft deleted
            if obj and hasattr(obj, "is_deleted") and getattr(obj, "is_deleted") is True:
                return None
            return obj
        except Exception as e:
            model_name = getattr(self.model, "__name__", getattr(self.model.__class__, "__name__", "Model"))
            logger.error(f"Error during get_by_id on {model_name}: {e}")
            raise RepositoryException(f"Retrieve by ID failed for {model_name}", e)

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Retrieve all active records (not soft-deleted)."""
        try:
            query = select(self.model)
            if hasattr(self.model, "is_deleted"):
                query = query.filter(self.model.is_deleted == False)
            result = await self.db.execute(query.offset(skip).limit(limit))
            return result.scalars().all()
        except Exception as e:
            model_name = getattr(self.model, "__name__", getattr(self.model.__class__, "__name__", "Model"))
            raise RepositoryException(f"Retrieve all failed for {model_name}", e)

    async def exists(self, id: Any) -> bool:
        """Check if a record with the given ID exists."""
        try:
            query = select(func.count()).select_from(self.model).filter(self.model.id == id)
            if hasattr(self.model, "is_deleted"):
                query = query.filter(self.model.is_deleted == False)
            result = await self.db.execute(query)
            return result.scalar() > 0
        except Exception as e:
            model_name = getattr(self.model, "__name__", getattr(self.model.__class__, "__name__", "Model"))
            raise RepositoryException(f"Check existence failed for {model_name}", e)

    async def update(self, db_obj: ModelType, obj_in: dict) -> ModelType:
        """
        Update an existing database object.
        Supports optimistic locking: if the model has a 'version' column, 
        it will verify the version matches before performing the update.
        """
        try:
            # Optimistic Locking Verification
            if hasattr(self.model, "version") and "version" in obj_in:
                current_version = getattr(db_obj, "version")
                if current_version != obj_in["version"]:
                    model_name = getattr(self.model, "__name__", self.model.__class__.__name__)
                    raise RepositoryException(
                        f"Conflict detected. Optimistic lock failed for {model_name}. Expected version {current_version}."
                    )
                # Increment version number
                obj_in["version"] = current_version + 1

            for field, value in obj_in.items():
                setattr(db_obj, field, value)
            self.db.add(db_obj)
            await self.db.flush()
            return db_obj
        except RepositoryException:
            raise
        except Exception as e:
            model_name = getattr(self.model, "__name__", getattr(self.model.__class__, "__name__", "Model"))
            logger.error(f"Error during update on {model_name}: {e}")
            raise RepositoryException(f"Update failed for {model_name}", e)

    async def delete(self, id: Any) -> Optional[ModelType]:
        """Hard delete a record from the database."""
        try:
            obj = await self.get_by_id(id)
            if obj:
                await self.db.delete(obj)
                await self.db.flush()
            return obj
        except Exception as e:
            model_name = getattr(self.model, "__name__", getattr(self.model.__class__, "__name__", "Model"))
            raise RepositoryException(f"Hard delete failed for {model_name}", e)

    async def soft_delete(self, id: Any) -> bool:
        """Soft delete a record by setting 'is_deleted' flag to True (if supported)."""
        try:
            obj = await self.get_by_id(id)
            if obj and hasattr(obj, "is_deleted"):
                setattr(obj, "is_deleted", True)
                self.db.add(obj)
                await self.db.flush()
                return True
            return False
        except Exception as e:
            model_name = getattr(self.model, "__name__", getattr(self.model.__class__, "__name__", "Model"))
            raise RepositoryException(f"Soft delete failed for {model_name}", e)

    async def bulk_insert(self, objs: List[ModelType]) -> List[ModelType]:
        """Insert multiple records concurrently."""
        try:
            self.db.add_all(objs)
            await self.db.flush()
            return objs
        except Exception as e:
            model_name = getattr(self.model, "__name__", getattr(self.model.__class__, "__name__", "Model"))
            logger.error(f"Bulk insert error on {model_name}: {e}")
            raise RepositoryException(f"Bulk insert failed for {model_name}", e)

    async def count(self, **filters) -> int:
        """Count the number of active records matching the filter criteria."""
        try:
            query = select(func.count()).select_from(self.model)
            if hasattr(self.model, "is_deleted"):
                query = query.filter(self.model.is_deleted == False)
            for key, val in filters.items():
                if hasattr(self.model, key):
                    query = query.filter(getattr(self.model, key) == val)
            result = await self.db.execute(query)
            return result.scalar() or 0
        except Exception as e:
            model_name = getattr(self.model, "__name__", getattr(self.model.__class__, "__name__", "Model"))
            raise RepositoryException(f"Count query failed for {model_name}", e)

    async def paginate(self, page: int = 1, page_size: int = 20, **filters) -> Tuple[List[ModelType], int]:
        """Paginated search query returning a tuple of (items list, total count)."""
        try:
            query = select(self.model)
            if hasattr(self.model, "is_deleted"):
                query = query.filter(self.model.is_deleted == False)
                
            for key, val in filters.items():
                if hasattr(self.model, key) and val is not None:
                    query = query.filter(getattr(self.model, key) == val)
            
            # Get total count first
            total_count = await self.count(**filters)
            
            # Apply limit/offset
            skip = (page - 1) * page_size
            result = await self.db.execute(query.offset(skip).limit(page_size))
            items = result.scalars().all()
            
            return items, total_count
        except Exception as e:
            model_name = getattr(self.model, "__name__", getattr(self.model.__class__, "__name__", "Model"))
            raise RepositoryException(f"Pagination query failed for {model_name}", e)

    async def begin_transaction(self):
        """Starts a transaction context."""
        return self.db.begin()

    async def commit(self):
        """Commit the current transaction."""
        await self.db.commit()

    async def rollback(self):
        """Rollback the current transaction."""
        await self.db.rollback()
