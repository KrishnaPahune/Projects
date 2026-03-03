import React, { useState, useEffect } from "react";
import Home from "./pages/Home";
import "./global.css";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Toast from "./components/Toast";
import { useToast } from "./context/ToastContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderDetail from "./pages/OrderDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const { toast } = useToast();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";
  const [page, setPage] = useState("home");
  const [adminLoggedIn, setAdminLoggedIn] = useState(!!localStorage.getItem("adminSession"));
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previousPage, setPreviousPage] = useState("home");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    // If the URL is /admin (or starts with it), open admin page
    if (window.location.pathname && window.location.pathname.startsWith("/admin")) {
      setPage("admin");
    }

    // Verify session with backend token
    const verify = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        
        // If no token stored, session is invalid
        if (!token) {
          localStorage.removeItem("adminSession");
          setAdminLoggedIn(false);
          return;
        }

        // Verify token via Authorization header
        const res = await fetch(`${BACKEND_URL}/api/auth/verify`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          credentials: "include",
        });
        
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("adminSession", "1");
          localStorage.setItem("adminEmail", data.email);
          localStorage.setItem("adminName", data.full_name);
          setAdminLoggedIn(true);
        } else {
          // Token invalid or expired
          localStorage.removeItem("adminSession");
          localStorage.removeItem("adminToken");
          setAdminLoggedIn(false);
        }
      } catch (e) {
        console.error("Session verification error:", e);
        localStorage.removeItem("adminSession");
        localStorage.removeItem("adminToken");
        setAdminLoggedIn(false);
      }
    };

    verify();
  }, []);

  return (
    <>
      {page === "account" && (
        <Account
          goBack={() => setPage("home")}
          goToLogin={() => setPage("login")}
          setPage={setPage}
          setSelectedOrderId={setSelectedOrderId}
        />
      )}
      {page === "login" && (
        <Login
          goBack={() => setPage("home")}
          goToRegister={() => setPage("register")}
          setPage={setPage}
        />
      )}

      {page === "register" && <Register goBack={() => setPage("login")} setPage={setPage} />}
      {page === "home" && (
        <Home
          goToListing={() => setPage("listing")}
          goHome={() => setPage("home")}
          goToCart={() => {
            setPreviousPage("home");
            setPage("cart");
          }}
          setPage={setPage}
          openProduct={(product) => {
            setSelectedProduct(product);
            setPreviousPage("home");
            setPage("details");
          }}
        />
      )}

      {page === "listing" && (
        <ProductListing
          goHome={() => setPage("home")}
          openProduct={(product) => {
            setSelectedProduct(product);
            setPreviousPage("listing");
            setPage("details");
          }}
          goToCart={() => {
            setPreviousPage("listing");
            setPage("cart");
          }}
        />
      )}

      {page === "details" && (
        <ProductDetail
          product={selectedProduct}
          goBack={() => setPage(previousPage)}
          goToCart={() => {
            setPreviousPage("details");
            setPage("cart");
          }}
        />
      )}

      {page === "cart" && (
        <Cart
          goBack={() => setPage(previousPage)}
          goToCheckout={() => setPage("checkout")}
        />
      )}

      {page === "checkout" && (
        <Checkout
          goBack={() => setPage("cart")}
          goToLogin={() => setPage("login")}
          goToConfirmation={() => setPage("confirmation")}
        />
      )}

      {page === "confirmation" && (
        <OrderConfirmation
          goBack={() => {
            setPreviousPage("home");
            setPage("account");
          }}
          goHome={() => setPage("home")}
        />
      )}

      {page === "order-detail" && (
        <OrderDetail
          orderId={selectedOrderId}
          goBack={() => setPage("account")}
          goToCheckout={() => {
            setPreviousPage("account");
            setPage("checkout");
          }}
        />
      )}

      {page === "admin" && !adminLoggedIn && (
        <AdminLogin
          onLoginSuccess={(data) => {
            setAdminLoggedIn(true);
          }}
        />
      )}

      {page === "admin" && adminLoggedIn && (
        <AdminDashboard
          onLogout={() => {
            setAdminLoggedIn(false);
            setPage("home");
          }}
        />
      )}

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

export default App;
