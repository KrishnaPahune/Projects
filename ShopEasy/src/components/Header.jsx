import React, { useContext } from "react";
import cart from "../assets/cart.svg";
import "./Header.css";
import { cardContext } from "../context/CardContext";

function Header() {
  const {cartCount}=useContext(cardContext)
  return (
    <header>
      <h1>Sagar Electronics</h1>
      <div className="cart">
        <img src={cart} alt="" />
        <div>{cartCount}</div>
      </div>
    </header>
  );
}

export default Header;
