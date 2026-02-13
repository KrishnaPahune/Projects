import React, { useState } from "react";
import Home from "./pages/Home";
import "./global.css";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";

function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previousPage, setPreviousPage] = useState("home");


  return (
    <>
      {page === "home" && (
        <Home goToListing={() => setPage("listing")} 
          openProduct={(product) => {
            setSelectedProduct(product);
            setPage("details");
          }}/>
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
    </>
  );
}

export default App;
