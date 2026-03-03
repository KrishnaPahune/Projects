"""
Utility script to reset an admin's password from the project root.
Usage: python reset_admin_password.py admin@example.com NewPassword123

This will use the project's database URL and hashing utilities.
"""
import sys
import os

# Ensure project root is importable (add parent directory of `backend`)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from sqlmodel import Session, select
from backend.db import engine, get_session
from backend.models import Admin
from backend.auth import hash_password


def reset_password(email: str, new_password: str) -> None:
    with Session(engine) as session:
        stmt = select(Admin).where(Admin.email == email)
        admin = session.exec(stmt).first()
        if not admin:
            print(f"No admin found with email: {email}")
            return
        admin.password_hash = hash_password(new_password)
        session.add(admin)
        session.commit()
        print(f"Password for {email} updated successfully.")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python reset_admin_password.py <email> <new_password>")
        sys.exit(1)
    email = sys.argv[1]
    new_password = sys.argv[2]
    reset_password(email, new_password)
