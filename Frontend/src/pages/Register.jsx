import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";

const apiUrl = import.meta.env.VITE_API_URL || "";

const Register = ({ onLogin }) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    phone: "",
    experience: "",
    bio: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!form.name || !form.email || !form.password) {
    setError("Please fill all required fields.");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch( `${apiUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    // ✅ FIX HERE
    const text = await res.text();  // read once

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server returned HTML instead of JSON:\n" + text);
    }

    if (!res.ok) {
      throw new Error(data.message || "Registration failed");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    onLogin(data.user);
    navigate("/");

  } catch (err) {
    setError(err.message);
    console.error("REGISTER ERROR:", err.message); // ✅ console log
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="auth-page">
      <div className="auth-left register-left">
        <div className="auth-brand">
          <div className="auth-logo">
            Grand<span>Fort</span>
          </div>
          <p className="auth-tagline">
            Join Kerala's Premier Catering Network
          </p>
        </div>

        <div className="auth-steps-info">
          <div className="info-step">
            <span>01</span>
            <p>Create your account</p>
          </div>
          <div className="info-step">
            <span>02</span>
            <p>Post events or apply for jobs</p>
          </div>
          <div className="info-step">
            <span>03</span>
            <p>Build exceptional experiences</p>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box">
          <p className="auth-eyebrow">Join CaterCrew</p>
          <h1 className="auth-title">Create Account</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Role */}
            <div className="form-group">
              <label>I am a</label>
              <div className="role-toggle">
                {["customer", "worker"].map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`role-btn ${
                      form.role === r ? "active" : ""
                    }`}
                    onClick={() => setForm({ ...form, role: r })}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            {/* Email + Phone */}
            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 00000 00000"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Worker Fields */}
            {form.role === "worker" && (
              <>
                <div className="form-group">
                  <label>Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={form.bio}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            {/* Error */}
            {error && <div className="auth-error">{error}</div>}

            {/* Button */}
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;