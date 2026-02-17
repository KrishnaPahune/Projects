import { useState, useEffect } from "react";
import { useOrder } from "../context/OrderContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "./OrderDetail.css";

function OrderDetail({ orderId, goBack, goToCheckout }) {
  const { getOrderById, isLoaded, cancelOrder } = useOrder();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [order, setOrder] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancellationMessage, setCancellationMessage] = useState(null);

  useEffect(() => {
    if (isLoaded && orderId) {
      const foundOrder = getOrderById(orderId);
      setOrder(foundOrder);
    }
  }, [orderId, isLoaded, getOrderById]);

  if (!isLoaded) {
    return (
      <div className="order-detail-page">
        <div className="error-state">
          <div className="error-icon">⏳</div>
          <h2>Loading Order Details...</h2>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h2>Order Not Found</h2>
          <p>We couldn't find this order. (ID: {orderId})</p>
          <button onClick={goBack} className="btn-back">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getStatusTimeline = () => {
    const statuses = [
      { label: "Order Confirmed", date: new Date(order.createdAt) },
      { label: "Processing", date: new Date(new Date(order.createdAt).getTime() + 1 * 24 * 60 * 60 * 1000) },
      { label: "Shipped", date: new Date(new Date(order.createdAt).getTime() + 2 * 24 * 60 * 60 * 1000) },
      { label: "Out for Delivery", date: new Date(new Date(order.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000) },
      { label: "Delivered", date: new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000) },
    ];
    return statuses;
  };

  const getCurrentStatusIndex = () => {
    const now = new Date();
    const orderDate = new Date(order.createdAt);
    const daysElapsed = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
    return Math.min(daysElapsed, 4);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    const receiptContent = `
      SAGAR - ORDER RECEIPT
      =====================
      
      Order ID: ${order.id}
      Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}
      Status: ${order.status}
      
      SHIPPING ADDRESS:
      ${order.shippingData.name}
      ${order.shippingData.address}
      ${order.shippingData.city}, ${order.shippingData.pincode}
      Phone: ${order.shippingData.phone}
      
      ORDER ITEMS:
      ${order.items.map((item) => `${item.name} x${item.qty} - ₹${(item.price * item.qty).toLocaleString("en-IN")}`).join("\n")}
      
      PAYMENT DETAILS:
      Subtotal: ₹${(order.total - 50).toLocaleString("en-IN")}
      Shipping: Free
      Total: ₹${order.total.toLocaleString("en-IN")}
      Payment Method: ${order.paymentMethod}
      
      Thank you for your order!
    `;
    
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(receiptContent));
    element.setAttribute("download", `receipt-${order.id}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart({ ...item, qty: 1 });
    });
    goToCheckout();
  };

  const handleCancelOrder = () => {
    setIsCancelling(true);
    try {
      // Cancel order in context
      cancelOrder(orderId);
      
      // Update local order state
      setOrder({ ...order, status: "Cancelled" });
      
      // Show success message
      showToast("✅ Order cancelled successfully! Refund will be processed in 5-7 business days.", "success");
      setCancellationMessage("Your order has been cancelled. A refund of ₹" + order.total.toLocaleString("en-IN") + " will be credited to your original payment method.");
      
      setShowCancelConfirm(false);
      setIsCancelling(false);
      
      // Redirect to account after 2 seconds
      setTimeout(() => {
        goBack();
      }, 2000);
    } catch (error) {
      showToast("❌ Failed to cancel order. Please try again.", "error");
      setIsCancelling(false);
    }
  };

  const statusTimeline = getStatusTimeline();
  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="order-detail-page">
      <div className="detail-container">
        {/* Header */}
        <div className="detail-header">
          <button onClick={goBack} className="back-btn-detail">
            ← Back to Orders
          </button>
          <h1>Order Details</h1>
          <div className="header-actions">
            <button onClick={handlePrint} className="action-btn print-btn" title="Print Receipt">
              🖨️ Print
            </button>
            <button onClick={handleDownloadReceipt} className="action-btn download-btn" title="Download Receipt">
              📥 Download
            </button>
          </div>
        </div>

        {/* Order Status Timeline */}
        <div className="status-timeline-section">
          <h3>Order Status</h3>
          <div className="status-timeline">
            {statusTimeline.map((status, index) => (
              <div
                key={index}
                className={`timeline-item ${index <= currentStatusIndex ? "completed" : ""} ${
                  index === currentStatusIndex ? "current" : ""
                }`}
              >
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <p className="timeline-label">{status.label}</p>
                  <p className="timeline-date">
                    {status.date.toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Info Cards */}
        <div className="info-grid">
          {/* Shipping Info */}
          <div className="info-card">
            <h3>📍 Shipping Address</h3>
            <p className="card-content">
              <strong>{order.shippingData.name}</strong>
              <br />
              {order.shippingData.address}
              <br />
              {order.shippingData.city}, {order.shippingData.pincode}
              <br />
              📱 {order.shippingData.phone}
            </p>
          </div>

          {/* Payment Info */}
          <div className="info-card">
            <h3>💳 Payment Details</h3>
            <p className="card-content">
              Payment Method: <strong>{order.paymentMethod.toUpperCase()}</strong>
              <br />
              Status: <strong>Completed</strong>
              <br />
              Order ID: <strong>{order.id}</strong>
              <br />
              Date: <strong>{new Date(order.createdAt).toLocaleDateString("en-IN")}</strong>
            </p>
          </div>

          {/* Delivery Estimate */}
          <div className="info-card">
            <h3>📦 Delivery Estimate</h3>
            <p className="card-content">
              Expected Delivery:
              <br />
              <strong>
                {new Date(new Date(order.createdAt).getTime() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
                  "en-IN",
                  { weekday: "short", year: "numeric", month: "short", day: "numeric" }
                )}
              </strong>
              <br />
              <span className="delivery-note">Typically 3-5 business days</span>
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="items-section">
          <h3>📦 Order Items ({order.items.length})</h3>
          <div className="items-detail-list">
            {order.items.map((item) => (
              <div key={item.id} className="item-detail-row">
                <img src={item.image} alt={item.name} className="item-detail-img" />
                <div className="item-detail-info">
                  <p className="item-detail-name">{item.name}</p>
                  <p className="item-detail-price">₹{item.price.toLocaleString("en-IN")}</p>
                </div>
                <div className="item-detail-qty">
                  <p>Qty: {item.qty}</p>
                </div>
                <div className="item-detail-total">
                  <p>₹{(item.price * item.qty).toLocaleString("en-IN")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price Summary */}
        <div className="price-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{(order.total - 50).toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="free">Free</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount</span>
            <span>₹{order.total.toLocaleString("en-IN")}</span>
          </div>
        </div>

        {/* Cancellation Success Message */}
        {cancellationMessage && (
          <div className="cancellation-message">
            <div className="message-icon">✅</div>
            <div className="message-content">
              <h4>Order Cancelled Successfully</h4>
              <p>{cancellationMessage}</p>
              <p className="redirect-note">Redirecting to your orders in a moment...</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          {order.status !== "Cancelled" && (
            <button onClick={handleReorder} className="btn-reorder">
              🔄 Reorder
            </button>
          )}
          {order.status !== "Cancelled" && getCurrentStatusIndex() < 2 && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="btn-cancel"
              disabled={isCancelling}
            >
              {isCancelling ? "⏳ Cancelling..." : "❌ Cancel Order"}
            </button>
          )}
          {order.status === "Cancelled" && (
            <div className="cancelled-badge">
              <p>🚫 Order Cancelled</p>
            </div>
          )}
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && !cancellationMessage && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Cancel This Order?</h3>
              <p>Once cancelled, you cannot undo this action. You will receive a refund of <strong>₹{order.total.toLocaleString("en-IN")}</strong> within 5-7 business days.</p>
              <div className="modal-actions">
                <button
                  onClick={handleCancelOrder}
                  className="btn-confirm-cancel"
                  disabled={isCancelling}
                >
                  {isCancelling ? "Processing..." : "Yes, Cancel Order"}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="btn-keep-order"
                  disabled={isCancelling}
                >
                  Keep Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="help-section">
          <h4>Need Help?</h4>
          <p>If you have any questions about your order, please contact our support team.</p>
          <button className="btn-support">📞 Contact Support</button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
