import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminDashboard from "./AdminDashboard";
import { useAuth } from "../../context/AuthContext";
import { BACKEND_URL } from "../../config/api";
import "./AuthTheme.css";

const ADMIN_ROUTE_MAP = {
  "dewdunuc1990@gmail.com": "/bookings/admin",
  "nethmimindula@gmail.com": "/admin",
  "pamudithajayasena@gmail.com": "/tickets/admin",
  "pamudithajayasena@gmail.comm": "/tickets/admin",
};

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export default function AuthPage() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showAdmin, setShowAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminUser, setAdminUser] = useState(null);
  const [adminError, setAdminError] = useState("");

  useEffect(() => {
    document.body.classList.add("auth-page-active");

    return () => {
      document.body.classList.remove("auth-page-active");
    };
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/oauth2/authorization/google`;
  };

  const handleAdminLogin = async () => {
    try {
      setAdminError("");

      const normalizedEmail = normalizeEmail(adminEmail);

      const loginRes = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: normalizedEmail,
        password: adminPassword,
      });

      if (!loginRes.data.success) {
        setAdminError("Invalid admin email or password.");
        return;
      }

      const userRes = await axios.get(`${BACKEND_URL}/api/auth/me`, {
        params: { email: normalizedEmail },
      });

      if (!userRes.data.success) {
        setAdminError("Admin user not found.");
        return;
      }

      if (userRes.data.data.role !== "ADMIN") {
        setAdminError("This account does not have admin access.");
        return;
      }

      const nextAdminUser = userRes.data.data;
      setUser(nextAdminUser);

      const mappedRoute = ADMIN_ROUTE_MAP[normalizedEmail];
      if (mappedRoute) {
        navigate(mappedRoute);
        return;
      }

      setAdminUser(nextAdminUser);
    } catch (error) {
      setAdminError("Admin login failed. Please try again.");
      console.error(error);
    }
  };

  const handleBackToLogin = () => {
    setAdminUser(null);
    setAdminPassword("");
    setAdminError("");
    setShowPassword(false);
  };

  if (adminUser) {
    return (
      <AdminDashboard
        adminUser={adminUser}
        onBackToLogin={handleBackToLogin}
        onGoHome={() => navigate("/")}
      />
    );
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">A</div>

        <h1 className="auth-title">Smart Campus</h1>
        <p className="auth-subtitle">Operations Hub</p>

        <p className="auth-description">
          Sign in with your university Google account to access the campus
          management system.
        </p>

        <div className="auth-divider">
          <div className="auth-divider-line" />
          <span className="auth-divider-text">CONTINUE WITH</span>
          <div className="auth-divider-line" />
        </div>

        <button className="auth-google-btn" onClick={handleGoogleLogin}>
          G Sign in with Google
        </button>

        <p className="auth-admin-toggle">
          <span
            className="auth-admin-link"
            onClick={() => setShowAdmin(!showAdmin)}
          >
            {showAdmin ? "Hide Admin Login" : "System Administrator Login"}
          </span>
        </p>

        {showAdmin && (
          <div className="auth-admin-panel">
            <h3 className="auth-section-title">Admin Access</h3>

            {adminError ? <div className="auth-error">{adminError}</div> : null}

            <div className="auth-field">
              <label className="auth-label">Email</label>
              <input
                className="auth-input"
                type="email"
                placeholder="Admin Email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-password-wrap">
                <input
                  className="auth-input auth-password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button className="auth-admin-btn" onClick={handleAdminLogin}>
              Sign In as Admin
            </button>
          </div>
        )}

        <p className="auth-footer-note">
          Secured with OAuth 2.0 & JWT - IT3030 PAF Assignment 2026
        </p>
      </div>
    </div>
  );
}
