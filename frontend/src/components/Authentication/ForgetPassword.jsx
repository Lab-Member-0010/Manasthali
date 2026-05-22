import React, { useState } from "react";
import axios from "axios";
import Api from "../../apis/Api";
import { toast, ToastContainer } from "react-toastify";
const styles = {
forgetContainer: {
  backgroundImage: `url(${sporeGif})`,
  backgroundSize: 'cover',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
},
  forgetBox: {
  width: '400px',
  height: '400px',
  maxWidth: '400px',
  padding: '20px',
  borderRadius: '10px',
  backgroundColor: 'transparent',
  boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
},
  forgetLogo: {
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
  forgetButton: {
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
  fontSize: '0.7rem',
  color: 'rgb(254, 73, 73)',
  textAlign: 'left',
  paddingLeft: '5px',
},
  errorBorder: {
  border: '1px solid rgb(254, 73, 73)',
}
};

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
