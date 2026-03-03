import React, { useState } from "react";
import TopBar from "./TopBar";
import MiddleBar from "./MiddleBar";
import BottomBar from "./BottomBar";
import "./Header.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const Header = ({ goToCart, goHome, setPage }) => {
  const { user } = useAuth();
  const isAdmin = !!localStorage.getItem("adminSession");
  const { cartCount } = useCart();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      {/* Top Bar */}
      <TopBar setPage={setPage} user={user} />

      {/* Middle Bar */}
      <MiddleBar
        onMenuToggle={toggleMenu}
        goToCart={goToCart}
        goHome={goHome}
      />

      {/* Bottom Bar */}
      <BottomBar />

      {/* Mobile Sidebar Menu */}
      {isMenuOpen && (
        <>
          <div className="overlay" onClick={toggleMenu}></div>

          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <h3>Menu</h3>
              <button className="close-btn" onClick={toggleMenu}>
                ✕
              </button>
            </div>

            <nav className="mobile-nav">
              <button
                className="mobile-nav-link"
                onClick={() => {
                  setPage("home");
                  toggleMenu();
                }}
              >
                🏠 Home
              </button>

              <button
                className="mobile-nav-link"
                onClick={() => {
                  setPage("listing");
                  toggleMenu();
                }}
              >
                🛍️ Shop
              </button>

              <button
                className="mobile-nav-link"
                onClick={() => {
                  if (user) {
                    setPage("account");
                  } else {
                    setPage("login");
                  }
                  toggleMenu();
                }}
              >
                👤 My Account
              </button>

              <button
                className="mobile-nav-link"
                onClick={() => {
                  setPage("cart");
                  toggleMenu();
                }}
              >
                🛒 Cart ({cartCount})
              </button>

              {/* Admin Button */}
              {isAdmin && (
                <button
                  className="mobile-nav-link"
                  onClick={() => {
                    setPage("admin");
                    toggleMenu();
                  }}
                >
                  ⚙️ Admin Dashboard
                </button>
              )}
            </nav>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;