import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import * as styles from "./MentalCoach.styles";

const BASE_URL = import.meta.env.VITE_API_URL;

const MentalCoach = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const user = useSelector((state) => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post(`${BASE_URL}/mental-coach/ask`, {
        question: input,
      });

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

      {!isLoggedIn && <p style={{ color: "red" }}>Please log in to chat!</p>}

      <div style={styles.inputBox}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          style={styles.inputFields}
          disabled={!isLoggedIn}
        />
        <button
          onClick={sendMessage}
          style={{ ...styles.buttonSend, opacity: isLoggedIn ? 1 : 0.5 }}
          disabled={!isLoggedIn}
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default MentalCoach;
