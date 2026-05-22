import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/axios";
import "./AuthTheme.css";

export default function AdminDashboard({ adminUser, onBackToLogin, onGoHome }) {
  const usersSectionRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [usersRes, userCountRes, notificationsRes, unreadRes] = await Promise.all([
          api.get("/auth/admin/users"),
          api.get("/auth/admin/users/count"),
          api.get("/notifications"),
          api.get("/notifications/count-unread"),
        ]);

        if (!isMounted) {
          return;
        }

        const nextUsers = usersRes.data.data || [];
        setUsers(nextUsers);
        setUserCount(userCountRes.data.data ?? nextUsers.length);
        const nextNotifications = notificationsRes.data.data || [];
        setNotifications(nextNotifications);
        setUnreadCount(unreadRes.data.data ?? 0);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        console.error("Admin dashboard load failed:", loadError);
        setUsers([]);
        setUserCount(0);
        setNotifications([]);
        setUnreadCount(0);
        setError("Unable to load live admin dashboard data right now.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const recentNotifications = useMemo(
    () =>
      [...notifications]
        .sort((first, second) => {
          const firstTime = first.createdAt ? new Date(first.createdAt).getTime() : 0;
          const secondTime = second.createdAt ? new Date(second.createdAt).getTime() : 0;
          return secondTime - firstTime;
        })
        .slice(0, 4),
    [notifications]
  );

  const firstName = adminUser?.name?.split(" ")?.[0] || "Admin";
  const readCount = Math.max(notifications.length - unreadCount, 0);
  const visibleUsers = users.filter((item) => item.role !== "ADMIN");
  const stats = [
    { label: "Total Users", value: userCount, accent: "#7c3aed" },
    { label: "Total Notifications", value: notifications.length, accent: "#1d9e75" },
    { label: "Unread Alerts", value: unreadCount, accent: "#d97706" },
    { label: "Read Updates", value: readCount, accent: "#2563eb" },
  ];

  const formatTime = (createdAt) => {
    if (!createdAt) {
      return "Recently";
    }

    const date = new Date(createdAt);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleString();
  };

  return (
    <div className="admin-shell">
      <div className="admin-workspace">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-brand">
            <div className="admin-sidebar-logo">A</div>
            <div>
              <div className="admin-sidebar-kicker">Smart Campus</div>
              <div className="admin-sidebar-title">Admin Hub</div>
            </div>
          </div>

          <div className="admin-sidebar-card">
            <div className="admin-user-label">Signed in as</div>
            <div className="admin-user-name">{adminUser?.name || "Administrator"}</div>
            <div className="admin-user-email">{adminUser?.email}</div>
            <div className="admin-user-role">{adminUser?.role || "ADMIN"}</div>
          </div>

          <div className="admin-panel-card admin-sidebar-users" ref={usersSectionRef}>
            <div className="admin-panel-header">
              <h2 className="auth-section-title">Current Users</h2>
            </div>

            {loading ? (
              <div className="admin-user-list compact">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="admin-user-item admin-user-item-skeleton compact">
                    <div className="admin-user-avatar">U</div>
                    <div className="admin-user-copy">
                      <div className="admin-user-name-row">Loading user...</div>
                      <div className="admin-user-email-row">Preparing current user data</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : visibleUsers.length > 0 ? (
              <div className="admin-user-list compact">
                {visibleUsers.map((item) => (
                  <div key={item.id || item.email} className="admin-user-item compact">
                    <div className="admin-user-avatar">
                      {(item.name || item.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="admin-user-copy">
                      <div className="admin-user-name-row">{item.name || "Unnamed User"}</div>
                      <div className="admin-user-email-row">
                        {item.email || "No email available"}
                      </div>
                      <div className="admin-user-meta inline">
                        <span className="admin-user-role-badge">{item.role || "USER"}</span>
                        <span className="admin-user-provider">{item.provider || "LOCAL"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty-state compact">
                <div className="admin-empty-title">No users found</div>
                <div className="admin-empty-text">
                  There are no users available to display right now.
                </div>
              </div>
            )}
          </div>

        </aside>

        <div className="admin-container">
          <section className="admin-hero">
            <div>
              <div className="admin-badge">ADMIN PORTAL</div>
              <h1 className="auth-dashboard-title">Welcome back, {firstName}</h1>
              <p className="admin-hero-text">
                Review notification health, recent activity, and your admin
                account summary from one workspace.
              </p>
            </div>

            <div className="admin-hero-actions">
              <button
                type="button"
                className="admin-secondary-btn admin-inline-btn"
                onClick={onGoHome}
              >
                Go Home
              </button>
              <button
                type="button"
                className="admin-secondary-btn admin-inline-btn"
                onClick={onBackToLogin}
              >
                Back to Login
              </button>
            </div>
          </section>

          <section className="admin-stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="admin-stat-card">
                <div className="admin-stat-dot" style={{ background: stat.accent }} />
                <div className="auth-stat-value">{stat.value}</div>
                <div className="admin-stat-label">{stat.label}</div>
              </div>
            ))}
          </section>

          <section className="admin-content-grid admin-content-grid-single">
            <div className="admin-panel-card admin-activity-panel">
              <div className="admin-panel-header">
                <h2 className="auth-section-title">Recent Admin Activity</h2>
              </div>
              {error ? <div className="auth-error admin-inline-error">{error}</div> : null}

              {loading ? (
                <div className="admin-activity-list">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="admin-activity-item admin-activity-item-skeleton">
                      <div className="admin-activity-dot" />
                      <div className="admin-activity-text">Loading latest admin activity...</div>
                    </div>
                  ))}
                </div>
              ) : recentNotifications.length > 0 ? (
                <div className="admin-activity-list">
                  {recentNotifications.map((item) => (
                    <div key={item.id} className="admin-activity-item">
                      <div className="admin-activity-dot" />
                      <div className="admin-activity-copy">
                        <div className="admin-activity-text">{item.title || item.message}</div>
                        {item.title ? (
                          <div className="admin-activity-subtext">{item.message}</div>
                        ) : null}
                        <div className="admin-activity-meta">
                          <span className={`admin-activity-pill ${(item.read ?? item.isRead) ? "read" : "unread"}`}>
                            {(item.read ?? item.isRead) ? "Read" : "Unread"}
                          </span>
                          <span>{formatTime(item.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="admin-empty-state">
                  <div className="admin-empty-title">No recent notifications</div>
                  <div className="admin-empty-text">
                    This admin account does not have recent notification activity yet.
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
