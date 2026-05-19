import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
const apiUrl = import.meta.env.VITE_API_URL || "";



const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "customer" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      onLogin(data.user);
      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "worker") navigate("/workers");
      else navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left login-left">
        <div className="auth-brand">
          <div className="auth-logo">Grand<span>Fort</span></div>
          <p className="auth-tagline">Premium Event Catering &amp; Staffing Platform</p>
        </div>
        <div className="auth-quote">
          <p>"The finest catering experience starts with the right team."</p>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <p className="auth-eyebrow">Welcome Back</p>
          <h1 className="auth-title">Sign In</h1>
          <div className="ornament small"><div className="ornament-line"></div><div className="ornament-diamond"></div><div className="ornament-line"></div></div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="customer">Customer</option>
                <option value="worker">Worker</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="your@email.com" value={form.email} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
