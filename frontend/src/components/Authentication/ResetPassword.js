import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as styles from "./ResetPassword.styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Api from "../../apis/Api";

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
