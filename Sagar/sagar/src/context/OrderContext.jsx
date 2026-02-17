import { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Load orders from localStorage on mount
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
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
    return orders.find((order) => order.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{ orders, currentOrder, createOrder, getOrdersByEmail, getOrderById }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
