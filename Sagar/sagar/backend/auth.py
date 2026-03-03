"""
Authentication utilities for admin login and JWT token management
"""

import os
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
from jose import JWTError, jwt
from fastapi import HTTPException, status

# ==================== Configuration ====================

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production-very-long-random-string")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))  # 24 hours default


# ==================== Password Hashing ====================

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def verify_password(plain_password: str, password_hash: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), password_hash.encode('utf-8'))


# ==================== JWT Token Management ====================

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Dictionary containing token claims (admin_id, email, etc)
        expires_delta: Custom expiration time. If None, uses default.
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    # Ensure 'sub' is a string (JWT standard requires string)
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> dict:
    """
    Verify and decode a JWT token
    
    Args:
        token: JWT token string to verify
    
    Returns:
        Decoded token payload (dict)
    
    Raises:
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        admin_id: str = payload.get("sub")  # JWT 'sub' claim is a string
        
        if admin_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return payload
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ==================== Token Extraction ====================

def extract_token_from_header(authorization: Optional[str]) -> str:
    """
    Extract Bearer token from Authorization header
    
    Args:
        authorization: Authorization header value
    
    Returns:
        Token string
    
    Raises:
        HTTPException: If header format is invalid
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    parts = authorization.split()
    
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return parts[1]
