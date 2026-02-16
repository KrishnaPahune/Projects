import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Auth.css";

function Register({ goBack, setPage }) {
  const { register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    register(email, password);
    goBack();
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-side">
          <h3>Join us</h3>
          <p>Create your account to get personalized recommendations and special offers.</p>
        </div>

        <div className="auth-card">
          <div className="auth-header">
            <div className="logo">Sagar</div>
            <div className="brand-sub">Fast — Reliable — Friendly</div>
          </div>

          <h2>Create Account</h2>

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

          <button className="auth-btn" onClick={handleRegister}>
            Register
          </button>

          <div className="auth-footer">
            Already have an account? <span onClick={goBack}>Login</span>
          </div>

          <div className="auth-divider">Or</div>

          <button 
            className="guest-btn" 
            onClick={() => setPage && setPage("home")}
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
