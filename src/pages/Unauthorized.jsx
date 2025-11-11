// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";
import "./Unauthorized.css";

const Unauthorized = () => {
  return (
    <div className="unauthorized-page" style={{ backgroundColor: "#000", color: "#fff" }}>
      <div className="unauth-card">
        <h1>Access Denied</h1>
        <p>You don’t have permission to view this page.</p>
        <div className="actions">
          <Link to="/" className="btn">Go Home</Link>
          <Link to="/login" className="btn outline">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;