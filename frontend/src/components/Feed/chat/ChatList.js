import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client';
import * as styles from './ChatList.styles';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

const BASE_URL = import.meta.env.VITE_API_URL;

const MessageComponent = () => {
  const [dmList, setDmList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);
  const socket = useRef(null);

  // ── Fetch DM contact list ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchDMList = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/dmlist/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDmList(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch DM list');
      } finally {
        setLoading(false);
      }
    };
    if (userId && token) fetchDMList();
  }, [userId, token]);

  // ── Socket.IO: connect + join private room + listen for incoming DMs ──────
  useEffect(() => {
    if (!userId) return;

    socket.current = io(BASE_URL, { transports: ['websocket'] });

    // Join the user's own private room so the backend can deliver messages
    socket.current.emit('join', userId);

    // Receive DMs from other users in real time
    socket.current.on('new_message', (newMessage) => {
      // Only display if the open conversation matches the message participants
      if (
        selectedUser &&
        (newMessage.sender?.toString() === selectedUser._id ||
          newMessage.receiver?.toString() === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userId, selectedUser]);

  // ── Fetch message history for the selected conversation ───────────────────
  useEffect(() => {
    if (!selectedUser) return;

    const fetchMessages = async () => {
      try {
        // GET /message/:receiverId — returns conversation between authed user and receiver
        const response = await axios.get(`${BASE_URL}/message/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Backend returns 404 with { message: 'No messages found' } when empty — treat as []
        setMessages(response.data.messages || []);
      } catch (err) {
        if (err.response?.status === 404) {
          setMessages([]); // No messages yet — not an error
        } else {
          console.error("Error fetching messages:", err);
        }
      }
    };

    fetchMessages();
  }, [selectedUser, token]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) return;

    try {
      const response = await axios.post(`${BASE_URL}/message/send`, {
        receiverId: selectedUser._id,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const newMessage = response.data.newMessage;

      // Relay to the receiver's private room via socket (backend excludes sender)
      socket.current.emit('send_message', newMessage);

      // Add to sender's own message list immediately
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await axios.post(`${BASE_URL}/message/read`, { messageId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages((prev) =>
        prev.map((msg) => msg._id === messageId ? { ...msg, read: true } : msg)
      );
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setEmojiPickerVisible(false);
  };

  const toggleEmojiPicker = () => setEmojiPickerVisible((prev) => !prev);

  if (loading) return <div style={{ padding: '20px' }}>Loading chats...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={styles.chatContainer}>
      {/* ── Sidebar: contact list ───────────────────────────────────────── */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarWrapper}>
          <div style={styles.sidebarHeader}>
            <h2>Chats</h2>
          </div>

          <div style={styles.userList}>
            {dmList.length === 0 ? (
              <p style={{ padding: '10px', color: '#888' }}>No conversations yet.</p>
            ) : (
              dmList.map((user) => (
                <div
                  style={{
                    ...styles.userItem,
                    ...(selectedUser?._id === user._id ? { backgroundColor: '#e6c9f7' } : {}),
                  }}
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                >
                  <img
                    src={user.profile_picture || '/user.png'}
                    alt="user"
                    style={styles.userImg}
                  />
                  <div>
                    <p style={styles.username}>{user.username}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Main chat panel ─────────────────────────────────────────────── */}
      <div style={styles.chatPanel}>
        {selectedUser ? (
          <div style={styles.chatBox}>
            <div style={styles.chatHeader}>
              <img
                src={selectedUser.profile_picture || '/user.png'}
                alt={selectedUser.username}
                style={{ ...styles.chatUserImg, width: '70px', height: '70px' }}
              />
              <h3>{selectedUser.username}</h3>
            </div>

            <div style={styles.chatBody}>
              {messages.length === 0 ? (
                <p style={{ padding: '10px', color: '#888' }}>
                  No messages yet. Say hello!
                </p>
              ) : (
                <div style={styles.messageList}>
                  {messages.map((msg, index) => {
                    const sentByMe = msg.sender?.toString() === userId;
                    return (
                      <div
                        key={msg._id || index}
                        style={{
                          ...styles.message,
                          ...(sentByMe ? styles.sent : styles.received),
                          ...(msg.read ? styles.read : styles.unread),
                        }}
                        onClick={() => !msg.read && !sentByMe && handleMarkAsRead(msg._id)}
                      >
                        <p>{msg.message}</p>
                        <span style={{ fontSize: '0.6rem', color: 'gray', display: 'block', marginTop: 4 }}>
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div style={styles.newMessage}>
              <button style={styles.emojiButton} onClick={toggleEmojiPicker}>
                <EmojiEmotionsOutlinedIcon />
              </button>
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                style={styles.textArea}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              {emojiPickerVisible && (
                <div style={styles.emojiPickerContainer}>
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <button style={styles.sentbutton} onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <div style={styles.noChatSelected}>
            <p>Select a contact to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
