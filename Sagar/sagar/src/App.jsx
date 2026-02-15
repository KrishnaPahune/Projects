import React, { useState } from "react";
import Home from "./pages/Home";
import "./global.css";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Toast from "./components/Toast";
import { useToast } from "./context/ToastContext";
import Cart from "./pages/Cart";

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
            setPreviousPage(page);
            setPage("details");
          }}
          goToCart={() => setPage("cart")}
        />
      )}

      {page === "details" && (
        <ProductDetail
          product={selectedProduct}
          goBack={() => setPage(previousPage)}
        />
      )}
      {page === "cart" && <Cart goBack={() => setPage("listing")} />}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

export default App;
