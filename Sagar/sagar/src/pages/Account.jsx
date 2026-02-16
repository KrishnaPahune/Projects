import React from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Account({ goBack }) {
  const { user, logout } = useAuth();

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-side">
          <h3>Your Account</h3>
          <p>Manage your profile, view orders and update preferences.</p>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">Sagar</div>
            <div className="brand-sub">Account</div>
          </div>

          <h2>Welcome</h2>

          <p style={{ color: "#374151", marginBottom: 12 }}>
            Logged in as <strong>{user?.email || "-"}</strong>
          </p>

          <button
            className="auth-btn"
            onClick={() => {
              logout();
              goBack();
            }}
          >
            Logout
          </button>

          <div className="auth-footer">
            <span onClick={goBack}>Back</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
