import React from "react";
import "./TopBar.css";

const TopBar = ({ setPage, user }) => {
  return (
    <div className="top-bar">
      <div className="top-bar-container">
        <div className="top-bar-left">
          <a href="tel:+919822871709" className="top-bar-link">
            <span className="icon">📞</span>
            <span>+91 9822871709</span>
          </a>
          <a href="mailto:sagarelectronics4@gmail.com" className="top-bar-link">
            <span className="icon">✉️</span>
            <span>sagarelectronics4@gmail.com</span>
          </a>
        </div>
        <div className="top-bar-right">
          <a href="/store-locator" className="top-bar-link">
            <span className="icon">📍</span>
            <span>Store Locator</span>
          </a>
          <a href="/track-order" className="top-bar-link">
            <span className="icon">📦</span>
            <span>Track Your Order</span>
          </a>
          <a href="/shop" className="top-bar-link">
            <span className="icon">🛍️</span>
            <span>Shop</span>
          </a>
          <div
            className="top-bar-link"
            onClick={() => setPage(user ? "account" : "login")}
          >
            <span className="icon">👤</span>
            <span>My Account</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
