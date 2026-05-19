import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import * as styles from "./AdminLogin.styles";

const AdminLogin=()=>{
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const username = "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(Api.ADMIN_LOGIN, {
        username,
        token
      });

      if (response.status === 200) {
        toast.success("Welcome Home Admin!");
        navigate("/admin");
      }
    } catch (err) {
      toast.error("Token Invalid!");
    }
  };

  return (
    <div style={styles.adminLoginContainer}>
      <ToastContainer />
      <div className="container text-center mt-5" style={styles.adminLoginBox}>
      <div style={styles.adminLoginLogo}></div>
        <h2 className="text-center mb-4">Verify Token</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={styles.adminLoginInputContainer}>
          <label style={styles.adminLoginLabelField}>Token:</label>
            <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="form-control"
            style={styles.adminLoginInputField}
            placeholder="Enter Token"
            required
          />
          </div>
          <button type="submit" className="btn custom-btn" style={styles.verifyAdminLoginBtn}>
            Verify Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
