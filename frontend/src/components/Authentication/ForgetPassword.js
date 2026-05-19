import React, { useState } from "react";
import axios from "axios";
import Api from "../../apis/Api";
import * as styles from "./ForgetPassword.styles";
import { toast, ToastContainer } from "react-toastify";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
      const emailRegex = /^[^@\s]+@[^@\s]+\.com$/;
      if (!emailRegex.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Invalid email format. Email must include '@' and end with '.com'." }));
      } else {
        setErrors((prevErrors) => {
          const { email, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^@\s]+@[^@\s]+\.com$/;

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format. Email must include '@' and end with '.com'.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(Api.FORGOT_PASSWORD, { email });
      toast.success("Reset Password Link sent to you Email")
      setErrors("");
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data?.error || "Something went wrong.");
      toast.error("Error sending reset Email");
    }
  };

  return (
    <div style={styles.forgetContainer}>
      <ToastContainer/>
      <div className="shadow-lg p-4" style={styles.forgetBox}>
      <div style={styles.forgetLogo}></div>
        <h2 className="text-center mb-4">Forget Password</h2>
        <form onSubmit={handleForgotPassword}>
          <div style={styles.inputContainer}>
            <label>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter email"
              className="form-control"
              style={errors.email ? {...styles.inputField, ...styles.errorBorder} : styles.inputField}
              autoComplete="off"
              required
            />
            {errors.email && <span style={styles.errorText}>{errors.email}</span>}
          </div>
          <button type="submit" className="btn" style={styles.forgetButton}>
            Send Reset Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
