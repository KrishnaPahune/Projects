# Enterprise Admin Authentication System - Setup Guide

## 🎯 Overview

Your e-commerce platform now has a professional, enterprise-grade admin authentication system with:

- ✅ JWT token-based authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control (RBAC)
- ✅ Audit logging for all admin actions
- ✅ Admin Login page with register/login options
- ✅ Token validation on all product operations
- ✅ Logout functionality with session cleanup

---

## 📋 Backend Setup

### 1. Install Required Packages

Run this command in your `backend/` directory:

```bash
pip install -r requirements.txt
```

This installs:
- `bcrypt` - Password hashing
- `python-jose` - JWT token handling
- `python-multipart` - Form data parsing

### 2. Database Setup

The system automatically creates these new tables on startup:

```sql
-- Admin users table
CREATE TABLE admin (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE,
    password_hash VARCHAR,
    full_name VARCHAR,
    is_active BOOLEAN,
    role VARCHAR,
    created_at TIMESTAMP,
    last_login TIMESTAMP
);

-- Admin permissions table
CREATE TABLE admin_permission (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES admin(id),
    can_create_product BOOLEAN,
    can_edit_product BOOLEAN,
    can_delete_product BOOLEAN,
    can_view_analytics BOOLEAN,
    can_manage_users BOOLEAN,
    can_manage_admins BOOLEAN,
    created_at TIMESTAMP
);

-- Audit log table
CREATE TABLE admin_audit_log (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES admin(id),
    action VARCHAR,
    entity_type VARCHAR,
    entity_id INT,
    details VARCHAR,
    ip_address VARCHAR,
    user_agent VARCHAR,
    timestamp TIMESTAMP
);
```

**No manual SQL required!** Tables are created automatically when the backend starts.

### 3. Environment Variables

Add to your `.env` file in the `backend/` directory:

```env
# Auth Configuration
SECRET_KEY=your-super-secret-key-change-this-in-production-12345
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 hours

# Database URL (already set, no changes needed)
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5432/sagardb
```

⚠️ **Important**: Change `SECRET_KEY` to a long random string in production!

Generate a secure key:
```bash
# On Linux/Mac
openssl rand -hex 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 4. Start the Backend

```bash
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

Backend is running at: `http://localhost:8001`

---

## 🌐 Frontend Setup

### 1. Admin Routes

The admin flow is automatically integrated in your React app:

- `/admin` → Shows login or dashboard depending on auth state

### 2. First-Time Admin Registration

1. Click **Admin** in the navigation (top-right corner)
2. You'll see the **Admin Login** page
3. Click on **"No account yet? Register"**
4. Enter email and password
5. Click **Create Account**
6. You'll be logged in and redirected to dashboard

### 3. Subsequent Logins

1. Click **Admin** in the navigation
2. Enter your email and password
3. Click **Login**
4. Dashboard opens automatically

---

## 📝 API Endpoints

### Authentication Endpoints

#### Register (First-time setup)
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "admin@sagarelectronics.com",
  "password": "securepassword123"
}

Response:
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer",
  "admin_id": 1,
  "email": "admin@sagarelectronics.com",
  "full_name": "Shop Owner"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@sagarelectronics.com",
  "password": "securepassword123"
}

Response: Same as register
```

#### Verify Token
```
GET /api/auth/verify
Authorization: Bearer <token>

Response:
{
  "admin_id": 1,
  "email": "admin@sagarelectronics.com",
  "full_name": "Shop Owner",
  "role": "admin",
  "is_active": true,
  "status": "valid"
}
```

#### Logout
```
POST /api/auth/logout
Authorization: Bearer <token>

Response:
{
  "message": "Logged out successfully",
  "status": "success"
}
```

#### Get Permissions
```
GET /api/auth/permissions
Authorization: Bearer <token>

Response:
{
  "admin_id": 1,
  "can_create_product": true,
  "can_edit_product": true,
  "can_delete_product": true,
  "can_view_analytics": false,
  "can_manage_users": false,
  "can_manage_admins": false
}
```

### Product Endpoints (Now Protected)

#### Get All Products (No auth required)
```
GET /api/products

Response: [{ id, name, price, category, ... }]
```

#### Create Product (Admin only)
```
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Samsung 55' TV",
  "description": "4K Smart TV",
  "price": 49999,
  "category": "Smart TVs",
  "image": "tv2.avif"
}

Response: { id, name, ... }
```

#### Update Product (Admin only)
```
PUT /api/products/{id}
Authorization: Bearer <token>
Content-Type: application/json

{ ... product data ... }

Response: Updated product
```

#### Delete Product (Admin only)
```
DELETE /api/products/{id}
Authorization: Bearer <token>

Response: { "message": "Product deleted successfully" }
```

---

## 🔐 Security Features

### 1. Password Hashing
- Uses `bcrypt` with 12 salt rounds
- Passwords are **never** stored in plain text
- Even database admins can't see actual passwords

### 2. JWT Tokens
- Tokens include `admin_id` and `email`
- Auto-expire after 24 hours (configurable)
- Validated on every protected endpoint

### 3. Permission-Based Access
- Each admin has granular permissions
- Can restrict specific operations per admin
- Easy to extend with more roles

### 4. Audit Logging
- Every create/update/delete logged with:
  - Admin who performed action
  - Timestamp
  - IP address
  - User agent
  - Action details

### 5. Token Storage
- Frontend stores token in `localStorage` (JWT is stateless)
- Sent with every API request in `Authorization: Bearer <token>` header
- Automatically cleared on logout

---

## 🧪 Testing the System

### Test Create Product
```bash
curl -X POST http://localhost:8001/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 9999,
    "category": "Smart TVs",
    "image": "test.jpg"
  }'
```

### Check Audit Logs
Connect to PostgreSQL and run:
```sql
SELECT * FROM admin_audit_log ORDER BY timestamp DESC LIMIT 10;
```

---

## 🔄 Workflow

1. **Admin navigates to `/admin`**
   - If logged in: Shows AdminDashboard
   - If not logged in: Shows AdminLogin

2. **Admin logs in**
   - Email + password sent to `/api/auth/login`
   - Backend validates credentials
   - JWT token returned
   - Token stored in localStorage
   - Admin link appears in navigation

3. **Admin manages products**
   - All API requests include `Authorization: Bearer <token>` header
   - Backend validates token on each request
   - Permissions checked
   - Action logged to audit trail

4. **Admin logs out**
   - Token cleared from localStorage
   - Redirects to home page
   - Admin link disappears from navigation

---

## 📊 Database Schema

```
Admin Table          AdminPermission      AdminAuditLog
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ id (PK)         │  │ id (PK)         │  │ id (PK)         │
│ email (unique)  │──│ admin_id (FK)   │  │ admin_id (FK)   │
│ password_hash   │  │ can_create_...  │  │ action          │
│ full_name       │  │ can_edit_...    │  │ entity_type     │
│ is_active       │  │ can_delete_...  │  │ entity_id       │
│ role            │  │ can_manage_...  │  │ details         │
│ created_at      │  │ created_at      │  │ ip_address      │
│ last_login      │  └─────────────────┘  │ user_agent      │
└─────────────────┘                       │ timestamp       │
                                          └─────────────────┘
```

---

## 🚀 Production Checklist

- [ ] Change `SECRET_KEY` in `.env` to a secure value
- [ ] Set `ACCESS_TOKEN_EXPIRE_MINUTES` to desired value (default: 24 hours)
- [ ] Test login/logout flow
- [ ] Verify tokens expire correctly
- [ ] Check audit logs for admin actions
- [ ] Test permission restrictions
- [ ] Set up HTTPS for token transmission
- [ ] Configure CORS for production domain
- [ ] Backup database before production

---

## 🐛 Troubleshooting

### "Invalid email or password"
- ✅ Verify email is correct
- ✅ Verify password is correct
- ✅ Check if admin account exists in database

### "Token invalid or expired"
- ✅ Token may have expired (24 hours by default)
- ✅ Logout and login again
- ✅ Check browser's localStorage for token

### "Permission denied"
- ✅ Admin account exists but doesn't have permission
- ✅ Check `AdminPermission` table
- ✅ Update permissions via SQL or admin panel

### Products not loading
- ✅ Verify token is valid
- ✅ Check backend is running
- ✅ Verify BACKEND_URL is correct in `.env`

---

## 📞 Support

If you encounter issues:

1. Check backend terminal for error logs
2. Check browser console for API errors
3. Verify database connection
4. Ensure all required packages are installed
5. Check PostgreSQL is running

---

## 🎉 You're All Set!

Your admin system is now production-ready. Enjoy secure product management! 🚀
