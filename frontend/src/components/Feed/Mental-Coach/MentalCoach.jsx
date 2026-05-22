import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
const styles = {
container: {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  background: 'white',
  color: 'black',
  fontFamily: 'Arial, sans-serif',
  overflow: 'hidden',
},
  chatBox: {
  width: '100%',
  maxWidth: '400px',
  height: '60vh',
  overflowY: 'auto',
  background: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '10px',
  padding: '15px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
  transition: '0.3s',
  position: 'relative',
},
  message: {
  maxWidth: '80%',
  padding: '10px',
  borderRadius: '10px',
  wordWrap: 'break-word',
  fontSize: '14px',
},
  userMessage: {
  alignSelf: 'flex-end',
  backgroundColor: '#c093fc',
  color: 'black',
  borderTopRightRadius: 0,
},
  botMessage: {
  alignSelf: 'flex-start',
  backgroundColor: '#f1f1f1',
  color: 'black',
  borderTopLeftRadius: 0,
},
  inputBox: {
  display: 'flex',
  width: '100%',
  maxWidth: '400px',
  marginTop: '10px',
  gap: '10px',
  position: 'absolute',
  bottom: '10px',
},
  inputFields: {
  flex: 1,
  padding: '10px',
  border: 'none',
  borderRadius: '20px',
  outline: 'none',
  fontSize: '16px',
  transition: 'all 0.3s ease',
  backgroundColor: 'white',
  color: 'black',
},
  buttonSend: {
  backgroundColor: '#c093fc',
  color: 'white',
  border: 'none',
  padding: '10px 15px',
  borderRadius: '20px',
  cursor: 'pointer',
  transition: '0.3s',
}
};

const BASE_URL = import.meta.env.VITE_API_URL;

const MentalCoach = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const token = useSelector((state) => state.user?.token);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(
        `${BASE_URL}/mental-coach/ask`,
        { question: input },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

      const aiResponse = response.data.answer || "I don't know.";
      setMessages([...newMessages, { text: aiResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { text: "AI Server Error", sender: "bot" }]);
    }
  };

  return (
    <div style={styles.container}>
      <h3>Mental Coach</h3>
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={msg.sender === "user" ? {...styles.message, ...styles.userMessage} : {...styles.message, ...styles.botMessage}}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div style={styles.inputBox}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={styles.inputFields}
        />
        <button
          onClick={sendMessage}
          style={styles.buttonSend}
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default MentalCoach;
