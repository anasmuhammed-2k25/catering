import React, { useState } from "react";
import "./Profile.css";

const Profile = ({ user, onUpdateUser }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    experience: user?.experience || "",
    bio: user?.bio || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!user) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // --- Validation ---
    if (!formData.name || formData.name.trim().length < 3) {
      setError("Full Name must be at least 3 characters long.");
      setLoading(false);
      return;
    }

    if (formData.phone) {
      const phoneRegex = /^\+?[0-9\s\-]{10,15}$/;
      if (!phoneRegex.test(formData.phone)) {
        setError("Please enter a valid phone number (10-15 digits).");
        setLoading(false);
        return;
      }
    }

    if (user.role === "worker") {
      if (!formData.experience || formData.experience.trim().length < 2) {
        setError("Please provide your professional experience.");
        setLoading(false);
        return;
      }
      if (!formData.bio || formData.bio.trim().length < 10) {
        setError("Please provide a bio (at least 10 characters).");
        setLoading(false);
        return;
      }
    }
    // ------------------

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      onUpdateUser({ ...user, ...data.user });
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper profile-page">
      <div className="profile-hero">
        <p className="section-sub">Account Details</p>
        <h1 className="section-title">Your <span>Identity</span></h1>
        <div className="ornament"><div className="ornament-line"></div><div className="ornament-diamond"></div><div className="ornament-line"></div></div>
      </div>

      <div className="profile-layout">
        {/* Sidebar / Identity Card */}
        <div className="profile-sidebar">
          <div className="profile-avatar-large">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-role-badge">{user.role}</p>
          
          <div className="profile-quick-stats">
            <div className="stat-row">
              <span className="stat-label">Member Since</span>
              <span className="stat-val">2026</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Account Type</span>
              <span className="stat-val">{user.role === 'customer' ? 'Client' : 'Professional'}</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="profile-content">
          <div className="content-header">
            <h3>Personal Information</h3>
            {!editing && (
              <button className="btn-outline-small" onClick={() => setEditing(true)}>Edit Details</button>
            )}
          </div>

          {success && <div className="alert-message success">✓ {success}</div>}
          {error && <div className="alert-message error">✕ {error}</div>}

          {editing ? (
            <form className="profile-form-elegant" onSubmit={handleSubmit}>
              <div className="form-row-elegant">
                <div className="form-group-elegant">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group-elegant">
                  <label>Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91" />
                </div>
              </div>

              <div className="form-group-elegant disabled-group">
                <label>Email Address (Cannot be changed)</label>
                <input type="email" value={user.email} disabled />
              </div>

              {user.role === "worker" && (
                <>
                  <div className="form-group-elegant">
                    <label>Professional Experience</label>
                    <input type="text" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5 Years in Traditional Catering" />
                  </div>
                  <div className="form-group-elegant">
                    <label>Biography & Skills</label>
                    <textarea name="bio" rows="5" value={formData.bio} onChange={handleChange} placeholder="Tell clients about your expertise..."></textarea>
                  </div>
                </>
              )}

              <div className="form-actions-elegant">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" className="btn-text" onClick={() => {
                  setEditing(false);
                  setFormData({ name: user.name, phone: user.phone || "", experience: user.experience || "", bio: user.bio || "" });
                  setError(""); setSuccess("");
                }}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="profile-details-grid">
              <div className="detail-box">
                <span className="detail-title">Email Address</span>
                <span className="detail-data">{user.email}</span>
              </div>
              <div className="detail-box">
                <span className="detail-title">Phone Number</span>
                <span className="detail-data">{user.phone || <span className="empty-data">Not provided</span>}</span>
              </div>
              
              {user.role === "worker" && (
                <>
                  <div className="detail-box full-span">
                    <span className="detail-title">Experience</span>
                    <span className="detail-data">{user.experience || <span className="empty-data">Not provided</span>}</span>
                  </div>
                  <div className="detail-box full-span bio-box">
                    <span className="detail-title">Biography</span>
                    <p className="detail-data-text">{user.bio || <span className="empty-data">No biography provided. Click edit to add your story.</span>}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
