import React from 'react'
import './Footer.css'
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p className="footer-text">
          © {new Date().getFullYear()} Krishna Gajanan Pahune. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
