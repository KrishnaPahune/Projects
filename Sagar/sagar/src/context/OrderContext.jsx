import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load orders from localStorage on mount (synchronous initial load)
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (error) {
        console.error("Error parsing orders from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      createdAt: new Date().toISOString(),
      status: "Confirmed",
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setCurrentOrder(newOrder);

    return newOrder;
  };

  const getOrdersByEmail = (email) => {
    return orders.filter((order) => order.userEmail === email);
  };

  const getOrderById = (orderId) => {
    // First check in current orders
    const foundOrder = orders.find((order) => order.id === orderId);
    if (foundOrder) return foundOrder;
    
    // Fallback to currentOrder if no match found in orders array
    if (currentOrder && currentOrder.id === orderId) return currentOrder;
    
    return null;
  };

  const cancelOrder = (orderId) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: "Cancelled" } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    return true;
  };

  return (
    <OrderContext.Provider
      value={{ orders, currentOrder, createOrder, getOrdersByEmail, getOrderById, cancelOrder, isLoaded }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
