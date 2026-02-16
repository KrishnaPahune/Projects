import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Login({ goBack, goToRegister, setPage }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
  login(email, password);
  setPage("account");
};

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-side">
          <h3>Welcome back!</h3>
          <p>Sign in to access your account, track orders, and discover exclusive deals.</p>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">Sagar</div>
            <div className="brand-sub">Fast — Reliable — Friendly</div>
          </div>

          <h2>Login</h2>

          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="input-toggle"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="auth-btn" onClick={handleLogin}>
            Login
          </button>

          <div className="auth-footer">
            Don't have an account? <span onClick={goToRegister}>Register</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
