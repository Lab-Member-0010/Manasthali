import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client';
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

  if (loading) return <div className="p-5">Loading chats...</div>;
  if (error) return <div className="p-5 text-red-600">{error}</div>;

  return (
    <div className="flex h-full bg-gray-50 flex-wrap border border-black">
      {/* ── Sidebar: contact list ───────────────────────────────────────── */}
      <div className="w-1/5 p-5 fixed border-r border-gray-300">
        <div className="flex flex-col h-full">
          <div className="bg-white p-2.5 sticky top-0 z-10 text-2xl text-center text-purple-800">
            <h2>Chats</h2>
          </div>

          <div className="max-h-[520px] overflow-y-auto flex-1 p-2.5">
            {dmList.length === 0 ? (
              <p className="p-2.5 text-gray-500">No conversations yet.</p>
            ) : (
              dmList.map((user) => (
                <div
                  className={`flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${selectedUser?._id === user._id ? 'bg-blue-50' : ''}`}
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                >
                  <img
                    src={user.profile_picture || '/user.png'}
                    alt="user"
                    className="w-12 h-12 rounded-full object-cover border border-black"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{user.username}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Main chat panel ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 bg-white ml-[28%] h-full relative overflow-hidden">
        {selectedUser ? (
          <div>
            <div className="flex items-center px-4 py-2.5 sticky top-0 z-10 shadow w-full">
              <img
                src={selectedUser.profile_picture || '/user.png'}
                alt={selectedUser.username}
                className="w-16 h-16 rounded-full object-cover border border-black mr-3.5"
              />
              <h3>{selectedUser.username}</h3>
            </div>

            <div className="p-4 h-[460px] flex-1 overflow-y-auto flex flex-col max-h-[calc(100%-120px)]">
              {messages.length === 0 ? (
                <p className="p-2.5 text-gray-500">
                  No messages yet. Say hello!
                </p>
              ) : (
                <div className="flex flex-col w-full">
                  {messages.map((msg, index) => {
                    const sentByMe = msg.sender?.toString() === userId;
                    return (
                      <div
                        key={msg._id || index}
                        className={`p-2.5 rounded-lg mb-2.5 max-w-[80%] relative text-sm ${sentByMe ? 'self-end bg-gray-100 border border-gray-300 w-2/5' : 'self-start bg-purple-100 border border-gray-500 text-gray-500 w-2/5'} ${msg.read ? 'text-green-500' : 'text-black'}`}
                        onClick={() => !msg.read && !sentByMe && handleMarkAsRead(msg._id)}
                      >
                        <p>{msg.message}</p>
                        <span className="text-xs text-gray-500 block mt-1">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center px-5 py-2.5 bg-gray-100 sticky bottom-0 z-10 border border-purple-200 w-full">
              <button className="bg-transparent border-none text-2xl cursor-pointer mr-2.5 text-gray-600" onClick={toggleEmojiPicker}>
                <EmojiEmotionsOutlinedIcon />
              </button>
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                className="flex-1 h-10 p-2.5 rounded-full border border-purple-200 mr-2.5 text-base outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              {emojiPickerVisible && (
                <div className="absolute bottom-[70px] left-5 z-10 bg-white border border-purple-200 rounded-lg shadow">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <button className="bg-purple-400 text-white border-none rounded-full px-5 py-2.5 cursor-pointer text-base" onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <div className="text-center p-5 text-purple-600">
            <p>Select a contact to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;
