import { useEffect, useMemo, useRef, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import "./Notifications.css";

const typeStyles = {
  GENERAL: "general",
  BOOKING: "booking",
  BOOKING_APPROVED: "booking",
  BOOKING_REJECTED: "booking",
  BOOKING_DECISION: "booking",
  TICKET: "ticket",
  TICKET_CREATED: "ticket",
  TICKET_ASSIGNED: "ticket",
  TICKET_RESOLVED: "ticket",
  TICKET_REJECTED: "ticket",
  TICKET_STATUS_CHANGED: "ticket",
  TICKET_COMMENT: "ticket",
  RESOURCE: "resource",
  AUTH: "auth",
};

function normalizeEmail(email) {
  return email?.trim()?.toLowerCase?.() || "";
}

export default function NotificationsPage() {
  const { user, refreshUnreadNotificationCount } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const cacheRef = useRef(new Map());
  const requestIdRef = useRef(0);

  const userEmail = normalizeEmail(user?.email);

  useEffect(() => {
    let isMounted = true;
    const currentRequestId = ++requestIdRef.current;

    const loadNotifications = async () => {
      if (!userEmail) {
        setNotifications([]);
        setLoading(false);
        refreshUnreadNotificationCount('');
        return;
      }

      const cachedNotifications = cacheRef.current.get(userEmail);
      if (cachedNotifications) {
        setNotifications(cachedNotifications);
        setLoading(false);
      } else {
        setLoading(true);
      }

      setError("");

      const getNotificationsForUser = async (email) => {
        const response = await api.get(`/notifications/user/${encodeURIComponent(email)}`);
        return response.data?.data || [];
      };

      try {
        const primaryNotifications = await getNotificationsForUser(userEmail);

        if (!isMounted || requestIdRef.current !== currentRequestId) {
          return;
        }
        cacheRef.current.set(userEmail, primaryNotifications);
        setNotifications(primaryNotifications);
        refreshUnreadNotificationCount(userEmail);
      } catch (err) {
        if (!isMounted || requestIdRef.current !== currentRequestId) {
          return;
        }

        console.error("Error fetching notifications:", err);
        setNotifications([]);
        setError("Unable to load notifications right now.");
      } finally {
        if (isMounted && requestIdRef.current === currentRequestId) {
          setLoading(false);
        }
      }
    };

    loadNotifications();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  const filteredNotifications = useMemo(() => {
    const sortedNotifications = [...notifications].sort((first, second) => {
      const firstTime = first.createdAt ? new Date(first.createdAt).getTime() : 0;
      const secondTime = second.createdAt ? new Date(second.createdAt).getTime() : 0;
      return secondTime - firstTime;
    });

    if (activeFilter === "ALL") return sortedNotifications;
    if (activeFilter === "UNREAD") {
      return sortedNotifications.filter((item) => !(item.isRead ?? item.read));
    }
    if (activeFilter === "READ") {
      return sortedNotifications.filter((item) => item.isRead ?? item.read);
    }
    return sortedNotifications;
  }, [notifications, activeFilter]);

  const unreadCount = notifications.filter((item) => !(item.isRead ?? item.read)).length;
  const readCount = notifications.filter((item) => item.isRead ?? item.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) => {
        const nextItems = prev.map((item) => (item.id === id ? { ...item, isRead: true, read: true } : item));
        cacheRef.current.set(userEmail, nextItems);
        return nextItems;
      });
      refreshUnreadNotificationCount(userEmail);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      setError("Unable to mark notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put(`/notifications/user/${userEmail}/read-all`);
      setNotifications((prev) => {
        const nextItems = prev.map((item) => ({ ...item, isRead: true, read: true }));
        cacheRef.current.set(userEmail, nextItems);
        return nextItems;
      });
      refreshUnreadNotificationCount(userEmail);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      setError("Unable to mark all notifications as read.");
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => {
        const nextItems = prev.filter((item) => item.id !== id);
        cacheRef.current.set(userEmail, nextItems);
        return nextItems;
      });
      refreshUnreadNotificationCount(userEmail);
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError("Unable to delete notification.");
    }
  };

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

  const getEntityLabel = (notification) => {
    if (!notification.relatedEntityType && !notification.relatedEntityId) {
      return "";
    }

    const entityType = notification.relatedEntityType || "UPDATE";
    const entityId = notification.relatedEntityId || "";
    return `${entityType}${entityId ? ` • ${entityId}` : ""}`;
  };

  return (
    <div className="notifications-page">
      <div className="notifications-shell">
        <div className="notifications-hero">
          <h1>Notifications</h1>
          <p>Manage your latest updates and unread alerts.</p>
        </div>

        <div className="notifications-stats">
          <div className="notifications-stat-card">
            <div className="notifications-card-icon total">Read</div>
            <div className="notifications-card-number">{readCount}</div>
            <div className="notifications-card-label">Read Notifications</div>
          </div>

          <div className="notifications-stat-card">
            <div className="notifications-card-icon unread">Unread</div>
            <div className="notifications-card-number">{unreadCount}</div>
            <div className="notifications-card-label">Unread Notifications</div>
          </div>
        </div>

        <div className="notifications-filters">
          <div className="notifications-filter-group">
            {["ALL", "UNREAD", "READ"].map((filter) => (
              <button
                className={`notifications-filter ${activeFilter === filter ? "active" : ""}`}
                key={filter}
                onClick={() => setActiveFilter(filter)}
              >
                {filter === "ALL"
                  ? "All"
                  : filter === "UNREAD"
                  ? "Unread"
                  : "Read"}
              </button>
            ))}
          </div>

          <button
            className="notifications-secondary-action"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
            type="button"
          >
            Mark All as Read
          </button>
        </div>

        <div className="notifications-panel">
          {error ? <div className="notifications-error">{error}</div> : null}

          {loading ? (
            <div className="notifications-skeletons">
              {[1, 2, 3].map((item) => (
                <div className="notifications-skeleton-card" key={item}>
                  <div className="notifications-skeleton-line notifications-skeleton-line-short" />
                  <div className="notifications-skeleton-line notifications-skeleton-line-long" />
                  <div className="notifications-skeleton-line notifications-skeleton-line-tag" />
                </div>
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="notifications-empty">
              <div className="notifications-empty-icon">0</div>
              <h2 className="notifications-empty-title">No notifications found</h2>
              <p style={{ marginTop: "10px" }}>
                {notifications.length === 0
                  ? "There are no notifications for this user yet."
                  : "No items match this filter right now."}
              </p>
            </div>
          ) : (
            <div className="notifications-list">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-card ${(notification.isRead ?? notification.read) ? "read" : "unread"}`}
                >
                  <div className="notification-main">
                    <div className="notification-meta">
                      <span className={`notification-type ${typeStyles[notification.type] || "general"}`}>
                        {notification.type || "GENERAL"}
                      </span>
                      <span className="notification-time">{formatTime(notification.createdAt)}</span>
                    </div>
                    <div className="notification-message">
                      {notification.title || notification.message}
                    </div>
                    {notification.title ? (
                      <div className="notification-description">{notification.message}</div>
                    ) : null}
                    {getEntityLabel(notification) ? (
                      <div className="notification-entity-tag">{getEntityLabel(notification)}</div>
                    ) : null}
                    <span
                      className={`notification-status ${(notification.isRead ?? notification.read) ? "read" : "unread"}`}
                    >
                      {(notification.isRead ?? notification.read) ? "Read" : "Unread"}
                    </span>
                  </div>

                  <div className="notification-actions">
                    {!(notification.isRead ?? notification.read) && (
                      <button
                        className="notification-action"
                        onClick={() => handleMarkAsRead(notification.id)}
                        type="button"
                      >
                        Mark as Read
                      </button>
                    )}
                    <button
                      className="notifications-secondary-action"
                      onClick={() => handleDeleteNotification(notification.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
