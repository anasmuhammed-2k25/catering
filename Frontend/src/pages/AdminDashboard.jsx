import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
const apiUrl = import.meta.env.VITE_API_URL;


const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState("events");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [evRes, usrRes] = await Promise.all([
          fetch(`${apiUrl}/api/admin/events`, { headers }),
          fetch(`${apiUrl}/api/admin/users`, { headers }),
        ]);
        const [evData, usrData] = await Promise.all([evRes.json(), usrRes.json()]);
        setEvents(evData);
        setUsers(usrData);
      } catch { }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const handleEventAction = async (id, action) => {
    setActionLoading(id + action);
    try {
      const res = await fetch(`${apiUrl}/api/admin/events/${id}/${action}`, { method: "PUT", headers });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => e._id === id ? { ...e, status: action === "approve" ? "approved" : "rejected" } : e)
        );
      }
    } catch { }
    finally { setActionLoading(null); }
  };

  const handleUserAction = async (id, action) => {
    setActionLoading("user" + id + action);
    try {
      const res = await fetch(`${apiUrl}/api/admin/users/${id}/${action}`, { method: "PUT", headers });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => u._id === id ? { ...u, status: action === "approve" ? "approved" : "rejected" } : u)
        );
      }
    } catch { }
    finally { setActionLoading(null); }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Remove this user?")) return;
    try {
      const res = await fetch(`${apiUrl}/api/admin/users/${id}`, { method: "DELETE", headers });
      if (res.ok) setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch { }
  };

  const stats = {
    total: events.length,
    pending: events.filter((e) => e.status === "pending").length,
    approved: events.filter((e) => e.status === "approved").length,
    rejected: events.filter((e) => e.status === "rejected").length,
  };

  return (
    <div className="page-wrapper admin-page">
      <p className="section-sub">Control Center</p>
      <h1 className="section-title">Admin <span>Dashboard</span></h1>
      <div className="ornament"><div className="ornament-line"></div><div className="ornament-diamond"></div><div className="ornament-line"></div></div>

      {/* Stats */}
      <div className="admin-stats">
        {[
          { label: "Total Events", value: stats.total },
          { label: "Pending Review", value: stats.pending, highlight: true },
          { label: "Approved", value: stats.approved },
          { label: "Total Users", value: users.length },
        ].map((s, i) => (
          <div className={`admin-stat ${s.highlight ? "highlight" : ""}`} key={i}>
            <div className="admin-stat-value">{s.value}</div>
            <div className="admin-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button className={`admin-tab ${tab === "events" ? "active" : ""}`} onClick={() => setTab("events")}>
          Events {stats.pending > 0 && <span className="tab-badge">{stats.pending}</span>}
        </button>
        <button className={`admin-tab ${tab === "users" ? "active" : ""}`} onClick={() => setTab("users")}>
          Users
        </button>
      </div>

      {loading ? (
        <div className="loading-state"><div className="loading-spinner"></div><p>Loading...</p></div>
      ) : tab === "events" ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Date</th>
                <th>City</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id}>
                  <td className="td-title">{ev.title}</td>
                  <td>{ev.customer?.name || "—"}</td>
                  <td>{ev.customer?.phone || "—"}</td>
                  <td>{ev.date ? new Date(ev.date).toLocaleDateString("en-IN") : "—"}</td>
                  <td>{ev.city}</td>
                  <td>{ev.guestCount}</td>
                  <td><span className={`badge badge-${ev.status}`}>{ev.status}</span></td>
                  <td>
                    {ev.status === "pending" && (
                      <div className="action-btns">
                        <button
                          className="action-btn approve"
                          onClick={() => handleEventAction(ev._id, "approve")}
                          disabled={!!actionLoading}
                        >
                          {actionLoading === ev._id + "approve" ? "..." : "Approve"}
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => handleEventAction(ev._id, "reject")}
                          disabled={!!actionLoading}
                        >
                          {actionLoading === ev._id + "reject" ? "..." : "Reject"}
                        </button>
                      </div>
                    )}
                    {ev.status !== "pending" && <span className="action-done">—</span>}
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan="8" className="empty-row">No events found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="td-title">{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge role-badge-${u.role}`}>{u.role}</span></td>
                  <td>{u.phone || "—"}</td>
                  <td>
                    {u.role === "worker" ? <span className={`badge badge-${u.status || "pending"}`}>{u.status || "pending"}</span> : <span className="badge badge-approved">Approved</span>}
                  </td>
                  <td>
                    {u.role === "worker" && (u.status === "pending" || !u.status) && (
                      <div className="action-btns" style={{ marginBottom: "5px" }}>
                        <button
                          className="action-btn approve"
                          onClick={() => handleUserAction(u._id, "approve")}
                          disabled={!!actionLoading}
                        >
                          {actionLoading === "user" + u._id + "approve" ? "..." : "Approve"}
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={() => handleUserAction(u._id, "reject")}
                          disabled={!!actionLoading}
                        >
                          {actionLoading === "user" + u._id + "reject" ? "..." : "Reject"}
                        </button>
                      </div>
                    )}
                    <button className="action-btn reject" onClick={() => handleDeleteUser(u._id)}>Remove</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr><td colSpan="5" className="empty-row">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
