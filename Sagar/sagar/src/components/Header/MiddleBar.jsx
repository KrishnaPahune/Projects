import React from 'react';
import './MiddleBar.css';
import logo from '../../assets/images/sagar_logo.png';

const MiddleBar = ({ onMenuToggle }) => {
  return (
    <div className="middle-bar">
      <div className="middle-bar-container">
        {/* Logo & Menu */}
        <div className="logo-section">
          <button 
            className="menu-toggle" 
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            <span className="menu-icon">☰</span>
          </button>
          <a href="/" className="logo">
            <img src={logo} alt="Sagar Electronics Logo" className="logo-img" />
            <div className="logo-text">
              <span className="logo-text-main">Sagar</span>
              <span className="logo-text-sub">Electronics</span>
            </div>
          </a>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search products..."
          />
          <button className="search-button" aria-label="Search">
            <span className="search-icon">🔍</span>
          </button>
        </div>

        {/* Action Icons */}
        <div className="actions-section">
          <button className="action-btn" aria-label="Compare">
            <span className="action-icon">⇄</span>
          </button>
          <button className="action-btn" aria-label="Wishlist">
            <span className="action-icon">❤️</span>
          </button>
          <a href="/cart" className="action-btn cart-button">
            <span className="action-icon">🛒</span>
            <span className="cart-badge">0</span>
            <span className="cart-total">₹ 0.00</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MiddleBar;
