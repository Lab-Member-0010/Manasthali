import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Api from "../../apis/Api";
import sporeGif from "@assets/spore.gif";
import manasthaliLogo from "@assets/Manasthali.png";

const Verifyotp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(Api.VERIFY_OTP, {
        email,
        otp,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        navigate("/signin");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Invalid OTP.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-end bg-cover bg-center bg-fixed pr-[50px]" style={{ backgroundImage: `url(${sporeGif})` }}>
      <ToastContainer />
      <div className="container text-center bg-transparent p-[10px] rounded-[20px] shadow backdrop-blur-[10px] w-[420px] max-w-[1000px] relative right-0 mx-auto mt-5">
      <div className="w-[100px] h-[100px] bg-no-repeat bg-center bg-contain mx-auto mt-[10px] mb-[20px] block" style={{ backgroundImage: `url(${manasthaliLogo})` }}></div>
        <h2 className="text-center mb-4">Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group w-4/5 mt-5 mb-5 flex flex-col relative mx-auto">
          <label className="h-[25px] ml-[5px] text-xl text-black text-left">OTP:</label>
            <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-control w-[400px] h-auto bg-transparent border-b border-black text-base"
            placeholder="Enter OTP"
            required
          />
          </div>
          <button type="submit" className="btn custom-btn text-black bg-[#55aafe] font-bold border-b border-black w-[200px] h-10 m-5 text-base">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verifyotp;
