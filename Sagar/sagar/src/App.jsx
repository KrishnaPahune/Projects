import React, { useState } from "react";
import Home from "./pages/Home";
import "./global.css";
import ProductListing from "./pages/ProductListing";

function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      {page === "home" && (
        <Home goToListing={() => setPage("listing")} />
      )}

      {page === "listing" && (
        <ProductListing goHome={() => setPage("home")} />
      )}
    </>
  );
}

export default App;
