import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth } from "../Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaShoppingCart } from "react-icons/fa";
import "./Navbar.css";
import PropTypes from "prop-types";

function Navbar({ cartCount, clearCart }) {
  const [menuOpen, setMenuOpen] = useState(false); // 🍔 for mobile
  const [dropdownOpen, setDropdownOpen] = useState(false); // 👤 for user
  const [user, setUser] = useState(null);

  // 🔥 Watch authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    if (user) {
      localStorage.removeItem(`cart_${user.uid}`);
    }
    clearCart();
    signOut(auth);
  };

  // 🧠 Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".nav-user")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <nav className="Navbar">
      <div className="logo">
        <h2>ZenRo Wears</h2>
      </div>

      {/* 🍔 Hamburger */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* 🔗 Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/shop" onClick={() => setMenuOpen(false)}>Shop</Link></li>
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
        <li><Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>

        {/* 🛒 Cart */}
        <li className="cart-link">
          <Link to="/cart" onClick={() => setMenuOpen(false)} className="cart-icon">
            <FaShoppingCart />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </li>

        {/* 👤 User Dropdown */}
        {user ? (
          <li className={`nav-user dropdown ${dropdownOpen ? "active" : ""}`}>
            <span
              className="user-name"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen((prev) => !prev);
              }}
            >
              {user.displayName || "ZenRo Member"}
            </span>

            <ul className={`dropdown-menu ${dropdownOpen ? "active" : ""}`}>
              <li>
                <Link to="/myorders" onClick={() => setDropdownOpen(false)}>
                  My Orders
                </Link>
              </li>
              <li>
                <button
                  className="logout-btn"
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </li>
        ) : (
          <>
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link></li>
            <li><Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
}

Navbar.propTypes = {
  cartCount: PropTypes.number.isRequired,
  clearCart: PropTypes.func.isRequired,
};

export default Navbar;