import { createContext, useContext, useState } from "react";

// Create context
const CartContext = createContext();

// Custom hook (VERY professional pattern)
export const useCart = () => {
  return useContext(CartContext);
};

// Provider
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ ADD TO CART
  const addToCart = (product) => {
    setCartItems((prev) => {
      const itemExists = prev.find((item) => item.id === product.id);

      if (itemExists) {
        // increase quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      // add new item
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // ✅ REMOVE ITEM
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✅ INCREASE QTY
  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: item.qty + 1 }
          : item
      )
    );
  };

  // ✅ DECREASE QTY
  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty - 1 }
            : item
        )
        .filter((item) => item.qty > 0) // auto remove if 0
    );
  };

  // ✅ UPDATE QTY (set to specific value)
  const updateQty = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, qty: newQty }
            : item
        )
      );
    }
  };

  // ✅ TOTAL ITEMS (for header badge)
  const cartCount = cartItems.reduce(
    (total, item) => total + item.qty,
    0
  );

  // ✅ TOTAL PRICE
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const totalPrice = cartTotal;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        updateQty,
        cartCount,
        cartTotal,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
