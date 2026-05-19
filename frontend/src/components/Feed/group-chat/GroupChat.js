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

  useEffect(() => {
    const fetchGroupList = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroupList(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroupList();
  }, [token]);

  useEffect(() => {
    socket.current = io(BASE_URL);
    if (selectedGroup) {
      socket.current.emit('join_group', selectedGroup._id);
    }

    socket.current.on('new_group_message', (newMessage) => {
      if (selectedGroup && newMessage.groupId === selectedGroup._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/messages/${selectedGroup._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages(response.data.messages);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
      fetchMessages();
    }
  }, [selectedGroup, token]);

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleSendMessage = async () => {
    if (!selectedGroup || !message.trim()) {
      alert('Please select a group and enter a message.');
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/messages/send`, {
        groupId: selectedGroup._id,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.current.emit('send_group_message', response.data.newMessage);
      setMessages((prevMessages) => [...prevMessages, response.data.newMessage]);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
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
            <h2>Groups</h2>
          </div>
          <div style={styles.groupList}>
            {groupList.map((group) => (
              <div
                style={styles.groupItem}
                key={group._id}
                onClick={() => handleSelectGroup(group)}
              >
                <p style={styles.groupName}>{group.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={styles.chatPanel}>
        {selectedGroup ? (
          <div style={styles.chatBox}>
            <div style={styles.chatHeader}>
              <h3>{selectedGroup.name}</h3>
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
                      }}
                    >
                      <p>{msg.message}</p>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
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
            <p>Please select a group to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
