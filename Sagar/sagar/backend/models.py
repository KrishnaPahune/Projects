from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Product(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    price: float
    image: Optional[str] = None
    category: Optional[str] = None
    stock: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)


# ==================== Admin Authentication Models ====================

class Admin(SQLModel, table=True):
    """Admin user model for authentication"""
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    password_hash: str  # Will store bcrypt hashed password
    full_name: str
    is_active: bool = True
    role: str = "admin"  # 'admin', 'moderator', 'vendor'
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None


class AdminPermission(SQLModel, table=True):
    """Granular permissions for admin users"""
    id: Optional[int] = Field(default=None, primary_key=True)
    admin_id: int = Field(foreign_key="admin.id")
    can_create_product: bool = True
    can_edit_product: bool = True
    can_delete_product: bool = True
    can_view_analytics: bool = False
    can_manage_users: bool = False
    can_manage_admins: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AdminAuditLog(SQLModel, table=True):
    """Audit trail for all admin actions"""
    id: Optional[int] = Field(default=None, primary_key=True)
    admin_id: int = Field(foreign_key="admin.id")
    action: str  # 'create_product', 'update_product', 'delete_product'
    entity_type: str  # 'product'
    entity_id: Optional[int] = None
    details: Optional[str] = None  # JSON string with additional info
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)


# ==================== Request/Response Models ====================

class AdminLoginRequest(SQLModel):
    """Request model for admin login"""
    email: str
    password: str


class AdminLoginResponse(SQLModel):
    """Response model for admin login"""
    access_token: str
    token_type: str
    admin_id: int
    email: str
    full_name: str
