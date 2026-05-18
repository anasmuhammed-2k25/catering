import React, { useState, useEffect } from "react";
import "./WorkerList.css";

const WorkerList = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/workers");
        const data = await res.json();
        setWorkers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  return (
    <div className="page-wrapper workers-list-page">
      <p className="section-sub">Our Professionals</p>
      <h1 className="section-title">Catering <span>Crew</span></h1>
      <div className="ornament">
        <div className="ornament-line"></div>
        <div className="ornament-diamond"></div>
        <div className="ornament-line"></div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading crew members...</p>
        </div>
      ) : workers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <h3>No Workers Found</h3>
          <p>There are no approved workers available at the moment.</p>
        </div>
      ) : (
        <div className="workers-grid">
          {workers.map((worker) => (
            <div className="worker-card" key={worker._id}>
              <div className="worker-avatar">
                {worker.name.charAt(0).toUpperCase()}
              </div>
              <h3 className="worker-name">{worker.name}</h3>
              <p className="worker-role">Professional Catering Staff</p>
              
              <div className="worker-details">
                {worker.experience && (
                  <div className="detail-item experience-item">
                    <span>⭐ {worker.experience}</span>
                  </div>
                )}
                {worker.bio && (
                  <p className="worker-bio">"{worker.bio}"</p>
                )}
                {worker.phone && (
                  <div className="detail-item">
                    <span>📞 {worker.phone}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span>✉️ {worker.email}</span>
                </div>
              </div>

              <div className="worker-card-footer">
                <span className="worker-status badge-approved">✓ Verified</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerList;
