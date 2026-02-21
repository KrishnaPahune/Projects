import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CartProvider } from "./context/CartContext";
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext";
import { PaymentProvider } from "./context/PaymentContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <PaymentProvider>
            <ToastProvider>
              <App />
            </ToastProvider>
          </PaymentProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
);
