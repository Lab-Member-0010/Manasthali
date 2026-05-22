import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

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
    <div>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`flex items-center gap-3 p-4 border-b border-gray-100 ${notification.read_status ? 'bg-white' : 'bg-blue-50'}`}
            onClick={() => !notification.read_status && handleMarkAsRead(notification._id)}
          >
            <div className="flex-shrink-0">
              {getSenderPicture(notification) ? (
                <img
                  src={getSenderPicture(notification)}
                  alt="Sender"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                "🔔"
              )}
            </div>
            <div className="flex-1">
              <p>
                <strong>{notification.notification_type}</strong> from{" "}
                {getSenderDisplay(notification)}
              </p>
              <span className="text-xs text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </span>
              {!notification.read_status && (
                <span className="ml-2 text-purple-700 text-xs cursor-pointer">
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
