import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import sporeGif from "@assets/spore.gif";
import manasthaliLogo from "@assets/Manasthali.png";

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
    <div className="min-h-screen flex items-center justify-end bg-cover bg-center bg-fixed pr-[50px]" style={{ backgroundImage: `url(${sporeGif})` }}>
      <div className="container text-center bg-transparent rounded-[20px] shadow backdrop-blur-[10px] w-[470px] h-[570px] max-w-[1000px] relative right-0 mx-auto mt-10 mb-10">
        <div className="row justify-content-center">
          <div className="w-[80px] h-[80px] bg-no-repeat bg-center bg-contain m-0 block" style={{ backgroundImage: `url(${manasthaliLogo})` }}></div>
          <h2 className="text-center mb-4">Sign Up</h2>
          {successMessage && <p className="alert alert-success">{successMessage}</p>}
          {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group relative mb-4 bg-transparent w-4/5 flex flex-col">
              <label className="h-[25px] ml-[5px] text-xl text-black text-left">Email:</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                className={`form-control w-[440px] h-[40px] bg-transparent border-b text-base ${errors.email ? "border-red-500" : "border-black"}`}
                placeholder="Enter your email"
                autoComplete="off"
                required
              />
              {errors.email && <span className="text-[0.7rem] text-red-500 text-left w-[410px] pl-[5px]">{errors.email}</span>}
            </div>
            <div className="form-group relative mb-4 bg-transparent w-4/5 flex flex-col">
              <label className="h-[25px] ml-[5px] text-xl text-black text-left">Username:</label>
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                className={`form-control w-[440px] h-[40px] bg-transparent border-b text-base ${errors.username ? "border-red-500" : "border-black"}`}
                placeholder="Enter your username"
                autoComplete="off"
                required
              />
              {errors.username && <span className="text-[0.7rem] text-red-500 text-left w-[410px] pl-[5px]">{errors.username}</span>}
            </div>
            <div className="form-group relative mb-4 bg-transparent w-4/5 flex flex-col">
              <label className="h-[25px] ml-[5px] text-xl text-black text-left">Password:</label>
              <div className="relative w-full">
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={handleChange}
                  className={`form-control w-[440px] h-[40px] bg-transparent border-b text-base ${errors.password ? "border-red-500" : "border-black"}`}
                  placeholder="Enter your Password"
                  autoComplete="off"
                  required
                />
                <span
                  className="-right-[65px] top-1/2 -translate-y-1/2 text-sm text-black font-bold cursor-pointer absolute"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
              {errors.password && <span className="text-[0.7rem] text-red-500 text-left w-[410px] pl-[5px]">{errors.password}</span>}
            </div>
            <button type="submit" className="btn custom-btn text-black bg-[#55aafe] font-bold border-b border-black w-[200px] h-10 m-5 text-base">
              Sign Up
            </button>
          </form>
          <h5>
            Already have an account?

            <Link to="/signin" className="no-underline">Sign In</Link>

          </h5>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
