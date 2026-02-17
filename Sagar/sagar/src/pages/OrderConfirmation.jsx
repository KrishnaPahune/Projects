import { useOrder } from "../context/OrderContext";
import "./OrderConfirmation.css";

function OrderConfirmation({ goBack, goHome }) {
  const { currentOrder } = useOrder();

  if (!currentOrder) {
    return (
      <div className="order-confirmation-page">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>No Order Found</h2>
          <p>Something went wrong. Please try again.</p>
          <button onClick={goHome} className="btn-home">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const order = currentOrder;
  const deliveryDate = new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000)
    .toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">✓</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>

        {/* Order ID & Status */}
        <div className="order-info-card">
          <div className="info-row">
            <span className="info-label">Order ID</span>
            <span className="info-value">{order.id}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Status</span>
            <span className="status-badge confirmed">{order.status}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Estimated Delivery</span>
            <span className="info-value">{deliveryDate}</span>
          </div>
        </div>

        {/* Shipping Details */}
        <div className="details-section">
          <h3>Shipping Address</h3>
          <div className="address-box">
            <p className="address-name">{order.shippingData.name}</p>
            <p className="address-text">{order.shippingData.address}</p>
            <p className="address-text">
              {order.shippingData.city}, {order.shippingData.pincode}
            </p>
            <p className="address-text">Phone: {order.shippingData.phone}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="details-section">
          <h3>Order Items ({order.items.length})</h3>
          <div className="items-list">
            {order.items.map((item) => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-quantity">Qty: {item.qty}</p>
                </div>
                <div className="item-price">
                  <p>₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{(order.total - 50).toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free-shipping">Free</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="payment-info">
          <p className="payment-method">Payment Method: {order.paymentMethod}</p>
          <p className="payment-note">
            A confirmation email has been sent to {order.userEmail}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="confirmation-actions">
          <button onClick={goHome} className="btn-continue-shopping">
            Continue Shopping
          </button>
          <button onClick={goBack} className="btn-view-orders">
            View My Orders
          </button>
        </div>

        {/* Info Banner */}
        <div className="info-banner">
          <p>
            <strong>Need help?</strong> You can track your order in your account dashboard or contact our support team.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
