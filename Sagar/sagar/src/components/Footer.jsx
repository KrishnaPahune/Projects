import React, { useState, useEffect } from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 300px from top
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer className="footer">
      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          {/* Column 1: About */}
          <div className="footer-column">
            <div className="footer-brand">
              <h3 className="footer-logo">
                <span className="logo-text-main">Sagar</span>
                <span className="logo-text-sub">Electronics</span>
              </h3>
              <p className="footer-description">
                Your trusted destination for premium electronics. Quality products, unbeatable prices, and exceptional service since 2010.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="social-links">
              <a href="https://facebook.com" className="social-link" aria-label="Facebook">
                <span className="social-icon">📘</span>
              </a>
              <a href="https://instagram.com" className="social-link" aria-label="Instagram">
                <span className="social-icon">📷</span>
              </a>
              <a href="https://twitter.com" className="social-link" aria-label="Twitter">
                <span className="social-icon">🐦</span>
              </a>
              <a href="https://youtube.com" className="social-link" aria-label="YouTube">
                <span className="social-icon">📺</span>
              </a>
              <a href="https://linkedin.com" className="social-link" aria-label="LinkedIn">
                <span className="social-icon">💼</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/store-locator">Store Locator</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/blog">Blog</a></li>
              <li><a href="/press">Press & Media</a></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="footer-column">
            <h4 className="footer-heading">Customer Service</h4>
            <ul className="footer-links">
              <li><a href="/help">Help Center</a></li>
              <li><a href="/track-order">Track Order</a></li>
              <li><a href="/shipping">Shipping Info</a></li>
              <li><a href="/returns">Returns & Exchange</a></li>
              <li><a href="/warranty">Warranty</a></li>
              <li><a href="/faq">FAQ</a></li>
            </ul>
          </div>

          {/* Column 4: Policies */}
          <div className="footer-column">
            <h4 className="footer-heading">Policies</h4>
            <ul className="footer-links">
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
              <li><a href="/refund-policy">Refund Policy</a></li>
              <li><a href="/cookie-policy">Cookie Policy</a></li>
              <li><a href="/security">Security</a></li>
              <li><a href="/accessibility">Accessibility</a></li>
            </ul>
          </div>

          {/* Column 5: Contact Info */}
          <div className="footer-column">
            <h4 className="footer-heading">Get In Touch</h4>
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <div className="contact-details">
                  <p className="contact-label">Visit Us</p>
                  <p className="contact-text">Shop No. 123, MG Road<br/>Mumbai, Maharashtra 400001</p>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <div className="contact-details">
                  <p className="contact-label">Call Us</p>
                  <a href="tel:+919822871709" className="contact-link">+91 9822871709</a>
                </div>
              </div>
              
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <div className="contact-details">
                  <p className="contact-label">Email Us</p>
                  <a href="mailto:sagarelectronics4@gmail.com" className="contact-link">sagarelectronics4@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Trust Section */}
      <div className="footer-trust">
        <div className="footer-container">
          <div className="trust-content">
            <div className="trust-section">
              <h5 className="trust-heading">We Accept</h5>
              <div className="payment-methods">
                <span className="payment-badge">💳 Visa</span>
                <span className="payment-badge">💳 Mastercard</span>
                <span className="payment-badge">💰 UPI</span>
                <span className="payment-badge">📱 Paytm</span>
                <span className="payment-badge">💵 Cash on Delivery</span>
              </div>
            </div>
            
            <div className="trust-section">
              <h5 className="trust-heading">Secure Shopping</h5>
              <div className="security-badges">
                <span className="security-badge">🔒 SSL Secured</span>
                <span className="security-badge">✓ 100% Authentic</span>
                <span className="security-badge">🛡️ Buyer Protection</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="bottom-content">
            <p className="copyright">
              © {currentYear} Sagar Electronics. All rights reserved.
            </p>
            <div className="bottom-links">
              <a href="/sitemap">Sitemap</a>
              <span className="separator">|</span>
              <a href="/privacy-policy">Privacy</a>
              <span className="separator">|</span>
              <a href="/terms">Terms</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        className={`back-to-top ${showBackToTop ? 'show' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>
    </footer>
  );
};

export default Footer;
