import { Link } from "react-router-dom";
import "./styles/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <h2 className="footer-logo">ZenRo Wears</h2>
        <p className="footer-tagline">Luxury • Streetwear • Style</p>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-quote">
          <p>“Art is never finished, only abandoned.” — Leonardo da Vinci</p>
        </div>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} ZenRo Wears. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;