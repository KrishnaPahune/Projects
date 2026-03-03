"""
List admin accounts in DB (for debugging)
Usage: python list_admins.py
"""
import os
import sys
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from sqlmodel import Session, select
from backend.db import engine
from backend.models import Admin

with Session(engine) as session:
    admins = session.exec(select(Admin)).all()
    if not admins:
        print('No admins found')
    else:
        for a in admins:
            print(f"id={a.id} email={a.email} full_name={a.full_name} is_active={a.is_active} last_login={a.last_login}")
