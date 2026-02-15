import React, { useState } from "react";
import Home from "./pages/Home";
import "./global.css";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Toast from "./components/Toast";
import { useToast } from "./context/ToastContext";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
function App() {
  const { toast } = useToast();
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previousPage, setPreviousPage] = useState("home");

  return (
    <>
      {page === "home" && (
        <Home
          goToListing={() => setPage("listing")}
          goHome={() => setPage("home")}
          goToCart={() => {
            setPreviousPage("home");
            setPage("cart");
          }}
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

      {page === "checkout" && <Checkout goBack={() => setPage("cart")} />}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

export default App;
