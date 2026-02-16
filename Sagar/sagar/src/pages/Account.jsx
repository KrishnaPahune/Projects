import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import "./Account.css";

function Account({ goBack, goToLogin }) {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [showWelcome, setShowWelcome] = useState(true);

  // 🔒 Protect page
  if (!user) {
    goToLogin();
    return null;
  }

  // Hide welcome message after 3 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    if (!formData.name.trim()) {
      showToast("Name is required", "error");
      return;
    }
    // Update user data
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
    showToast("Profile updated successfully!", "success");
  };

  const getInitials = () => {
    const name = formData.name || user.email;
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    { label: "Total Orders", value: "0", icon: "📦" },
    { label: "Saved Addresses", value: "0", icon: "📍" },
    { label: "Wishlist Items", value: "0", icon: "❤️" },
  ];

  return (
    <div className="account-page">
      {showWelcome && (
        <div className="welcome-banner">
          <p>👋 Welcome back, {formData.name || user.email.split("@")[0]}!</p>
        </div>
      )}

      <div className="account-container">
        {/* Back Button */}
        <button className="account-back-btn" onClick={goBack} title="Go back">
          ← Back
        </button>

        {/* Header with Profile Card */}
        <div className="account-header">
          <div className="profile-card">
            <div className="profile-avatar">{getInitials()}</div>
            <div className="profile-info">
              <h1>{formData.name || "Welcome!"}</h1>
              <p className="profile-email">{user.email}</p>
              <div className="profile-stats">
                {stats.map((stat, idx) => (
                  <div key={idx} className="stat-item">
                    <span className="stat-icon">{stat.icon}</span>
                    <div>
                      <div className="stat-value">{stat.value}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="account-main">
          {/* Navigation Tabs */}
          <div className="account-tabs">
            <button
              className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              👤 Profile
            </button>
            <button
              className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              📦 Orders
            </button>
            <button
              className={`tab-button ${activeTab === "address" ? "active" : ""}`}
              onClick={() => setActiveTab("address")}
            >
              📍 Addresses
            </button>
            <button
              className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              ⚙️ Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="account-content">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>Profile Information</h2>
                  {!isEditing && (
                    <button
                      className="edit-button"
                      onClick={() => setIsEditing(true)}
                    >
                      ✏️ Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleEditChange}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleEditChange}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Address</label>
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleEditChange}
                        placeholder="Enter your address"
                        rows="3"
                      />
                    </div>
                    <div className="form-actions">
                      <button
                        className="save-button"
                        onClick={handleSaveProfile}
                      >
                        💾 Save Changes
                      </button>
                      <button
                        className="cancel-button"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user?.name || "",
                            phone: user?.phone || "",
                            address: user?.address || "",
                          });
                        }}
                      >
                        ✕ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="profile-details">
                    <div className="detail-item">
                      <span className="detail-label">📧 Email:</span>
                      <span className="detail-value">{user.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">👤 Name:</span>
                      <span className="detail-value">
                        {formData.name || "Not provided"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📱 Phone:</span>
                      <span className="detail-value">
                        {formData.phone || "Not provided"}
                      </span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">📮 Address:</span>
                      <span className="detail-value">
                        {formData.address || "Not provided"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="tab-content">
                <h2>Your Orders</h2>
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>You haven't placed any orders yet.</p>
                  <p className="empty-hint">Start shopping to see your orders here!</p>
                  <a href="/" className="cta-button">
                    🛍️ Continue Shopping
                  </a>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "address" && (
              <div className="tab-content">
                <div className="content-header">
                  <h2>Saved Addresses</h2>
                  <button className="add-button">+ Add New Address</button>
                </div>
                <div className="empty-state">
                  <div className="empty-icon">📍</div>
                  <p>No saved addresses yet.</p>
                  <p className="empty-hint">Add an address for faster checkout!</p>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="tab-content">
                <h2>Account Settings</h2>
                <div className="settings-group">
                  <h3>Notifications</h3>
                  <div className="setting-item">
                    <div>
                      <p className="setting-title">Email Notifications</p>
                      <p className="setting-desc">
                        Receive updates about orders and promotions
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <div>
                      <p className="setting-title">Marketing Emails</p>
                      <p className="setting-desc">
                        Get exclusive deals and offers
                      </p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-group">
                  <h3>Security</h3>
                  <button className="change-password-btn">
                    🔐 Change Password
                  </button>
                </div>

                <div className="settings-group danger-zone">
                  <h3>Danger Zone</h3>
                  <button className="delete-account-btn">
                    🗑️ Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className="account-footer">
          <button
            className="logout-button"
            onClick={() => {
              logout();
              showToast("Logged out successfully!", "success");
              goBack();
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Account;
