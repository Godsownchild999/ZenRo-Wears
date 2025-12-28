import { useState } from "react";
import "./Auth.css";

function SignUp() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = ({ target: { name, value } }) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Registration attempt", form);
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Create an account</h1>

        <label className="auth-label">
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            First name <span style={{ color: 'red', marginLeft: 7 }}>*</span>
          </span>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </label>

        <label className="auth-label">
           <span style={{ display: 'inline-flex', alignItems: 'center' }}>
           Last name  <span style={{ color: 'red', marginLeft: 7 }}> *</span>
          </span>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </label>

        <label className="auth-label">
           <span style={{ display: 'inline-flex', alignItems: 'center' }}>
           Email  <span style={{ color: 'red', marginLeft: 7 }}> *</span>
          </span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="auth-label">
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            Password  <span style={{ color: 'red', marginLeft: 7 }}> *</span>
          </span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>

        <button type="submit" className="btn btn-dark w-100 mt-3">
          Sign up
        </button>
        <div className="signup-links" style={{display: 'flex', justifyContent: 'center', marginTop: '1rem'}}>
          <span style={{fontSize: '1rem'}}>Already have an account? <a href="/login" style={{color: '#007bff', textDecoration: 'underline'}}>Sign in</a></span>
        </div>
      </form>
    </div>
  );
}

export default SignUp;