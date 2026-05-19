import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PostEvent from "./pages/PostEvent";
import Workers from "./pages/Workers";
import WorkerList from "./pages/WorkerList";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import "./index.css";


const ProtectedRoute = ({ user, role, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

import Footer from "./components/Footer";

const App = () => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (!stored || stored === "undefined") return null;
      return JSON.parse(stored);
    } catch (error) {
      console.error("Error parsing user:", error);
      return null;
    }
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleUpdateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar user={user} onLogout={handleLogout} />

        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register onLogin={handleLogin} />} />
            <Route path="/workers" element={<Workers user={user} />} />
            <Route path="/our-workers" element={<WorkerList />} />
            <Route path="/post-event" element={<ProtectedRoute user={user} role="customer"><PostEvent user={user} /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute user={user} role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute user={user}><Profile user={user} onUpdateUser={handleUpdateUser} /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
};

export default App;