import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux-config/UserSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";
import "bootstrap/dist/css/bootstrap.min.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import sporeGif from "@assets/spore.gif";
import manasthaliLogo from "@assets/Manasthali.png";
const styles = {
signinContainer: {
  backgroundImage: `url(${sporeGif})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingRight: '50px',
},
  signinBox: {
  backgroundColor: 'transparent',
  padding: '10px',
  borderRadius: '20px',
  boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
  width: '500px',
  maxWidth: '1000px',
  position: 'relative',
  right: '0',
},
  signinLogo: {
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
  width: '445px',
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
  inBtn: {
  color: 'black',
  backgroundColor: '#55aafe',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  width: '200px',
  height: '40px',
  margin: '20px',
  fontSize: '1rem',
},
  inBtnOutline: {
  color: 'black',
  backgroundColor: '#55aafe',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  width: '200px',
  height: '40px',
  margin: '20px',
  fontSize: '1rem',
},
  inAnchor: {
  fontSize: '17px',
  textDecoration: 'none',
  color: 'black',
  cursor: 'pointer',
  backgroundColor: 'transparent',
  border: 'none',
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

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();
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
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^@\s]+@[^@\s]+\.com$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@]{8,16}$/;

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format. Email must include '@' and end with '.com'.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be 8-16 characters long, alphanumeric, and can include '@'.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Sign-in
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(Api.SIGN_IN, { email, password });
      console.log("API response:", response.data);

      dispatch(
        setUser({
          user: response.data.user,
          message: response.data.message,
          token: response.data.token,
          isLoggedIn: true,
        })
      );

      if (response.data.user.personality_type) {
        navigate("/feed");
      } else {
        navigate("/quiz-start");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Invalid credentials");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <ToastContainer />
      <div style={styles.signinContainer}>
        <div className="shadow-lg p-4" style={styles.signinBox}>
          <div style={styles.signinLogo}></div>
          <h2 className="text-center mb-4">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.inputContainer}>
              <label htmlFor="email" style={styles.labelField}>
                Email
              </label>
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

            <div style={styles.inputContainer}>
              <label htmlFor="password" style={styles.labelField}>
                Password
              </label>
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

            <button type="submit" className="btn form-control" style={styles.inBtn}>
              Sign In
            </button>

            <a className="form-control" style={styles.inAnchor} href={"/forgot-password/"}>
              Forgot Password?
            </a>
          </form>
          <h5>
            Don't have an account?
            <span>
              <Link to="/signup" style={{ textDecoration: "none" }}> Please Register</Link>
            </span>
          </h5>
        </div>
      </div>
    </>
  );
};

export default SignIn;
