import React, { useState } from "react";
import "./AdminLogin.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e, retry = false) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // allow cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Authentication failed");
      }

      // Store token in localStorage for logout and subsequent requests
      localStorage.setItem("adminToken", data.access_token);

      // Verify session with Authorization header
      const verifyRes = await fetch(`${BACKEND_URL}/api/auth/verify`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${data.access_token}`,
        },
        credentials: "include",
      });

      if (!verifyRes.ok) {
        throw new Error("Failed to verify session");
      }

      const verifyData = await verifyRes.json();

      // Mark session for UI (we keep a small flag locally; real apps rely on server checks)
      localStorage.setItem("adminSession", "1");
      localStorage.setItem("adminEmail", verifyData.email || data.email);
      localStorage.setItem("adminName", verifyData.full_name || data.full_name);

      onLoginSuccess({
        adminId: verifyData.admin_id || data.admin_id,
        email: verifyData.email || data.email,
        fullName: verifyData.full_name || data.full_name,
      });

      // Update browser URL to admin area
      try {
        window.history.pushState({}, "", "/admin");
      } catch (e) {}
    } catch (err) {
      // network error may be transient; retry once
      if (!retry && err.message === "Failed to fetch") {
        console.warn("Initial fetch failed, retrying once...");
        return handleSubmit(e, true);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // When this component is shown, update the URL to a dedicated admin path
  React.useEffect(() => {
    try {
      window.history.pushState({}, "", "/admin/login");
    } catch (e) {}
  }, []);

  return (
    <div className="admin-login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🔐 Admin Panel</h1>
          <p>Sagar Electronics - Shop Management</p>
        </div>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@sagarelectronics.com"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">🔑 Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? "Authenticating..." : isRegistering ? "Create Account" : "Login"}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isRegistering ? "Already have an account?" : "No account yet?"}{" "}
            <button
              type="button"
              className="toggle-btn"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError("");
              }}
              disabled={loading}
            >
              {isRegistering ? "Login" : "Register"}
            </button>
          </p>
        </div>

        <div className="help-text">
          <p>💡 First-time setup? Create an account to get started.</p>
          <p>🔒 Use a strong password and keep it secure.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
