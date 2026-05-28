import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';

const BASE_URL = import.meta.env.VITE_API_URL;

const GroupChat = ({ preselectedGroup, onBackToGroups }) => {
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
        const groups = response.data;
        setGroupList(groups);
        // Auto-select preselected group if provided
        if (preselectedGroup) {
          const match = groups.find((g) => g._id === preselectedGroup._id);
          if (match) setSelectedGroup(match);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchGroupList();
  }, [token, preselectedGroup]);

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

  if (loading) return <div className="p-5">Loading groups...</div>;
  if (error) return <div className="p-5 text-red-600">{error}</div>;

  return (
    <div className="flex h-full bg-gray-50 flex-wrap border border-black">
      {/* ── Sidebar: group list ─────────────────────────────────────────── */}
      <div className="w-full md:w-1/5 p-5 md:fixed border-r border-gray-300">
        <div className="flex flex-col h-full">
          <div className="bg-white p-2.5 sticky top-0 z-10 text-2xl text-center text-purple-800">
            <h2>Groups</h2>
            {onBackToGroups && (
              <button
                onClick={onBackToGroups}
                className="text-sm text-blue-600 underline bg-transparent border-none cursor-pointer mt-1"
              >
                Back to Groups
              </button>
            )}
          </div>
          <div className="max-h-[520px] overflow-y-auto flex-1 p-2.5">
            {groupList.length === 0 ? (
              <p className="p-2.5 text-gray-500">No groups joined yet.</p>
            ) : (
              groupList.map((group) => (
                <div
                  className={`flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${selectedGroup?._id === group._id ? 'bg-blue-50' : ''}`}
                  key={group._id}
                  onClick={() => handleSelectGroup(group)}
                >
                  <p className="font-bold text-purple-800 text-lg">{group.name}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Main chat panel ─────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 bg-white ml-0 md:ml-[28%] h-full relative overflow-hidden">
        {selectedGroup ? (
          <div>
            <div className="flex items-center p-4 border-b border-gray-200 bg-white">
              <h3>{selectedGroup.name}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
              {messages.length === 0 ? (
                <p className="p-2.5 text-gray-500">
                  No messages yet. Start the conversation!
                </p>
              ) : (
                <div className="flex flex-col w-full space-y-3">
                  {messages.map((msg, index) => (
                    <div
                      key={msg._id || index}
                      className={`${isSentByMe(msg) ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg px-4 py-2 max-w-md relative text-sm`}
                    >
                      {!isSentByMe(msg) && (
                        <small className="text-purple-600 font-bold block mb-0.5">
                          {msg.sender?.username || 'Member'}
                        </small>
                      )}
                      <p>{msg.message}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
              <button className="bg-transparent border-none text-2xl cursor-pointer mr-2.5 text-gray-600" onClick={toggleEmojiPicker}>
                <EmojiEmotionsOutlinedIcon />
              </button>
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full outline-none"
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
              <button className="bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700" onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <div className="text-center p-5 text-purple-600">
            <p>Select a group to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
