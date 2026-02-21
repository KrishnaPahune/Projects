import { useState } from "react";
import { usePayment } from "../context/PaymentContext";
import "./PaymentForm.css";

function PaymentForm({ orderData, onPaymentSuccess, onPaymentError }) {
  const { openRazorpayCheckout, isProcessing, paymentError } = usePayment();
  const [selectedMethod, setSelectedMethod] = useState("razorpay");

  const handlePaymentClick = async () => {
    console.log("=== DEBUG: Order data being sent ===");
    console.log(JSON.stringify(orderData, null, 2));
    console.log("====================================");
    
    try {
      await openRazorpayCheckout(
        orderData,
        (response) => {
          console.log("Payment successful:", response);
          onPaymentSuccess(response);
        },
        (error) => {
          console.error("Payment failed:", typeof error === 'string' ? error : JSON.stringify(error));
          onPaymentError(error);
        }
      );
    } catch (error) {
      console.error("Payment error:", error);
      onPaymentError(error.message);
    }
  };

  return (
    <div className="payment-form-container">
      <h2>Select Payment Method</h2>

      <div className="payment-options-grid">
        <label className={`payment-option-card ${selectedMethod === "razorpay" ? "selected" : ""}`}>
          <input
            type="radio"
            name="payment-method"
            value="razorpay"
            checked={selectedMethod === "razorpay"}
            onChange={(e) => setSelectedMethod(e.target.value)}
          />
          <div className="option-content">
            <span className="payment-icon">💳</span>
            <p className="payment-title">Credit/Debit Card</p>
            <p className="payment-desc">Visa, Mastercard, UPI, Wallet & more</p>
          </div>
        </label>
      </div>

      {paymentError && (
        <div className="payment-error-message">
          <span className="error-icon">⚠️</span>
          <p>{paymentError}</p>
        </div>
      )}

      <div className="payment-security-info">
        <p>🔒 Your payment is secure and encrypted</p>
        <p>Powered by Razorpay</p>
      </div>

      <button
        className="payment-btn"
        onClick={handlePaymentClick}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : `Pay ₹${orderData.total.toLocaleString("en-IN")}`}
      </button>
    </div>
  );
}

export default PaymentForm;