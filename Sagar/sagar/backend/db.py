from sqlmodel import SQLModel, create_engine
from typing import Generator
import os

# Read DATABASE_URL from env, fallback to using postgres user
DATABASE_URL = os.getenv("DATABASE_URL") or "postgresql://postgres:krishna%40postgres123@127.0.0.1:5432/sagardb"

# Create sync engine for SQLModel / SQLAlchemy
engine = create_engine(DATABASE_URL, echo=False)

def create_db_and_tables() -> None:
    """Create database tables (idempotent)."""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator:
    """Yield a SQLModel Session for dependency injection."""
    from sqlmodel import Session
    with Session(engine) as session:
        yield session
