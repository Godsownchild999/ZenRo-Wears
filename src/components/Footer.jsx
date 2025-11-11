import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css';

function Footer() {
  return (
    <footer className="bg-dark text-light text-center py-4 mt-5">
      <div className="container">
        <h2 className="fw-bold mb-2">ZenRo Wears</h2>
        <p className="mb-3">Luxury • Streetwear • Style</p>

        <div className="d-flex justify-content-center mb-3 gap-3">
          <a href="/" className="text-light text-decoration-none">Home</a>
          <a href="/shop" className="text-light text-decoration-none">Shop</a>
          <a href="/about" className="text-light text-decoration-none">About</a>
          <a href="/contact" className="text-light text-decoration-none">Contact</a>
        </div>

        <p className="small text-secondary mb-0">
          “Art is never finished, only abandoned.” — Leonardo da Vinci
        </p>
        <p className="small mt-2 mb-0">&copy; {new Date().getFullYear()} ZenRo Wears. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;