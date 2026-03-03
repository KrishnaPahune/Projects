"""
Admin authentication routes for login and token management
"""

from fastapi import APIRouter, Depends, HTTPException, status, Header, Response, Request
from sqlmodel import select
from datetime import datetime, timedelta
from typing import Optional

from .models import (
    Admin,
    AdminLoginRequest,
    AdminLoginResponse,
    AdminPermission,
    AdminAuditLog,
)
from .db import get_session
from .auth import (
    hash_password,
    verify_password,
    create_access_token,
    verify_token,
    extract_token_from_header,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


# ==================== Helper Functions ====================


def get_admin_from_token(request: Request = None, authorization: Optional[str] = Header(None), session=Depends(get_session)) -> Admin:
    """
    Dependency function to get admin from token
    Used in protected endpoints
    """
    # Prefer Authorization header, fall back to access_token cookie
    token = None
    if authorization:
        token = extract_token_from_header(authorization)
    else:
        token = None
        if request:
            token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing auth token",
        )
    payload = verify_token(token)
    admin_id = int(payload.get("sub"))  # Convert string sub to int for DB lookup
    
    admin = session.get(Admin, admin_id)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found",
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is disabled",
        )
    
    return admin


def get_admin_permissions(admin_id: int, session=Depends(get_session)) -> AdminPermission:
    """Get admin permissions from database"""
    statement = select(AdminPermission).where(AdminPermission.admin_id == admin_id)
    permissions = session.exec(statement).first()
    
    if not permissions:
        # Create default permissions if they don't exist
        permissions = AdminPermission(admin_id=admin_id)
        session.add(permissions)
        session.commit()
        session.refresh(permissions)
    
    return permissions


def log_admin_action(
    admin_id: int,
    action: str,
    entity_type: str,
    entity_id: Optional[int] = None,
    details: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    session=None,
):
    """Log admin action to audit trail"""
    try:
        audit_log = AdminAuditLog(
            admin_id=admin_id,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        session.add(audit_log)
        session.commit()
    except Exception as e:
        print(f"Error logging audit: {str(e)}")


# ==================== Auth Routes ====================


@router.post("/register", response_model=AdminLoginResponse)
def register_admin(request: AdminLoginRequest, response: Response, session=Depends(get_session)):
    """
    Register a new admin user (only works if no admin exists)
    This is for initial setup. In production, use a more secure setup process.
    """
    # Check if any admin exists
    statement = select(Admin)
    existing_admins = session.exec(statement).all()
    
    if existing_admins:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin already exists. Use login instead.",
        )
    
    # Check if email already exists
    statement = select(Admin).where(Admin.email == request.email)
    existing_admin = session.exec(statement).first()
    
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )
    
    try:
        # Create new admin
        password_hash = hash_password(request.password)
        new_admin = Admin(
            email=request.email,
            password_hash=password_hash,
            full_name="Shop Owner",
            role="admin",
        )
        session.add(new_admin)
        session.commit()
        session.refresh(new_admin)
        
        # Create permissions for new admin
        permissions = AdminPermission(admin_id=new_admin.id)
        session.add(permissions)
        session.commit()
        
        # Create access token and set as httpOnly cookie
        access_token = create_access_token(
            data={"sub": new_admin.id, "email": new_admin.email}
        )

        # Set cookie (httpOnly) for session - secure flag should be True in production
        response.set_cookie(
            key="access_token", value=access_token, httponly=True, samesite="lax"
        )

        return AdminLoginResponse(
            access_token=access_token,
            token_type="bearer",
            admin_id=new_admin.id,
            email=new_admin.email,
            full_name=new_admin.full_name,
        )
    
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating admin: {str(e)}",
        )


@router.post("/login", response_model=AdminLoginResponse)
def login_admin(request: AdminLoginRequest, response: Response, session=Depends(get_session)):
    """
    Admin login endpoint
    Returns JWT token on successful authentication
    """
    # Find admin by email
    statement = select(Admin).where(Admin.email == request.email)
    admin = session.exec(statement).first()
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is disabled",
        )
    
    # Verify password
    if not verify_password(request.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    # Update last login
    admin.last_login = datetime.utcnow()
    session.add(admin)
    session.commit()
    
    # Create access token and set as httpOnly cookie
    access_token = create_access_token(
        data={"sub": admin.id, "email": admin.email}
    )

    response.set_cookie(key="access_token", value=access_token, httponly=True, samesite="lax")

    return AdminLoginResponse(
        access_token=access_token,
        token_type="bearer",
        admin_id=admin.id,
        email=admin.email,
        full_name=admin.full_name,
    )


@router.post("/logout")
def logout_admin(response: Response, authorization: Optional[str] = Header(None)):
    """
    Logout endpoint
    Clears httpOnly cookie storing JWT
    """
    try:
        token = extract_token_from_header(authorization)
        verify_token(token)

        # Clear cookie with same settings as set_cookie for proper deletion
        response.delete_cookie(
            key="access_token",
            path="/",
            domain=None,
            secure=False,
            httponly=True,
            samesite="lax"
        )

        return {
            "message": "Logged out successfully",
            "status": "success",
        }
    except HTTPException:
        raise


@router.get("/verify")
def verify_admin(request: Request, admin: Admin = Depends(get_admin_from_token)):
    """
    Verify if admin token is still valid
    Returns current admin info
    """
    return {
        "admin_id": admin.id,
        "email": admin.email,
        "full_name": admin.full_name,
        "role": admin.role,
        "is_active": admin.is_active,
        "status": "valid",
    }


@router.get("/permissions")
def get_admin_perms(
    admin: Admin = Depends(get_admin_from_token),
    session=Depends(get_session),
):
    """Get admin permissions"""
    permissions = get_admin_permissions(admin.id, session)
    return {
        "admin_id": admin.id,
        "can_create_product": permissions.can_create_product,
        "can_edit_product": permissions.can_edit_product,
        "can_delete_product": permissions.can_delete_product,
        "can_view_analytics": permissions.can_view_analytics,
        "can_manage_users": permissions.can_manage_users,
        "can_manage_admins": permissions.can_manage_admins,
    }


# ==================== Helper Function for Routes ====================

def check_admin_permission(admin: Admin, session: object, permission_name: str) -> bool:
    """Check if admin has specific permission"""
    permissions = get_admin_permissions(admin.id, session)
    
    permission_map = {
        "can_create_product": permissions.can_create_product,
        "can_edit_product": permissions.can_edit_product,
        "can_delete_product": permissions.can_delete_product,
        "can_view_analytics": permissions.can_view_analytics,
        "can_manage_users": permissions.can_manage_users,
        "can_manage_admins": permissions.can_manage_admins,
    }
    
    return permission_map.get(permission_name, False)
