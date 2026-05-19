import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import * as styles from "./Signup.styles";
import Api from "../../apis/Api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    if (name === "username") {
      setUsername(value);
      if (value.trim() === "") {
        setErrors((prevErrors) => ({ ...prevErrors, username: "Username is required." }));
      } else {
        setErrors((prevErrors) => {
          const { username, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };

  const validateForm = async () => {
    const newErrors = {};
    const emailRegex = /^[^@\s]+@[^@\s]+\.com$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@]{8,16}$/;
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format. Email must include '@' and end with '.com'.";
    } else {
      try {
        const response = await axios.post(Api.CHECK_EMAIL, { email: email });
        if (!response.data.available) {
          newErrors.email = "Email already exists.";
        }
      } catch (err) {
        console.error("Error checking email:", err);
      }
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be 8-16 characters long, alphanumeric, and can include '@'.";
    }

    if (!username) {
      newErrors.username = "Username is required.";
    } else {
      try {
        const response = await axios.post(Api.CHECK_USERNAME, { username: username });
        if (!response.data.available) {
          newErrors.username = "Username already exists.";
        }
      } catch (err) {
        console.error("Error checking username:", err);
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) return;

    try {
      const response = await axios.post(Api.SIGN_UP, { email, username, password });
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      navigate("/verify-otp", { state: { email: email } });
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Something went wrong.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div style={styles.signupContainer}>
      <div className="container text-center mt-5" style={styles.signupBox}>
        <div className="row justify-content-center">
          <div style={styles.signupLogo}></div>
          <h2 className="text-center mb-4">Sign Up</h2>
          {successMessage && <p className="alert alert-success">{successMessage}</p>}
          {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={styles.inputContainer}>
              <label style={styles.labelField}>Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className="form-control"
                style={errors.email ? {...styles.inputField, ...styles.errorBorder} : styles.inputField}
                placeholder="Enter your email"
                autoComplete="off"
                required
              />
              {errors.email && <span style={styles.errorText}>{errors.email}</span>}
            </div>
            <div className="form-group" style={styles.inputContainer}>
              <label style={styles.labelField}>Username:</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                className="form-control"
                style={errors.username ? {...styles.inputField, ...styles.errorBorder} : styles.inputField}
                placeholder="Enter your username"
                autoComplete="off"
                required
              />
              {errors.username && <span style={styles.errorText}>{errors.username}</span>}
            </div>
            <div className="form-group" style={styles.inputContainer}>
              <label style={styles.labelField}>Password:</label>
              <div style={styles.passwordFieldContainer}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className="form-control"
                  style={errors.password ? {...styles.inputField, ...styles.errorBorder} : styles.inputField}
                  placeholder="Enter your Password"
                  autoComplete="off"
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
            <button type="submit" className="btn custom-btn" style={styles.upBtnOutline}>
              Sign Up
            </button>
          </form>
          <h5>
            Already have an account?

            <Link to="/signin" style={{ textDecoration: "none" }}>Sign In</Link>

          </h5>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
