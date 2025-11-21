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

  return (
    <div className="signup-page page-fade-in">
      <div className="signup-card">
        <h1>Create your ZenRo account</h1>
        <p className="signup-subtitle">Join the community and stay ahead on every drop.</p>
        {error && <div className="signup-alert">{error}</div>}
        <form className="signup-form" onSubmit={handleSignUp}>
          <label>
            Display name
            <input
              name="displayName"
              placeholder="Zen Master"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label>
            Password
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

          <label>
            Confirm password
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
    </div>
  );
}

export default SignUp;