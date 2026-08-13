import asyncio
from app.core.database import AsyncSessionLocal, engine, Base
from app.models.user import User
from app.enums.user_role import UserRole
from app.enums.account_status import AccountStatus
from app.core.security import hash_password, create_access_token
from sqlalchemy.future import select
# Import all models to register them in Base.metadata
import app.models

async def main():
    # Automatically sync tables first (similar to backend main.py lifespan)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("PostgreSQL tables synchronized.")

    async with AsyncSessionLocal() as session:
        # Check if demo user exists
        result = await session.execute(select(User).filter(User.username == "demo_officer"))
        user = result.scalars().first()
        if not user:
            print("Creating demo officer user in database...")
            user = User(
                username="demo_officer",
                email="officer@nagardrishti.gov.in",
                hashed_password=hash_password("officer123"),
                role=UserRole.OFFICER,
                account_status=AccountStatus.ACTIVE,
                is_active=True,
                is_verified=True,
            )
            session.add(user)
            await session.commit()
            await session.refresh(user)
            print(f"Created user with ID: {user.id}")
        else:
            print(f"Demo officer user already exists with ID: {user.id}")

        # Generate Token
        token_data = {"sub": str(user.id), "role": user.role.value}
        token = create_access_token(token_data)
        print("\n=== COPY YOUR DEVELOPER JWT ACCESS TOKEN BELOW ===")
        print(token)
        print("==================================================\n")
    
    # Dispose connection pool to allow script to exit clean
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
