import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client';
import * as styles from './GroupChat.styles';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

const BASE_URL = import.meta.env.VITE_API_URL;

const GroupChat = () => {
  const [groupList, setGroupList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);
  const socket = useRef(null);

  // ── Fetch the groups this user is a member of ─────────────────────────────
  useEffect(() => {
    const fetchGroupList = async () => {
      try {
        // GET /groups/view/joinedList — returns groups the authenticated user has joined
        const response = await axios.get(`${BASE_URL}/groups/view/joinedList`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroupList(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchGroupList();
  }, [token]);

  // ── Socket.IO connection + group room join ────────────────────────────────
  useEffect(() => {
    socket.current = io(BASE_URL, { transports: ['websocket'] });

    if (selectedGroup) {
      socket.current.emit('join_group', selectedGroup._id);
    }

    // Receive real-time group messages from other members
    socket.current.on('new_group_message', (newMessage) => {
      if (selectedGroup && (
        newMessage.group?.toString() === selectedGroup._id ||
        newMessage.groupId?.toString() === selectedGroup._id
      )) {
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    return () => {
      if (selectedGroup) {
        socket.current.emit('leave_group', selectedGroup._id);
      }
      socket.current.disconnect();
    };
  }, [selectedGroup]);

  // ── Fetch message history for selected group ──────────────────────────────
  useEffect(() => {
    if (!selectedGroup) return;

    const fetchMessages = async () => {
      try {
        // GET /groupchat/:groupId — backend router mounted at /groupchat
        const response = await axios.get(`${BASE_URL}/groupchat/${selectedGroup._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Backend returns { data: messages }
        setMessages(response.data.data || []);
      } catch (err) {
        console.error("Error fetching group messages:", err);
      }
    };

    fetchMessages();
  }, [selectedGroup, token]);

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
    setMessages([]);
  };

  const handleSendMessage = async () => {
    if (!selectedGroup || !message.trim()) return;

    try {
      // POST /groupchat/send — backend router mounted at /groupchat
      const response = await axios.post(`${BASE_URL}/groupchat/send`, {
        groupId: selectedGroup._id,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Backend returns { message: '...', data: newMessage }
      const newMessage = response.data.data;

      // Relay to other group members via socket (excludes sender on backend)
      socket.current.emit('send_group_message', newMessage);

      // Add to sender's own message list immediately
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    } catch (err) {
      console.error('Error sending group message:', err);
    }
  };

  const handleMessageChange = (e) => setMessage(e.target.value);

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
    setEmojiPickerVisible(false);
  };

  const toggleEmojiPicker = () => setEmojiPickerVisible((prev) => !prev);

  // Helper: determine if a message was sent by the current user.
  // msg.sender can be a populated object OR a raw ObjectId string depending
  // on whether the message came from the API (populated) or from a socket relay.
  const isSentByMe = (msg) => {
    const senderId = msg.sender?._id?.toString() || msg.sender?.toString();
    return senderId === userId;
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading groups...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

  return (
    <div style={styles.chatContainer}>
      {/* ── Sidebar: group list ─────────────────────────────────────────── */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarWrapper}>
          <div style={styles.sidebarHeader}>
            <h2>Groups</h2>
          </div>
          <div style={styles.groupList}>
            {groupList.length === 0 ? (
              <p style={{ padding: '10px', color: '#888' }}>No groups joined yet.</p>
            ) : (
              groupList.map((group) => (
                <div
                  style={{
                    ...styles.groupItem,
                    ...(selectedGroup?._id === group._id ? { backgroundColor: '#e6c9f7' } : {}),
                  }}
                  key={group._id}
                  onClick={() => handleSelectGroup(group)}
                >
                  <p style={styles.groupName}>{group.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Main chat panel ─────────────────────────────────────────────── */}
      <div style={styles.chatPanel}>
        {selectedGroup ? (
          <div style={styles.chatBox}>
            <div style={styles.chatHeader}>
              <h3>{selectedGroup.name}</h3>
            </div>

            <div style={styles.chatBody}>
              {messages.length === 0 ? (
                <p style={{ padding: '10px', color: '#888' }}>
                  No messages yet. Start the conversation!
                </p>
              ) : (
                <div style={styles.messageList}>
                  {messages.map((msg, index) => (
                    <div
                      key={msg._id || index}
                      style={{
                        ...styles.message,
                        ...(isSentByMe(msg) ? styles.sent : styles.received),
                      }}
                    >
                      {!isSentByMe(msg) && (
                        <small style={{ color: '#7c4dab', fontWeight: 'bold', display: 'block', marginBottom: 2 }}>
                          {msg.sender?.username || 'Member'}
                        </small>
                      )}
                      <p>{msg.message}</p>
                      <span style={{ fontSize: '0.6rem', color: 'gray' }}>
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
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
            <p>Select a group to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
