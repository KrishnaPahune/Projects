from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import razorpay
import os
from dotenv import load_dotenv
import uuid
import time

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Razorpay client
RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    raise ValueError("Razorpay credentials not configured in .env file")

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


# Request Models
class OrderItem(BaseModel):
    id: int | str
    name: str
    price: float
    qty: int
    image: str


class ShippingData(BaseModel):
    name: str
    phone: str
    address: str
    city: str
    pincode: str


class CreateOrderRequest(BaseModel):
    userEmail: str
    shippingData: ShippingData
    items: list[OrderItem]
    total: float


class PaymentVerificationRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


# Routes
@app.get("/")
def read_root():
    return {"message": "Sagar Payment Backend Running"}


@app.post("/api/create-order")
def create_order(request: CreateOrderRequest):
    """
    Create a Razorpay order for the given cart items
    """
    try:
        # Razorpay expects amount in paise (multiply by 100)
        amount_in_paise = int(request.total * 100)
        
        # Generate a receipt that's max 40 characters
        # Format: order_TIMESTAMP_RANDOM (e.g., order_1708934567_a1b2)
        timestamp = int(time.time())
        random_suffix = str(uuid.uuid4())[:8].replace('-', '')
        receipt = f"order_{timestamp}_{random_suffix}"[:40]
        
        print(f"Generated receipt: {receipt} (length: {len(receipt)})")
        
        order_data = {
            "amount": amount_in_paise,
            "currency": "INR",
            "receipt": receipt,
            "notes": {
                "user_email": request.userEmail,
                "shipping_address": request.shippingData.address,
                "city": request.shippingData.city,
                "phone": request.shippingData.phone,
            }
        }
        
        order = client.order.create(data=order_data)
        
        return {
            "status": "success",
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
        }
    except Exception as e:
        print(f"Error creating order: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Order creation failed: {str(e)}")


@app.post("/api/verify-payment")
def verify_payment(request: PaymentVerificationRequest):
    """
    Verify the payment signature from Razorpay
    """
    try:
        # Verify signature
        params_dict = {
            "razorpay_order_id": request.razorpay_order_id,
            "razorpay_payment_id": request.razorpay_payment_id,
            "razorpay_signature": request.razorpay_signature,
        }
        
        client.utility.verify_payment_signature(params_dict)
        
        # Payment verified successfully
        return {
            "status": "success",
            "message": "Payment verified",
            "payment_id": request.razorpay_payment_id,
        }
    except razorpay.BadRequestError as e:
        raise HTTPException(status_code=400, detail=f"Payment verification failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification error: {str(e)}")


@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Sagar Payment Service"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)