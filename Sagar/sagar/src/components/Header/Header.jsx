import React, { useState } from 'react';
import TopBar from './TopBar';
import MiddleBar from './MiddleBar';
import BottomBar from './BottomBar';
import './Header.css';
import { useCart } from "../../context/CartContext";

const Header = () => {
  const { cartCount } = useCart();
  console.log(cartCount);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      {/* Child Component 1: Top Bar */}
      <TopBar />

      {/* Child Component 2: Middle Bar */}
      <MiddleBar onMenuToggle={toggleMenu} />

      {/* Child Component 3: Bottom Bar */}
      <BottomBar />

      {/* Mobile Sidebar Menu Overlay */}
      {isMenuOpen && (
        <>
          <div className="overlay" onClick={toggleMenu}></div>
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button className="close-btn" onClick={toggleMenu}>✕</button>
            </div>
            <nav className="mobile-nav">
              <a href="/" className="mobile-nav-link">🏠 Home</a>
              <a href="/shop" className="mobile-nav-link">🛍️ Shop</a>
              <a href="/products" className="mobile-nav-link">📱 All Products</a>
              <a href="/offers" className="mobile-nav-link">🎁 Special Offers</a>
              <a href="/store-locator" className="mobile-nav-link">📍 Store Locator</a>
              <a href="/track-order" className="mobile-nav-link">📦 Track Order</a>
              <a href="/account" className="mobile-nav-link">👤 My Account</a>
              <a href="/wishlist" className="mobile-nav-link">❤️ Wishlist</a>
              <a href="/contact" className="mobile-nav-link">📞 Contact Us</a>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
