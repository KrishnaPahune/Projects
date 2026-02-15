import { useCart } from "../context/CartContext";
import "./Cart.css";
function Cart({ goBack }) {
  const { cartItems, cartTotal, totalPrice, removeFromCart, updateQty } =
    useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <button onClick={goBack}>← Continue Shopping</button>
        <h2>Your cart is empty 🛒</h2>
        <p>Add something you love.</p>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <button onClick={goBack}>← Continue Shopping</button>
      <div className="cart-container">
        {/* LEFT - ITEMS */}
        <div className="cart-items">
          <h2>Shopping Cart ({cartTotal})</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />

              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p className="price">₹ {item.price.toLocaleString("en-IN")}</p>

                <div className="qty-controls">
                  <button onClick={() => updateQty(item.id, item.qty - 1)}>
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)}>
                    +
                  </button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>

              <div className="item-total">
                ₹ {(item.price * item.qty).toLocaleString("en-IN")}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT - SUMMARY */}
        <div className="cart-summary">
          <h3>Order Summary</h3>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹ {(cartTotal || 0).toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <span>₹ {totalPrice.toLocaleString("en-IN")}</span>
          </div>

          <button className="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
