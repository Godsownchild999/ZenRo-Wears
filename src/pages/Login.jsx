import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // import Link
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error("❌ Login error:", err.message);
      setError("Incorrect email or password.");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-box" onSubmit={handleLogin}>
        <h1 className="login-title">ZenRo</h1>
        <p className="login-sub">Sign in to continue</p>

        {error && <p className="login-error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="password-box">
          <input
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="show-btn mb-3"
            onClick={() => setShowPwd(!showPwd)}
          >
            {showPwd ? "Hide" : "Show"}
          </button>
        </div>

        <button type="submit">Login</button>

        {/* 🔗 Redirect to Sign Up */}
        <p className="login-footer">
          Don’t have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;