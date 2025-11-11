// src/pages/NotFound.jsx
import { Link } from "react-router-dom";
import "./NotFound.css"; // optional styling

function NotFound() {
  return (
    <div className="notfound-page" style={{
      height: "100vh",
      backgroundColor: "#000",
      color: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <h1 style={{ fontSize: "5rem", marginBottom: "1rem" }}>404</h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
        Oops... the page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        style={{
          backgroundColor: "#fff",
          color: "#000",
          padding: "10px 25px",
          borderRadius: "30px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        Go Back Home
      </Link>
    </div>
  );
}

export default NotFound;