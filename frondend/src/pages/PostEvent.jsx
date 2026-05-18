import React, { useState, useEffect } from "react";
import "./PostEvent.css";

const PostEvent = ({ user }) => {
  const [myEvents, setMyEvents] = useState([]);
  const [approving, setApproving] = useState(null);
  const [form, setForm] = useState({
    title: "", date: "", location: "", guestCount: "",
    cuisine: "", description: "", budget: "", city: "Kozhikode",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!form.title || !form.date || !form.location || !form.guestCount) {
    setError("Please fill all required fields.");
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:5000/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    // ✅ SAFE PARSE
    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server error: not returning JSON");
    }

    if (!res.ok) {
      throw new Error(data.message || "Submission failed");
    }

    setSuccess(true);

    setForm({
      title: "",
      date: "",
      location: "",
      guestCount: "",
      cuisine: "",
      description: "",
      budget: "",
      city: "Kozhikode",
    });

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const fetchMyEvents = async () => {
      if (!user) return;
      try {
        const res = await fetch("http://localhost:5000/api/events");
        const data = await res.json();
        // filter events where customer matches current user
        const mine = data.filter(e => e.customer?._id === user._id || e.customer === user._id);
        setMyEvents(mine);
      } catch (err) {
        console.error("Failed to fetch my events:", err);
      }
    };
    fetchMyEvents();
  }, [user, success]);

  const handleApproveWorker = async (eventId, workerId) => {
    setApproving(workerId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/approve-worker`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ workerId })
      });
      if (res.ok) {
        const data = await res.json();
        setMyEvents(prev => prev.map(e => e._id === eventId ? data.event : e));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(null);
    }
  };

  const handleRejectWorker = async (eventId, workerId) => {
    setApproving(workerId); // Using the same loading state for simplicity
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/reject-worker`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ workerId })
      });
      if (res.ok) {
        const data = await res.json();
        setMyEvents(prev => prev.map(e => e._id === eventId ? data.event : e));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="page-wrapper post-event-page">
      <p className="section-sub">Share Your Vision</p>
      <h1 className="section-title">Post an <span>Event</span></h1>
      <div className="ornament"><div className="ornament-line"></div><div className="ornament-diamond"></div><div className="ornament-line"></div></div>

      {success ? (
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Event Submitted Successfully</h2>
          <p>Our admin team will review your event and approve it shortly. Once approved, workers can view and apply for your event.</p>
          <button className="btn-primary" onClick={() => setSuccess(false)}>Post Another Event</button>
        </div>
      ) : (
        <div className="post-layout">
          <form className="event-form" onSubmit={handleSubmit}>
            <div className="form-section-title">Event Details</div>

            <div className="form-group">
              <label>Event Title *</label>
              <input type="text" name="title" placeholder="e.g. Wedding Reception, Corporate Dinner" value={form.title} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Event Date *</label>
                <input type="date" name="date" value={form.date} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>City *</label>
                <select name="city" value={form.city} onChange={handleChange}>
                  <option>Kozhikode</option>
                  <option>Kochi</option>
                  <option>Bangalore</option>
                  <option>Palakkad</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Venue / Location *</label>
              <input type="text" name="location" placeholder="Venue name and address" value={form.location} onChange={handleChange} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Number of Guests *</label>
                <input type="number" name="guestCount" placeholder="e.g. 150" min="1" value={form.guestCount} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Estimated Budget (₹)</label>
                <input type="number" name="budget" placeholder="e.g. 50000" value={form.budget} onChange={handleChange} />
              </div>
            </div>

            <div className="form-section-title" style={{ marginTop: 12 }}>Menu &amp; Preferences</div>

            <div className="form-group">
              <label>Cuisine Type</label>
              <select name="cuisine" value={form.cuisine} onChange={handleChange}>
                <option value="">Select cuisine style</option>
                <option>Kerala Traditional</option>
                <option>North Indian</option>
                <option>Continental</option>
                <option>Multi-Cuisine</option>
                <option>Vegan / Vegetarian</option>
                <option>Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label>Additional Details</label>
              <textarea name="description" rows="4" placeholder="Any special requirements, dietary restrictions, setup preferences..." value={form.description} onChange={handleChange}></textarea>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Event for Approval"}
            </button>
          </form>

          <div className="post-sidebar">
            <div className="sidebar-card">
              <h3>What Happens Next?</h3>
              <div className="sidebar-steps">
                <div className="s-step"><span>01</span><p>Admin reviews your event within 24 hours</p></div>
                <div className="s-step"><span>02</span><p>Approved events go live for workers to see</p></div>
                <div className="s-step"><span>03</span><p>Workers apply — you select your team</p></div>
              </div>
            </div>
            <div className="sidebar-card tip-card">
              <h3>Tips for Best Results</h3>
              <ul>
                <li>Be specific about guest count and venue</li>
                <li>Mention any dietary requirements upfront</li>
                <li>Include your budget range for quicker matches</li>
                <li>Post at least 2 weeks before your event</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* My Events Section */}
      {myEvents.length > 0 && (
        <div className="my-events-section" style={{ marginTop: '60px' }}>
          <p className="section-sub">Manage</p>
          <h2 className="section-title">My <span>Events</span></h2>
          <div className="ornament"><div className="ornament-line"></div><div className="ornament-diamond"></div><div className="ornament-line"></div></div>
          
          <div className="events-grid" style={{ marginTop: '30px' }}>
            {myEvents.map(event => (
              <div className="event-card" key={event._id}>
                <div className="event-card-top">
                  <div className={`hc-status ${event.status === 'approved' ? 'approved' : 'pending'}`} style={{fontSize:'12px', padding:'4px 8px', borderRadius:'4px'}}>{event.status}</div>
                  <div className="event-date">{new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                </div>
                <h3 className="event-title">{event.title}</h3>
                <p className="event-location">📍 {event.location}</p>
                
                <div className="event-applicants" style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
                  <h4 style={{ marginBottom: '10px', fontSize: '14px', color: '#999' }}>Applicants ({event.applicants?.length || 0})</h4>
                  {event.applicants && event.applicants.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {event.applicants.map(worker => {
                        const isApproved = event.approvedWorkers?.some(w => (w._id || w) === worker._id);
                        const isRejected = event.rejectedWorkers?.some(w => (w._id || w) === worker._id);
                        
                        return (
                          <div key={worker._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a1a', padding: '10px', borderRadius: '6px' }}>
                            <div>
                              <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>
                                <a href={`/profile?id=${worker._id}`} style={{color: '#fff', textDecoration: 'none'}}>{worker.name}</a>
                              </div>
                              <div style={{ fontSize: '12px', color: '#bbb' }}>{worker.phone || worker.email}</div>
                              <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>Exp: {worker.experience || 'N/A'}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              {isApproved && <span style={{ color: '#4caf50', fontSize: '12px', fontWeight: 'bold' }}>✓ Approved</span>}
                              {isRejected && <span style={{ color: '#f44336', fontSize: '12px', fontWeight: 'bold' }}>✕ Rejected</span>}
                              {!isApproved && !isRejected && <span style={{ color: '#ff9800', fontSize: '12px', fontWeight: 'bold' }}>⏳ Pending</span>}
                              
                              <div style={{ display: 'flex', gap: '5px', marginLeft: '10px' }}>
                                {!isApproved && (
                                  <button 
                                    onClick={() => handleApproveWorker(event._id, worker._id)}
                                    disabled={approving === worker._id}
                                    style={{ background: '#4caf50', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                                  >
                                    {approving === worker._id ? "..." : "Approve"}
                                  </button>
                                )}
                                {!isRejected && (
                                  <button 
                                    onClick={() => handleRejectWorker(event._id, worker._id)}
                                    disabled={approving === worker._id}
                                    style={{ background: '#f44336', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}
                                  >
                                    {approving === worker._id ? "..." : "Reject"}
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p style={{ fontSize: '13px', color: '#666' }}>No workers have applied yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostEvent;
