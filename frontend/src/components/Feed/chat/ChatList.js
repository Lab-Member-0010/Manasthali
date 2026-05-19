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
    fetchDMList();
  }, [userId, token]);

  useEffect(() => {
    socket.current = io(BASE_URL);
    socket.current.emit('join', userId);

    socket.current.on('new_message', (newMessage) => {
      if (selectedUser && (newMessage.sender === selectedUser._id || newMessage.receiver === selectedUser._id)) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userId, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/message/${selectedUser._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages(response.data.messages);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
      fetchMessages();
    }
  }, [selectedUser, token]);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) {
      alert('Please select a user and enter a message.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/message/send`, {
        receiverId: selectedUser._id,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.current.emit('send_message', response.data.newMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        response.data.newMessage,
      ]);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await axios.post(`${BASE_URL}/message/read`, {
        messageId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
      console.log(response.data.message);
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
    setEmojiPickerVisible(false);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible((prev) => !prev);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={styles.chatContainer}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarWrapper}>
          <div style={styles.sidebarHeader}>
            <h2>Chats</h2>
          </div>

          <div style={styles.userList}>
            {dmList.map((user) => (
              <div
                style={styles.userItem}
                key={user._id}
                onClick={() => handleSelectUser(user)}
              >
                <img
                  src={user.profile_picture ? `${user.profile_picture}` : '/user.png'}
                  alt="user"
                  style={styles.userImg}
                />
                <div>
                  <p style={styles.username}>{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={styles.chatPanel}>
        {selectedUser ? (
          <div style={styles.chatBox}>
            <div style={styles.chatHeader}>
              <img
                src={selectedUser.profile_picture ? `${selectedUser.profile_picture}` : '/user.png'}
                alt={selectedUser.username}
                style={{ ...styles.chatUserImg, width: "70px", height: "70px" }}
              />
              <h3>{selectedUser.username}</h3>
            </div>
            <div style={styles.chatBody}>
              {messages.length === 0 ? (
                <p>No messages yet. Start the conversation!</p>
              ) : (
                <div style={styles.messageList}>
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      style={{
                        ...styles.message,
                        ...(msg.sender === userId ? styles.sent : styles.received),
                        ...(msg.read ? styles.read : styles.unread),
                      }}
                      onClick={() => !msg.read && handleMarkAsRead(msg._id)}
                    >
                      <p>{msg.message}</p><br />
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={styles.newMessage}>
              {/* Emoji Button */}
              <button style={styles.emojiButton} onClick={toggleEmojiPicker}>
                <EmojiEmotionsOutlinedIcon />
              </button>

              {/* Message Textarea */}
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                style={styles.textArea}
              />

              {/* Emoji Picker */}
              {emojiPickerVisible && (
                <div style={styles.emojiPickerContainer}>
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              {/* Send Button */}
              <button style={styles.sentbutton} onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <div style={styles.noChatSelected}>
            <p>Please select a user to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
