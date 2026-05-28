import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import sporeGif from "@assets/spore.gif";
import manasthaliLogo from "@assets/Manasthali.png";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(Api.ADMIN_LOGIN, {
        username,
        token
      });

      if (response.status === 200) {
        localStorage.setItem("adminToken", response.data.token);
        toast.success("Welcome Home Admin!");
        navigate("/admin");
      }
    } catch (err) {
      toast.error("Token Invalid!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center">
      <ToastContainer />
      <div className="container text-center mt-5 bg-white/10 backdrop-blur-lg rounded-xl p-8 w-96">
      <div className="w-[100px] h-[100px] mx-auto mb-5 block bg-contain bg-center bg-no-repeat" style={{ backgroundImage: "url(" + manasthaliLogo + ")" }}></div>
        <h2 className="text-center mb-4">Verify Token</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group w-4/5 mt-5 mb-5 flex flex-col relative">
            <label className="h-[25px] ml-1 text-xl text-black text-left">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50"
              placeholder="Enter Username"
              required
            />
          </div>
          <div className="form-group w-4/5 mt-5 mb-5 flex flex-col relative">
            <label className="h-[25px] ml-1 text-xl text-black text-left">Token:</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="form-control w-full bg-white/20 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50"
              placeholder="Enter Token"
              required
            />
          </div>
          <button type="submit" className="btn custom-btn w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-bold">
            Verify Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
