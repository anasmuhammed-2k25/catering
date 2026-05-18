import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ user, onLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="cc-nav">
      <div className="cc-top-bar">
        <span className="cc-top-left">Est. 2015 &nbsp;·&nbsp; Premium Event Catering</span>
        <div className="cc-top-right">
          <span>Kochi</span>
          <span>Kozhikode</span>
          <span>Bangalore</span>
          <span>Palakkad</span>
        </div>
      </div>

      <div className="cc-main">
        <Link className="cc-logo" to="/">
          <div className="cc-logo-word">Grand<span>Fort</span></div>
          <div className="cc-logo-sub">Fine Catering &amp; survices</div>
        </Link>

        <div className={`cc-links ${menuOpen ? "open" : ""}`}>
          <Link className={`cc-link ${isActive("/") ? "active" : ""}`} to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link className={`cc-link ${isActive("/workers") ? "active" : ""}`} to="/workers" onClick={() => setMenuOpen(false)}>Works</Link>
          <Link className={`cc-link ${isActive("/our-workers") ? "active" : ""}`} to="/our-workers" onClick={() => setMenuOpen(false)}>Workers</Link>
          {user && user.role === "customer" && (
            <Link className={`cc-link ${isActive("/post-event") ? "active" : ""}`} to="/post-event" onClick={() => setMenuOpen(false)}>Post Event</Link>
          )}
          {user && user.role === "admin" && (
            <Link className={`cc-link ${isActive("/admin") ? "active" : ""}`} to="/admin" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}
        </div>

        <div className="cc-right">
          {user ? (
            <>
              <Link to="/profile" className="cc-username" style={{ textDecoration: 'none' }}>Hello, {user.name}</Link>
              <div className="cc-divider"></div>
              <button className="cc-login" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="cc-book" to="/register">Register</Link>
              <Link className="cc-login-btn" to="/login">Login</Link>
            </>
          )}
          <button className="cc-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <div className="cc-ornament">
        <div className="cc-ornament-line"></div>
        <div className="cc-ornament-diamond"></div>
        <div className="cc-ornament-line"></div>
      </div>
    </nav>
  );
};

export default Navbar;
