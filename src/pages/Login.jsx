import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../Firebase";
import "./Auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      // Optionally redirect or show success
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotPassword = async () => {
    setError("");
    if (!form.email) {
      setError("Enter your email above first.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, form.email);
      setResetSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f7f8fa' }}>
      <form className="auth-card" onSubmit={handleSubmit} style={{ maxWidth: 400, width: '100%', background: '#fff', borderRadius: 24, boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '2.5rem 2rem', margin: '2rem 0' }}>
        <h1 style={{ fontWeight: 700, fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Welcome back</h1>

        {error && <div className="alert alert-danger" style={{ marginBottom: 12 }}>{error}</div>}
        {resetSent && <div className="alert alert-success" style={{ marginBottom: 12 }}>Password reset email sent!</div>}

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label htmlFor="email" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Email address <span style={{ color: 'red' }}>*</span></label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@example.com"
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem' }}
          />
        </div>

        <div className="form-group" style={{ marginBottom: 20 }}>
          <label htmlFor="password" style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Password <span style={{ color: 'red' }}>*</span></label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="Password"
              style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: 8, border: '1px solid #ddd', fontSize: '1rem' }}
            />
            <span
              onClick={() => setShowPassword((v) => !v)}
              style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#888', fontSize: 20 }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit" className="login-btn" style={{ width: '100%', background: '#111', color: '#fff', border: 'none', borderRadius: 8, padding: '0.9rem', fontWeight: 600, fontSize: '1.1rem', marginBottom: 16, marginTop: 8, letterSpacing: 1 }}>SIGN IN</button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <button type="button" onClick={handleForgotPassword} style={{ background: 'none', border: 'none', color: '#007bff', textDecoration: 'underline', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, padding: 0, marginBottom: 2, transition: 'color 0.2s' }}
            onMouseOver={e => e.target.style.color = '#0056b3'}
            onMouseOut={e => e.target.style.color = '#007bff'}
          >
            Forgot password?
          </button>
          <span style={{ fontSize: '1rem', color: '#333' }}>New to ZenRo? <a
            href="/signup"
            style={{ color: '#007bff', textDecoration: 'underline', fontWeight: 600, transition: 'color 0.2s' }}
            onMouseOver={e => (e.target.style.color = '#0056b3')}
            onMouseOut={e => (e.target.style.color = '#007bff')}
          >Create an account</a></span>
        </div>
      </form>
    </div>
  );
}

export default Login;