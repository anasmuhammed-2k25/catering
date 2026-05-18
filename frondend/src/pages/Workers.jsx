import React, { useState, useEffect } from "react";
import "./Workers.css";

const Workers = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(null);
  const [applied, setApplied] = useState([]);
  const [filter, setFilter] = useState("All");

  const cities = ["All", "Kozhikode", "Kochi", "Bangalore", "Palakkad"];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events/approved");
        const data = await res.json();
        setEvents(data);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleApply = async (eventId) => {
    if (!user || user.role !== "worker") return;
    setApplying(eventId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/apply`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setApplied((prev) => [...prev, eventId]);
    } catch { }
    finally { setApplying(null); }
  };

  const filtered = filter === "All" ? events : events.filter((e) => e.city === filter);

  return (
    <div className="page-wrapper workers-page">
      <p className="section-sub">Opportunities Await</p>
      <h1 className="section-title">Available <span>Events</span></h1>
      <div className="ornament"><div className="ornament-line"></div><div className="ornament-diamond"></div><div className="ornament-line"></div></div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {cities.map((c) => (
          <button key={c} className={`filter-btn ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
        <span className="event-count">{filtered.length} event{filtered.length !== 1 ? "s" : ""} found</span>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <h3>No Events Available</h3>
          <p>Check back soon — new events are posted regularly.</p>
        </div>
      ) : (
        <div className="events-grid">
          {filtered.map((event) => (
            <div className="event-card" key={event._id}>
              <div className="event-card-top">
                <div className="event-city">{event.city}</div>
                <div className="event-date">{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
              </div>
              <h3 className="event-title">{event.title}</h3>
              <p className="event-location">📍 {event.location}</p>

              <div className="event-meta">
                <div className="meta-item"><span className="meta-label">Guests</span><span className="meta-value">{event.guestCount}</span></div>
                {event.cuisine && <div className="meta-item"><span className="meta-label">Cuisine</span><span className="meta-value">{event.cuisine}</span></div>}
                {event.budget && <div className="meta-item"><span className="meta-label">Budget</span><span className="meta-value">₹{Number(event.budget).toLocaleString()}</span></div>}
              </div>

              {event.description && <p className="event-desc">{event.description}</p>}

              <div className="event-card-footer">
                <span className="applicant-count">{event.applicants?.length || 0} applied</span>
                {user && user.role === "worker" ? (() => {
                  const hasApplied = applied.includes(event._id) || event.applicants?.some(a => (a._id || a) === (user._id || user.id));
                  const isApproved = event.approvedWorkers?.some(w => (w._id || w) === (user._id || user.id));
                  const isRejected = event.rejectedWorkers?.some(w => (w._id || w) === (user._id || user.id));

                  if (isApproved) {
                    return <span className="applied-badge" style={{ color: '#4caf50', border: '1px solid #4caf50' }}>✓ Approved</span>;
                  } else if (isRejected) {
                    return <span className="applied-badge" style={{ color: '#f44336', border: '1px solid #f44336' }}>✕ Rejected</span>;
                  } else if (hasApplied) {
                    return <span className="applied-badge" style={{ color: '#ff9800', border: '1px solid #ff9800' }}>⏳ Pending</span>;
                  } else {
                    return (
                      <button
                        className="apply-btn"
                        onClick={() => handleApply(event._id)}
                        disabled={applying === event._id}
                      >
                        {applying === event._id ? "Applying..." : "Apply Now"}
                      </button>
                    );
                  }
                })() : !user ? (
                  <a className="apply-btn" href="/login">Login to Apply</a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workers;
