import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // import Link
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validationModal, setValidationModal] = useState({
    open: false,
    missing: [],
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error("❌ Login error:", err.message);
      setError("Incorrect email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError("");
    if (validationModal.open) {
      setValidationModal({ open: false, missing: [] });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const missing = [];
    if (!form.email.trim()) missing.push("Email address");
    if (!form.password.trim()) missing.push("Password");

    if (missing.length) {
      setValidationModal({ open: true, missing });
      return;
    }

    // ...existing login logic
  };

  return (
    <div className="login-page page-fade-in">
      <div className="login-card">
        <h1>Welcome back</h1>
        <p className="login-subtitle">Sign in to keep styling with ZenRo.</p>
        {error && <div className="login-alert">{error}</div>}
        <form className="login-form" onSubmit={handleLogin}>
          <label className="field-label">
            <span className="label-title">
              Email address <span className="required-indicator">*</span>
            </span>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="field-label">
            <span className="label-title">
              Password <span className="required-indicator">*</span>
            </span>
            <div className="input-with-toggle">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="eye-icon"
                >
                  {showPassword ? (
                    <>
                      <path d="M2.1 3.5 3.5 2.1 21.9 20.5 20.5 21.9 16.7 18.1A9.83 9.83 0 0 1 12 19.5C6.6 19.5 2.14 15.64 0.5 12 1.34 10.15 3.47 7.45 6.6 5.9L2.1 3.5Z" />
                      <path d="M9.8 7.2 7.9 5.3A9.86 9.86 0 0 1 12 4.5c5.4 0 9.86 3.86 11.5 7.5-.6 1.27-1.68 2.85-3.15 4.25l-1.9-1.9A5 5 0 0 0 9.8 7.2Z" />
                    </>
                  ) : (
                    <>
                      <path d="M12 19.5C6.6 19.5 2.14 15.64 0.5 12 2.14 8.36 6.6 4.5 12 4.5s9.86 3.86 11.5 7.5c-1.64 3.64-6.1 7.5-11.5 7.5Zm0-12a4.5 4.5 0 1 0 4.5 4.5A4.51 4.51 0 0 0 12 7.5Z" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </label>
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="login-switch">
          New to ZenRo? <Link to="/signup">Create an account</Link>
        </p>
      </div>

      {validationModal.open && (
        <div className="form-modal-backdrop" role="alertdialog" aria-modal="true">
          <div className="form-modal">
            <h2>Missing information</h2>
            <p>Please fill the fields below:</p>
            <ul className="form-modal-list">
              {validationModal.missing.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <button
              type="button"
              className="form-modal-btn"
              onClick={() => setValidationModal({ open: false, missing: [] })}
            >
              Review form
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;