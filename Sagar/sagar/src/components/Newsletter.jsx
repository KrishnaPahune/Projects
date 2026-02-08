import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      // Add your newsletter signup logic here
      console.log('Newsletter signup:', email);
      setIsSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section className="newsletter">
      <div className="newsletter-container">
        <div className="newsletter-content">
          {/* Left Side - Text Content */}
          <div className="newsletter-text">
            <div className="newsletter-icon">📬</div>
            <h2 className="newsletter-title">Stay Updated with Sagar Electronics</h2>
            <p className="newsletter-description">
              Subscribe to get special offers, new product launches, and exclusive deals delivered to your inbox.
            </p>
            <ul className="newsletter-benefits">
              <li>
                <span className="benefit-icon">✓</span>
                <span>Exclusive discounts & early access to sales</span>
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                <span>New product launches & tech news</span>
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                <span>Expert tips & buying guides</span>
              </li>
            </ul>
          </div>

          {/* Right Side - Signup Form */}
          <div className="newsletter-form-container">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="form-header">
                  <h3 className="form-title">Join 50,000+ Subscribers</h3>
                  <p className="form-subtitle">No spam. Unsubscribe anytime.</p>
                </div>
                
                <div className="input-group">
                  <input
                    type="email"
                    className="email-input"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="subscribe-btn">
                    Subscribe
                  </button>
                </div>

                <p className="privacy-note">
                  By subscribing, you agree to our <a href="/privacy">Privacy Policy</a>
                </p>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">🎉</div>
                <h3 className="success-title">Welcome Aboard!</h3>
                <p className="success-text">
                  Thank you for subscribing. Check your inbox for a special welcome offer!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
