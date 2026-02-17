import { useCart } from "../context/CartContext";
import "./Checkout.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";

function Checkout({ goBack, goToLogin, goToConfirmation }) {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("card");
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
    setLoading(true);
    setTimeout(() => {
      // Create order object
      const orderData = {
        userEmail: user.email,
        shippingData: formData,
        items: cartItems,
        paymentMethod: paymentMethod,
        total: cartTotal,
      };

      // Save order to context
      createOrder(orderData);

      // Clear cart
      clearCart();

      // Navigate to confirmation
      setLoading(false);
      goToConfirmation();
    }, 1500);
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
              <h2>Payment Method</h2>
              <p className="form-subtitle">Choose how you'd like to pay</p>

              <div className="payment-options">
                <label
                  className={`payment-option ${paymentMethod === "card" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">💳</span>
                  <div>
                    <p className="payment-title">Credit/Debit Card</p>
                    <p className="payment-desc">Visa, Mastercard, Amex</p>
                  </div>
                </label>

                <label
                  className={`payment-option ${paymentMethod === "upi" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">📱</span>
                  <div>
                    <p className="payment-title">UPI</p>
                    <p className="payment-desc">Google Pay, PhonePe, Paytm</p>
                  </div>
                </label>

                <label
                  className={`payment-option ${paymentMethod === "wallet" ? "selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="payment-icon">🏦</span>
                  <div>
                    <p className="payment-title">Wallet</p>
                    <p className="payment-desc">Amazon Pay, Apple Pay</p>
                  </div>
                </label>
              </div>

              <div className="terms-section">
                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                  />
                  <span>I agree to Terms & Conditions and Privacy Policy</span>
                </label>
              </div>

              <button
                className="place-order-btn"
                onClick={placeOrder}
                disabled={loading || !agreedToTerms}
              >
                {loading ? "Processing..." : "Complete Order"}
              </button>

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
