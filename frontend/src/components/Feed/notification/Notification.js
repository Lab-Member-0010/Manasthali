import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import * as styles from "./Notification.styles";

const BASE_URL = import.meta.env.VITE_API_URL;
 
const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const userId = useSelector((state) => state?.user?.user?._id);
  const token = useSelector((state) => state?.user?.token);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications for User ID:", userId);
        const response = await axios.get(
          `${BASE_URL}/notifications/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Fetched Notifications:", response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (userId && token) {
      fetchNotifications();
    }
  }, [userId, token]);

  return (
    <div style={styles.notificationContainer}>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            style={notification.read_status ? styles.notificationItem : {...styles.notificationItem, ...styles.unread}}
          >
            <div style={styles.notificationIcon}>🔔</div>
            <div style={styles.notificationText}>
              <p>
                <strong>{notification.notification_type}</strong> from{" "}
                {notification.sender_id}
              </p>
              <span style={styles.notificationTime}>
                {new Date(notification.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NotificationComponent;
