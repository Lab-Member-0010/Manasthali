import React from "react";
import { useNavigate } from "react-router-dom";
import SecurityIcon from '@mui/icons-material/Security';
import sporeGif from "@assets/spore.gif";

const Home = () => {
  const navigate = useNavigate();

  const handleAdminToggle = () => {
    navigate("/admin-login");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cover bg-center bg-fixed" style={{ backgroundImage: "url(" + sporeGif + ")" }}>
      <SecurityIcon className="w-[60px] h-[60px] absolute bottom-5 right-5" onClick={() => handleAdminToggle()} />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h3 className="text-5xl md:text-7xl font-bold text-purple-600 mb-4 drop-shadow-lg">Welcome to Manasthali</h3>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl">
          A platform to connect with people based on your personality.
        </p>
        <div className="flex flex-col gap-3 items-center mt-4">
          <button
            className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-purple-700 transition mx-2"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
          <button
            className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-purple-700 transition mx-2"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
