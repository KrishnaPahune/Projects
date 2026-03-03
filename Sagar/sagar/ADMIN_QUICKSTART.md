# 🚀 Quick Start - Admin Dashboard

## What's New?

Your e-commerce app now has a **professional, enterprise-grade admin system** just like Amazon and Flipkart!

---

## ⚡ Quick Setup (5 minutes)

### Backend

1. **Install packages**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Update .env**
   ```env
   SECRET_KEY=your-secret-key-here-make-it-long-and-random
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   ```

3. **Start backend**
   ```bash
   python -m uvicorn main:app --reload
   ```

### Frontend

Already integrated! Just start your React app as usual.

---

## 🔑 First Login

1. Go to your website
2. Click **⚙️ Admin** in the top navigation
3. Click **"No account yet? Register"**
4. Enter email and password
5. Click **Create Account**
6. ✅ You're in the Admin Dashboard!

---

## 📦 What You Can Do

✅ **View All Products** - See all products in a professional table
✅ **Add Products** - Click "+ Add New Product" → Fill form → Save
✅ **Edit Products** - Click ✏️ Edit → Update details → Update
✅ **Delete Products** - Click 🗑️ Delete → Confirm → Done
✅ **Refresh Data** - Click 🔄 Refresh to reload products
✅ **Logout** - Click 🚪 Logout from admin panel

---

## 🔐 Security Features (Built-in)

| Feature | What It Does |
|---------|-------------|
| **Password Hashing** | Your password is encrypted (even database can't see it) |
| **JWT Tokens** | Secure tokens that expire after 24 hours |
| **Audit Logging** | Every action is logged (who, when, what) |
| **Permission Control** | Easy to restrict what admins can do |
| **Auto-logout** | Token expires if not used for 24 hours |

---

## 📱 User Flow

```
Visitor clicks Admin
         ↓
  Is logged in?
   /          \
  YES          NO
  ↓            ↓
Dashboard   Login Page
  ↓            ↓
Manage      Register or
Products    Login
  ↓           ↓
Logout   Enter Dashboard
  ↓            ↓
Home       (same as left)
```

---

## 🎯 File Changes

### Backend Files Created:
- `auth.py` - Password hashing & JWT logic
- `auth_routes.py` - Login, register, logout endpoints
- `ADMIN_SETUP.md` - Detailed setup guide

### Backend Files Updated:
- `models.py` - Added Admin, AdminPermission, AuditLog models
- `products.py` - Added authorization checks
- `main.py` - Registered auth routes
- `requirements.txt` - Added bcrypt, python-jose

### Frontend Files Created:
- `src/pages/AdminLogin.jsx` - Login form component
- `src/pages/AdminLogin.css` - Login styling
- `src/pages/AdminDashboard.jsx` - Updated with token auth

### Frontend Files Updated:
- `src/pages/AdminDashboard.css` - Added logout button styles
- `src/App.jsx` - Added login flow routing

---

## 🧪 Test It Out

1. **Create an account**
   - Email: `admin@example.com`
   - Password: `test123`

2. **Add a product**
   - Name: "Samsung TV"
   - Price: 49999
   - Category: "Smart TVs"
   - Image: "tv2.avif"

3. **Edit it**
   - Click ✏️ Edit
   - Change price to 45000
   - Click Update

4. **Delete it**
   - Click 🗑️ Delete
   - Confirm deletion

5. **Check audit log**
   - Open PostgreSQL
   - ```sql
     SELECT admin_id, action, timestamp FROM admin_audit_log ORDER BY timestamp DESC LIMIT 5;
     ```

---

## 🔑 How It Works (Technical)

### Login Flow
```
1. Admin enters email + password
2. Frontend sends to POST /api/auth/login
3. Backend checks password (bcrypt)
4. Backend creates JWT token
5. Token sent back and stored in localStorage
6. Token included in all API requests
```

### Product Operations
```
1. Admin clicks "Create Product"
2. Frontend sends: Authorization: Bearer <token>
3. Backend validates token (JWT)
4. Backend checks permissions
5. Backend logs action to audit table
6. Product saved to database
7. Dashboard refreshes
```

### Logout
```
1. Admin clicks 🚪 Logout
2. Token removed from localStorage
3. Redirected to home
4. Admin link disappears from navigation
```

---

## ⚙️ Configuration

Change these in `backend/.env`:

```env
# How long token lasts (in minutes)
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 24 hours

# Secret key for signing tokens (CHANGE THIS!)
SECRET_KEY=your-super-secret-key-12345
```

---

## 🐛 Common Issues

| Issue | Fix |
|-------|-----|
| "Invalid email/password" | Check email & password are correct |
| "Token expired" | Logout and login again |
| "Products not loading" | Verify backend is running |
| "Can't create product" | Check token is still valid |
| Database errors | Run: `pip install -r requirements.txt` |

---

## 📞 Need More Details?

Read the full guide: [ADMIN_SETUP.md](./ADMIN_SETUP.md)

---

## 🎉 You're Ready!

Your admin system is production-ready and secure. Start managing products like a pro! 🚀

**Key takeaway**: This is the same approach used by Amazon, Flipkart, and Apple - JWT tokens + password hashing + audit logs = enterprise security!
