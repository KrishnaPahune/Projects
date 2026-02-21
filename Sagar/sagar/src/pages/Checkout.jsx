import { useCart } from "../context/CartContext";
import "./Checkout.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import { usePayment } from "../context/PaymentContext";
import PaymentForm from "../components/PaymentForm";

function Checkout({ goBack, goToLogin, goToConfirmation }) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { openRazorpayCheckout } = usePayment();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const { user } = useAuth();
  const { createOrder } = useOrder();

  if (!user) {
    return (
      <div className="checkout-page">
        <div className="login-required-container">
          <div className="login-required-content">
            <div className="login-icon">🔐</div>
            <h2>Login Required</h2>
            <p>Please log in to your account to proceed with checkout.</p>
            <div className="login-actions">
              <button onClick={goToLogin} className="login-btn-primary">
                Login to Your Account
              </button>
              <button onClick={goBack} className="login-btn-secondary">
                ← Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
      errors.phone = "Invalid phone number";
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.pincode.trim()) errors.pincode = "Pincode is required";
    if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = "Invalid pincode";
    return errors;
  };

  const proceedToPayment = () => {
    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      setFormErrors({});
      setStep(2);
    } else {
      setFormErrors(errors);
    }
  };

  const placeOrder = async () => {
    if (!agreedToTerms) {
      alert("Please agree to terms and conditions");
      return;
    }

    const orderData = {
      userEmail: user.email,
      shippingData: formData,
      items: cartItems,
      paymentMethod: "razorpay",
      total: cartTotal,
    };

    try {
      await openRazorpayCheckout(
        orderData,
        (paymentResponse) => {
          console.log("Payment successful:", paymentResponse);

          // Save order after successful payment
          const finalOrderData = {
            userEmail: user.email,
            shippingData: formData,
            items: cartItems,
            paymentMethod: "razorpay",
            total: cartTotal,
            paymentId: paymentResponse.razorpay_payment_id,
            orderId: paymentResponse.razorpay_order_id,
            status: "Paid",
          };

          createOrder(finalOrderData);
          clearCart();
          goToConfirmation();
        },
        (error) => {
          console.error("Payment failed:", error);
          alert(`Payment failed: ${error}`);
        }
      );
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="checkout-page">
      <button onClick={goBack} className="back-btn">
        ← Back to Cart
      </button>

      {/* STEP INDICATOR */}
      <div className="step-indicator">
        <div className={`step ${step >= 1 ? "active" : ""}`}>
          <div className="step-number">1</div>
          <div className="step-text">Shipping</div>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 2 ? "active" : ""}`}>
          <div className="step-number">2</div>
          <div className="step-text">Payment</div>
        </div>
        <div className="step-line"></div>
        <div className={`step ${step >= 3 ? "active" : ""}`}>
          <div className="step-number">3</div>
          <div className="step-text">Confirm</div>
        </div>
      </div>

      <div className="checkout-container">
        {/* LEFT - FORM */}
        <div className="checkout-form-container">
          {step === 1 && (
            <div className="checkout-form">
              <h2>Shipping Address</h2>
              <p className="form-subtitle">
                Where should we deliver your order?
              </p>

              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className={formErrors.name ? "error" : ""}
                />
                {formErrors.name && (
                  <span className="error-text">{formErrors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className={formErrors.phone ? "error" : ""}
                />
                {formErrors.phone && (
                  <span className="error-text">{formErrors.phone}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address">Address *</label>
                <textarea
                  id="address"
                  name="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={handleChange}
                  className={formErrors.address ? "error" : ""}
                  rows="3"
                />
                {formErrors.address && (
                  <span className="error-text">{formErrors.address}</span>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={handleChange}
                    className={formErrors.city ? "error" : ""}
                  />
                  {formErrors.city && (
                    <span className="error-text">{formErrors.city}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    placeholder="110001"
                    value={formData.pincode}
                    onChange={handleChange}
                    className={formErrors.pincode ? "error" : ""}
                  />
                  {formErrors.pincode && (
                    <span className="error-text">{formErrors.pincode}</span>
                  )}
                </div>
              </div>

              <button className="next-btn" onClick={proceedToPayment}>
                Continue to Payment →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-form">
              <h2>Payment</h2>
              <p className="form-subtitle">Complete your payment securely</p>

              <PaymentForm
                orderData={{
                  userEmail: user.email,
                  shippingData: formData,
                  items: cartItems,
                  total: cartTotal,
                }}
                onPaymentSuccess={(response) => {
                  console.log("Payment successful:", response);
                  const finalOrderData = {
                    userEmail: user.email,
                    shippingData: formData,
                    items: cartItems,
                    paymentMethod: "razorpay",
                    total: cartTotal,
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    status: "Paid",
                  };
                  createOrder(finalOrderData);
                  clearCart();
                  goToConfirmation();
                }}
                onPaymentError={(error) => {
                  console.error("Payment failed:", error);
                  alert(`Payment failed: ${error}`);
                }}
              />

              <button className="back-step-btn" onClick={() => setStep(1)}>
                ← Back to Shipping
              </button>
            </div>
          )}
        </div>

        {/* RIGHT - ORDER SUMMARY */}
        <div className="checkout-summary-container">
          <div className="checkout-summary">
            <h3>Order Summary</h3>

            <div className="summary-items">
              {cartItems.map((item) => (
                <div key={item.id} className="summary-item">
                  <div className="item-details">
                    <p className="item-name">{item.name}</p>
                    <p className="item-qty">Qty: {item.qty}</p>
                  </div>
                  <p className="item-price">
                    ₹ {(item.price * item.qty).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>

            <hr className="divider" />

            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>₹ {cartTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="price-row">
                <span>Shipping</span>
                <span className="free">Free</span>
              </div>
              <div className="price-row">
                <span>Tax</span>
                <span>₹ 0</span>
              </div>
            </div>

            <hr className="divider" />

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹ {cartTotal.toLocaleString("en-IN")}</span>
            </div>

            <div className="security-info">
              <p>🔒 Your payment is secure and encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
