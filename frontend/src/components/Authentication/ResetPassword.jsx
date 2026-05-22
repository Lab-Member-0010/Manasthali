import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Api from "../../apis/Api";
import sporeGif from "@assets/spore.gif";
import manasthaliLogo from "@assets/Manasthali.png";
const styles = {
resetContainer: {
  backgroundImage: `url(${sporeGif})`,
  backgroundSize: 'cover',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
},
  resetBox: {
  width: '400px',
  height: '400px',
  maxWidth: '400px',
  padding: '20px',
  borderRadius: '10px',
  backgroundColor: 'transparent',
  boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
},
  resetLogo: {
  width: '100px',
  height: '100px',
  backgroundImage: `url(${manasthaliLogo})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  margin: '10px auto 20px',
},
  inputContainer: {
  width: '100%',
  marginTop: '20px',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
},
  inputField: {
  width: '350px',
  height: 'auto',
  backgroundColor: 'transparent',
  borderBottom: '1px solid black',
  fontSize: '1rem',
},
  passwordFieldContainer: {
  position: 'relative',
  width: '100%',
},
  togglePassword: {
  position: 'absolute',
  right: '20px',
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: '14px',
  color: 'black',
  fontWeight: 'bold',
  cursor: 'pointer',
},
  resetButton: {
  color: 'black',
  backgroundColor: '#55aafe',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  width: '310px',
  height: '40px',
  margin: '20px',
  fontSize: '1rem',
},
  errorText: {
  fontSize: '0.65rem',
  color: 'rgb(254, 73, 73)',
  textAlign: 'left',
  paddingLeft: '5px',
},
  errorBorder: {
  border: '1px solid rgb(254, 73, 73)',
}
};

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@]{8,16}$/;
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be 8-16 characters long, alphanumeric, and can include '@'.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name,value } = e.target;
    if (name === "password") {
      setPassword(value);
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@]{8,16}$/;
      if (!passwordRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must be 8-16 characters long, alphanumeric, and can include '@'.",
        }));
      } else {
        setErrors((prevErrors) => {
          const { password, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) return;

    try {
      console.log(password);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/reset-password`, {
        token,
        newPassword: password,
      });
      toast.success(response.data.message, { position: "top-center" });
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong.", {
        position: "top-center",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div style={styles.resetContainer}>
      <div style={styles.resetBox}>
        <ToastContainer />
        <div style={styles.resetLogo}></div>
        <h2 className="text-center mb-4">Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <div style={styles.inputContainer}>
            <label>New Password:</label>
              <div style={styles.passwordFieldContainer}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="form-control"
                  style={errors.password ? {...styles.inputField, ...styles.errorBorder} : styles.inputField}
                  required
                />
                <span
                  style={{...styles.togglePassword, cursor: "pointer"}}
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
              {errors.password && <span style={styles.errorText}>{errors.password}</span>}
            </div>
          <button type="submit" className="btn" style={styles.resetButton}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
