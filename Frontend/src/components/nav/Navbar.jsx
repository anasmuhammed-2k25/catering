import React from "react";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="cc-nav">
    
      <div className="cc-top-bar">
        <span className="cc-top-left">Est. 2019 &nbsp;·&nbsp; Premium Event Catering</span>
        <div className="cc-top-right">
          <span>Kochi</span>
          <span>Kozhikode</span>
          <span>Bangalore</span>
        </div>
      </div>

     
      <div className="cc-main">
        {/* Logo */}
        <a className="cc-logo" href="/">
          <div className="cc-logo-word">
            Cater<span>Crew</span>
          </div>
          <div className="cc-logo-sub">Fine Catering &amp; Events</div>
        </a>

        {/* Center Links */}
        <div className="cc-links">
          <a className="cc-link active" href="/">Home</a>
          <a className="cc-link" href="/works">Jobs</a>
          <a className="cc-link" href="/workers">Workers</a>
          <a className="cc-link" href="/menus">Menus</a>
          <a className="cc-link" href="/post-event">Post Event</a>
        </div>

        {/* Right Actions */}
        <div className="cc-right">
          <button className="cc-search" aria-label="Search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7a1e32" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <line x1="15.5" y1="15.5" x2="21" y2="21" />
            </svg>
          </button>
          <div className="cc-divider"></div>
          <a className="cc-book" href="/book">Book Now</a>
          <button className="cc-login">Login</button>
        </div>
      </div>

      {/* Bottom Ornament */}
      <div className="cc-ornament">
        <div className="cc-ornament-line"></div>
        <div className="cc-ornament-diamond"></div>
        <div className="cc-ornament-line"></div>
      </div>
    </nav>
  );
};

export default Navbar;