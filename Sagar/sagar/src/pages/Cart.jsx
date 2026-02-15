import { useCart } from "../context/CartContext";
import { useState } from "react";
import "./Cart.css";
function Cart({ goBack, goToCheckout }) {
  const { cartItems, cartTotal, totalPrice, removeFromCart, updateQty, cartCount } =
    useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showCoupon, setShowCoupon] = useState(false);

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "SAVE10") {
      setDiscount(Math.floor(totalPrice * 0.1));
      setShowCoupon(false);
    } else if (couponCode.toUpperCase() === "SAVE20") {
      setDiscount(Math.floor(totalPrice * 0.2));
      setShowCoupon(false);
    } else {
      alert("Invalid coupon code");
    }
  };

  const finalTotal = totalPrice - discount;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <button onClick={goBack} className="back-btn">← Continue Shopping</button>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <p className="empty-cart-subtitle">Start shopping and add your favorite products!</p>
          <button onClick={goBack} className="shop-btn">Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <button onClick={goBack} className="back-btn">← Continue Shopping</button>
      <div className="cart-container">
        {/* LEFT - ITEMS */}
        <div className="cart-items">
          <div className="cart-header">
            <h2>Shopping Cart ({cartCount} items)</h2>
            <span className="secure-badge">✓ Secure Checkout</span>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="price">₹ {item.price.toLocaleString("en-IN")}</p>

                <div className="qty-controls">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>
                    −
                  </button>
                  <span className="qty-display">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  🗑️ Remove
                </button>
              </div>

              <div className="item-total">
                ₹ {(item.price * item.qty).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - SUMMARY & CHECKOUT */}
        <div className="cart-summary-container">
          {/* DELIVERY INFO */}
          <div className="delivery-info">
            <div className="delivery-icon">🚚</div>
            <div>
              <p className="delivery-title">Free Delivery</p>
              <p className="delivery-text">Estimated delivery: 2-3 business days</p>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({cartCount} items)</span>
              <span>₹ {(cartTotal || 0).toLocaleString("en-IN")}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">Free</span>
            </div>

            {discount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount Applied</span>
                <span className="discount-amount">−₹ {discount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <hr />

            <div className="summary-total">
              <span>Total Amount</span>
              <span>₹ {finalTotal.toLocaleString("en-IN")}</span>
            </div>

            {/* COUPON SECTION */}
            {!discount && (
              <div className="coupon-section">
                <button
                  className="coupon-toggle"
                  onClick={() => setShowCoupon(!showCoupon)}
                >
                  🎉 Have a coupon? Apply here
                </button>

                {showCoupon && (
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="coupon-input"
                    />
                    <button
                      onClick={applyCoupon}
                      className="coupon-apply-btn"
                    >
                      Apply
                    </button>
                  </div>
                )}
                <p className="coupon-hint">Try: SAVE10 or SAVE20</p>
              </div>
            )}

            <button className="checkout-btn" onClick={goToCheckout}>
              ✓ Proceed to Checkout
            </button>

            <p className="secure-text">🔒 100% Secure Checkout - Your data is encrypted</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
