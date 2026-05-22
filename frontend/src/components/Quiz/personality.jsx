import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Personality = () => {
  const location = useLocation();
  const personality = location.state?.personality || "Unknown";
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/feed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex flex-col items-center justify-center text-center relative overflow-hidden">
      <h2>Hey, your personality type is:</h2>
      <h1>{personality}</h1>
      <button type="submit" className="border-none px-6 py-3 text-xl rounded-[40px] bg-[#c093fc] text-white shadow-md" onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default Personality;
