import React, { useState } from "react";
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
function App() {
  const { toast } = useToast();
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previousPage, setPreviousPage] = useState("home");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

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

      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

export default App;
