import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Api from "../../apis/Api";
import sporeGif from "@assets/spore.gif";
import manasthaliLogo from "@assets/Manasthali.png";
const styles = {
otpContainer: {
  backgroundImage: `url(${sporeGif})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingRight: '50px',
},
  otpBox: {
  backgroundColor: 'transparent',
  padding: '10px',
  borderRadius: '20px',
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
  width: '420px',
  maxWidth: '1000px',
  position: 'relative',
  right: '0',
},
  otpLogo: {
  width: '100px',
  height: '100px',
  backgroundImage: `url(${manasthaliLogo})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  margin: '10px auto 20px auto',
  display: 'block',
},
  inputContainer: {
  width: '80%',
  marginTop: '20px',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
},
  inputField: {
  width: '400px',
  height: 'auto',
  backgroundColor: 'transparent',
  borderBottom: '1px solid black',
  fontSize: '1rem',
},
  labelField: {
  height: '25px',
  marginLeft: '5px',
  fontSize: '1.2rem',
  color: 'black',
  textAlign: 'left',
},
  verifyOtpBtn: {
  color: 'black',
  backgroundColor: '#55aafe',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  width: '200px',
  height: '40px',
  margin: '20px',
  fontSize: '1rem',
}
};

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
