import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const styles = {
notificationContainer: {},
notificationItem: {},
unread: {},
notificationIcon: {},
notificationText: {},
notificationTime: {}
};


const BASE_URL = import.meta.env.VITE_API_URL;
 
const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = useSelector((state) => state?.user?.user?._id);
  const token = useSelector((state) => state?.user?.token);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/notifications/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userId && token) {
      fetchNotifications();
    }
  }, [userId, token]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${BASE_URL}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state immediately
      setNotifications((prev) =>
        prev.map((n) =>
          n._id === notificationId ? { ...n, read_status: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const getSenderDisplay = (notification) => {
    if (notification.sender_id && typeof notification.sender_id === "object") {
      return notification.sender_id.username || "Unknown";
    }
    return notification.sender_id || "Unknown";
  };

  const getSenderPicture = (notification) => {
    if (notification.sender_id && typeof notification.sender_id === "object") {
      return notification.sender_id.profile_picture || null;
    }
    return null;
  };

  return (
    <div style={styles.notificationContainer}>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            style={notification.read_status ? styles.notificationItem : {...styles.notificationItem, ...styles.unread}}
            onClick={() => !notification.read_status && handleMarkAsRead(notification._id)}
          >
            <div style={styles.notificationIcon}>
              {getSenderPicture(notification) ? (
                <img
                  src={getSenderPicture(notification)}
                  alt="Sender"
                  style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                "🔔"
              )}
            </div>
            <div style={styles.notificationText}>
              <p>
                <strong>{notification.notification_type}</strong> from{" "}
                {getSenderDisplay(notification)}
              </p>
              <span style={styles.notificationTime}>
                {new Date(notification.createdAt).toLocaleString()}
              </span>
              {!notification.read_status && (
                <span style={{ marginLeft: 8, color: '#6a1b9a', fontSize: 12, cursor: 'pointer' }}>
                  Mark as read
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationComponent;
