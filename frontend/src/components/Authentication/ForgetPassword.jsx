import React, { useState } from "react";
import axios from "axios";
import Api from "../../apis/Api";
import { toast, ToastContainer } from "react-toastify";
import sporeGif from "@assets/spore.gif";
import manasthaliLogo from "@assets/Manasthali.png";

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
    <div className="h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(${sporeGif})` }}>
      <ToastContainer/>
      <div className="w-[400px] h-[400px] max-w-[400px] p-5 rounded-[10px] bg-transparent shadow backdrop-blur-[10px]">
      <div className="w-[100px] h-[100px] bg-no-repeat bg-center bg-contain mx-auto mt-[10px] mb-[20px]" style={{ backgroundImage: `url(${manasthaliLogo})` }}></div>
        <h2 className="text-center mb-4">Forget Password</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="w-full mt-5 mb-5 flex flex-col relative">
            <label>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter email"
              className={`form-control w-[350px] h-auto bg-transparent text-base ${errors.email ? "border border-red-500" : "border-b border-black"}`}
              autoComplete="off"
              required
            />
            {errors.email && <span className="text-[0.7rem] text-red-500 text-left pl-[5px]">{errors.email}</span>}
          </div>
          <button type="submit" className="btn text-black bg-[#55aafe] font-bold border-b border-black w-[310px] h-10 m-5 text-base">
            Send Reset Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
