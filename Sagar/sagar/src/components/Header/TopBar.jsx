import React from 'react';
import './TopBar.css';
const TopBar = () => {
  return (
    <div className="top-bar">
      <div className="top-bar-container">
        <div className="top-bar-left">
          <a href="tel:+919876543210" className="top-bar-link">
            <span className="icon">📞</span>
            <span>+91 98765 43210</span>
          </a>
          <a href="mailto:info@sagarelectronics.com" className="top-bar-link">
            <span className="icon">✉️</span>
            <span>info@sagarelectronics.com</span>
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
          <a href="/account" className="top-bar-link">
            <span className="icon">👤</span>
            <span>My Account</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
