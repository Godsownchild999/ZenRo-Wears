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
    <div className="signup-wrapper">
      <form className="signup-box" onSubmit={handleSignUp}>
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-sub">Join ZenRo Wears</p>

        {error && <p className="signup-error">{error}</p>}
        {success && <p className="signup-success">{success}</p>}

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPwd}
          onChange={(e) => setConfirmPwd(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>

        <p className="switch-text">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </form>
    </div>
  );
}

export default SignUp;