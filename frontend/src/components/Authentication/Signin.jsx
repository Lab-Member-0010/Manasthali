import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux-config/UserSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";
import sporeGif from "@assets/spore.gif";
import manasthaliLogo from "@assets/Manasthali.png";

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
      <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed pr-[50px]" style={{ backgroundImage: `url(${sporeGif})` }}>
        <div className="bg-transparent p-[10px] rounded-[20px] shadow backdrop-blur-[10px] text-center w-[500px] max-w-[1000px] relative right-0">
          <div className="w-[100px] h-[100px] bg-no-repeat bg-center bg-contain mx-auto mt-[10px] mb-[20px]" style={{ backgroundImage: `url(${manasthaliLogo})` }}></div>
          <h2 className="text-center mb-4">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="w-full mt-5 mb-5 flex flex-col relative">
              <label htmlFor="email" className="h-[25px] ml-[5px] text-xl text-black text-left">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter email"
                className={`w-[445px] h-auto bg-transparent text-base ${errors.email ? "border border-red-500" : "border-b border-black"}`}
                autoComplete="off"
                required
              />
              {errors.email && <span className="text-[0.7rem] text-red-500 text-left pl-[5px]">{errors.email}</span>}
            </div>

            <div className="w-full mt-5 mb-5 flex flex-col relative">
              <label htmlFor="password" className="h-[25px] ml-[5px] text-xl text-black text-left">
                Password
              </label>
              <div className="relative w-full">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`w-[445px] h-auto bg-transparent text-base ${errors.password ? "border border-red-500" : "border-b border-black"}`}
                  required
                />
                <span
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-black font-bold cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
              {errors.password && <span className="text-[0.7rem] text-red-500 text-left pl-[5px]">{errors.password}</span>}
            </div>

            <button type="submit" className="text-black bg-[#55aafe] font-bold border-b border-black w-[200px] h-10 m-5 text-base">
              Sign In
            </button>

            <a className="text-[17px] no-underline text-black cursor-pointer bg-transparent border-none" href={"/forgot-password/"}>
              Forgot Password?
            </a>
          </form>
          <h5>
            Don't have an account?
            <span>
              <Link to="/signup" className="no-underline"> Please Register</Link>
            </span>
          </h5>
        </div>
      </div>
    </>
  );
};

export default SignIn;
