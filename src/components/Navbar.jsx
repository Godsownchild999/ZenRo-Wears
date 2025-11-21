// src/components/Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { signOut } from "firebase/auth";

import { auth } from "../Firebase";
import "./styles/Navbar.css";

function Navbar({ cartCount, syncing, user, clearCart }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className={`Navbar ${scrolled ? "scrolled" : ""}`}>
      <NavLink to="/" className="logo" onClick={closeMobileMenu}>
        ZenRo
      </NavLink>

      <button
        className={`hamburger ${menuOpen ? "open" : ""}`}
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => {
          setMenuOpen((prev) => !prev);
          if (dropdownOpen) setDropdownOpen(false);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <NavLink to="/" onClick={closeMobileMenu}>
              <i className="fas fa-home icon" aria-hidden="true"></i>
              <span className="nav-text">Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/shop" onClick={closeMobileMenu}>
              <i className="fas fa-shopping-bag icon" aria-hidden="true"></i>
              <span className="nav-text">Shop</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" onClick={closeMobileMenu}>
              <i className="fas fa-users icon" aria-hidden="true"></i>
              <span className="nav-text">About</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" onClick={closeMobileMenu}>
              <i className="fas fa-envelope icon" aria-hidden="true"></i>
              <span className="nav-text">Contact</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/myorders" onClick={closeMobileMenu}>
              <i className="fas fa-receipt icon" aria-hidden="true"></i>
              <span className="nav-text">Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className="cart-link" onClick={closeMobileMenu}>
              <i className="fas fa-shopping-cart icon" aria-hidden="true"></i>
              <span className="nav-text">Cart</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              {syncing && <span className="sr-only">Syncing cart</span>}
            </NavLink>
          </li>

          {user ? (
            <li className="nav-user" ref={dropdownRef}>
              <button
                type="button"
                className="user-name"
                onClick={() => setDropdownOpen((prev) => !prev)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <i className="fas fa-user-circle icon" aria-hidden="true"></i>
                <span>{user.displayName || user.email?.split("@")[0] || "Account"}</span>
                <i
                  className={`fas fa-chevron-down caret ${dropdownOpen ? "open" : ""}`}
                  aria-hidden="true"
                ></i>
              </button>

              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <NavLink
                      to="/myorders"
                      onClick={closeMobileMenu}
                    >
                      <i className="fas fa-box icon" aria-hidden="true"></i>
                      Track orders
                    </NavLink>
                  </li>
                  <li>
                    <button type="button" className="logout-btn" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt icon" aria-hidden="true"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          ) : (
            <li>
              <NavLink to="/login" onClick={closeMobileMenu}>
                <i className="fas fa-sign-in-alt icon" aria-hidden="true"></i>
                <span className="nav-text">Login</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

Navbar.propTypes = {
  cartCount: PropTypes.number.isRequired,
  syncing: PropTypes.bool,
  user: PropTypes.object,
  clearCart: PropTypes.func.isRequired,
};

Navbar.defaultProps = {
  syncing: false,
  user: null,
};

export default Navbar;