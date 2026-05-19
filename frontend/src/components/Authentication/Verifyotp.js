import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as styles from "./Verifyotp.styles";
import Api from "../../apis/Api";

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
    <div style={styles.otpContainer}>
      <ToastContainer />
      <div className="container text-center mt-5" style={styles.otpBox}>
      <div style={styles.otpLogo}></div>
        <h2 className="text-center mb-4">Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={styles.inputContainer}>
          <label style={styles.labelField}>OTP:</label>
            <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="form-control"
            style={styles.inputField}
            placeholder="Enter OTP"
            required
          />
          </div>
          <button type="submit" className="btn custom-btn" style={styles.verifyOtpBtn}>
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verifyotp;
