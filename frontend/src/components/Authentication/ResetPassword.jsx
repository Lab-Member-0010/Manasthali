import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Api from "../../apis/Api";
import sporeGif from "@assets/spore.gif";
import manasthaliLogo from "@assets/Manasthali.png";

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
    <div className="h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${sporeGif})` }}>
      <div className="w-[400px] h-[400px] max-w-[400px] p-5 rounded-[10px] bg-transparent shadow backdrop-blur-[10px]">
        <ToastContainer />
        <div className="w-[100px] h-[100px] bg-no-repeat bg-center bg-contain mx-auto mt-[10px] mb-[20px]" style={{ backgroundImage: `url(${manasthaliLogo})` }}></div>
        <h2 className="text-center mb-4">Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <div className="w-full mt-5 mb-5 flex flex-col relative">
            <label>New Password:</label>
              <div className="relative w-full">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`form-control w-[350px] h-auto bg-transparent text-base ${errors.password ? "border border-red-500" : "border-b border-black"}`}
                  required
                />
                <span
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-black font-bold cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
              {errors.password && <span className="text-[0.65rem] text-red-500 text-left pl-[5px]">{errors.password}</span>}
            </div>
          <button type="submit" className="btn text-black bg-[#55aafe] font-bold border-b border-black w-[310px] h-10 m-5 text-base">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
