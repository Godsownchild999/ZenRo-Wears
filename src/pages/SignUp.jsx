import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../Firebase";
import "./SignUp.css";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [validationModal, setValidationModal] = useState({
    open: false,
    missing: [],
  });

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPwd) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save display name to Firebase profile
      if (name.trim()) {
        await updateProfile(user, { displayName: name });
      }

      setSuccess(`Welcome ${name || "to ZenRo Family"}!`);
      setTimeout(() => (window.location.href = "/"), 2000);
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email already in use. Try logging in instead.");
      } else {
        setError("Failed to create account. Try again.");
      }
    }
  };

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError("");
    if (validationModal.open) {
      setValidationModal({ open: false, missing: [] });
    }
  };

  return (
    <div className="signup-page page-fade-in">
      <div className="signup-card">
        <h1>Create your ZenRo account</h1>
        <p className="signup-subtitle">Join the community and stay ahead on every drop.</p>
        {error && <div className="signup-alert">{error}</div>}
        <form className="signup-form" onSubmit={handleSignUp}>
          <label className="field-label">
            <span className="label-title">
              Display name <span className="required-indicator">*</span>
            </span>
            <input
              name="displayName"
              placeholder="Zen Master"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>
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
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          <label className="field-label">
            <span className="label-title">
              Confirm password <span className="required-indicator">*</span>
            </span>
            <div className="input-with-toggle">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Repeat password"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
              />
              <button
                type="button"
                className="toggle-visibility"
                onClick={() => setShowConfirm((prev) => !prev)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </label>
          <button className="signup-btn" type="submit">
            Sign up
          </button>
        </form>
        <p className="signup-switch">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </div>

      {validationModal.open && (
        <div className="form-modal-backdrop" role="alertdialog" aria-modal="true">
          <div className="form-modal">
            <h2>Action required</h2>
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
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;