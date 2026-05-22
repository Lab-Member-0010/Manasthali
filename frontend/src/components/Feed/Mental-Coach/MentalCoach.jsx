import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

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
    <div className="max-w-4xl mx-auto p-6 flex flex-col items-center min-h-screen bg-white text-black">
      <h3>Mental Coach</h3>
      <div className="bg-white rounded-lg shadow p-6 min-h-96 w-full max-w-md overflow-y-auto flex flex-col gap-2.5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.sender === "user" ? "p-4 mb-3 rounded-lg max-w-xl ml-auto bg-blue-100" : "p-4 mb-3 rounded-lg max-w-xl bg-gray-100"}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4 w-full max-w-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
        />
        <button
          onClick={sendMessage}
          className="bg-purple-400 text-white px-4 py-2 rounded-full cursor-pointer hover:bg-purple-500 transition-colors border-none"
        >
          Ask
        </button>
      </div>
    </div>
  );
};

export default MentalCoach;
