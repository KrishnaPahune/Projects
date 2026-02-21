# Razorpay Payment Integration Setup Guide

## 🎯 Overview
This project now has complete payment integration using **Razorpay** and **FastAPI backend**.

## 📁 New Files Created

### Backend
- `backend/main.py` - FastAPI server with payment endpoints
- `backend/.env` - Backend environment variables

### Frontend
- `src/context/PaymentContext.jsx` - Payment state management
- `src/components/PaymentForm.jsx` - Razorpay payment UI
- `src/components/PaymentForm.css` - Payment form styling
- `.env` - Frontend environment variables

## 🔧 Setup Steps

### Step 1: Get Razorpay Credentials
1. Visit [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Sign up or login
3. Go to Settings → API Keys
4. Copy your **Key ID** and **Key Secret**

### Step 2: Update Backend .env
Edit `backend/.env`:
```env
RAZORPAY_KEY_ID=your_actual_key_id_here
RAZORPAY_KEY_SECRET=your_actual_key_secret_here
```

### Step 3: Update Frontend .env
Edit `.env` (already set up):
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_RAZORPAY_KEY_ID=your_actual_key_id_here
```

### Step 4: Install Frontend Dependencies
```bash
npm install
```

### Step 5: Start Backend Server
```bash
cd backend
python main.py
```
✅ Backend will run on `http://localhost:8000`

### Step 6: Start Frontend (separate terminal)
```bash
npm run dev
```
✅ Frontend will run on `http://localhost:5173`

## 🚀 How Payment Flow Works

1. **User fills shipping form** → Step 1 in Checkout
2. **Clicks "Continue to Payment"** → Goes to Step 2
3. **PaymentForm component appears** → Shows payment options
4. **Clicks "Pay" button** → 
   - Frontend calls `PaymentContext.openRazorpayCheckout()`
   - Backend creates Razorpay order (`/api/create-order`)
   - Razorpay modal opens for user to pay
5. **User completes payment** → 
   - Razorpay returns payment details
   - Frontend verifies signature (`/api/verify-payment`)
   - Order is created and saved
   - Redirects to Order Confirmation page

## 📦 API Endpoints

### Create Order
```
POST /api/create-order
Body: {
  userEmail: string,
  shippingData: {name, phone, address, city, pincode},
  items: [{id, name, price, qty, image}],
  total: number
}
Response: {
  status: "success",
  order_id: string,
  amount: number,
  currency: "INR"
}
```

### Verify Payment
```
POST /api/verify-payment
Body: {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}
Response: {
  status: "success",
  message: "Payment verified",
  payment_id: string
}
```

## 🧪 Testing

### Test Razorpay Credentials (Sandbox)
- **Card Numbers** for testing:
  - Visa: `4111 1111 1111 1111`
  - Mastercard: `5555 5555 5555 4444`
- **Expiry**: Any future date
- **CVV**: Any 3 digits

### Test Flow
1. Add products to cart
2. Click checkout
3. Fill shipping address
4. Click "Continue to Payment"
5. Click "Pay" button
6. Use test card numbers above
7. Complete payment
8. Should see confirmation page

## 🐛 Troubleshooting

### CORS Error?
- Make sure backend is running on `http://localhost:8000`
- Frontend should be on `http://localhost:5173`
- Check `.env` files are correct

### "Razorpay is not defined"?
- Ensure Razorpay script loads in `PaymentContext.jsx`
- Check browser console for script loading errors

### Backend Connection Failed?
- Verify `VITE_BACKEND_URL` in `.env`
- Ensure backend is running: `python main.py`

## 📝 Next Steps

1. **Move to Production**:
   - Update Razorpay to Live mode
   - Use live Key ID and Secret
   - Deploy backend (Heroku/Railway/AWS)
   - Update `VITE_BACKEND_URL` to production URL

2. **Add Features**:
   - Email receipts after payment
   - Payment history in Account page
   - Refund management
   - Multiple payment methods (UPI, Wallet)

3. **Security**:
   - Add HTTPS everywhere
   - Implement JWT authentication
   - Add rate limiting on backend
   - Validate all inputs server-side

## 🔗 Resources
- [Razorpay Docs](https://razorpay.com/docs/)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Context API](https://react.dev/reference/react/useContext)
