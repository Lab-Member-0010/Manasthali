import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import sporeGif from "@assets/spore.gif";
import manasthaliLogo from "@assets/Manasthali.png";
const styles = {
adminLoginContainer: {
  backgroundImage: `url(${sporeGif})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  paddingRight: '50px',
},
  adminLoginBox: {
  backgroundColor: 'transparent',
  padding: '10px',
  borderRadius: '20px',
  boxShadow: '0px 2px 2px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
  width: '420px',
  maxWidth: '1000px',
  position: 'relative',
  right: '0',
},
  adminLoginLogo: {
  width: '100px',
  height: '100px',
  backgroundImage: `url(${manasthaliLogo})`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'contain',
  margin: '10px auto 20px auto',
  display: 'block',
},
  adminLoginInputContainer: {
  width: '80%',
  marginTop: '20px',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
},
  adminLoginInputField: {
  width: '400px',
  height: 'auto',
  backgroundColor: 'transparent',
  borderBottom: '1px solid black',
  fontSize: '1rem',
},
  adminLoginLabelField: {
  height: '25px',
  marginLeft: '5px',
  fontSize: '1.2rem',
  color: 'black',
  textAlign: 'left',
},
  verifyAdminLoginBtn: {
  color: 'black',
  backgroundColor: '#55aafe',
  fontWeight: 'bold',
  borderBottom: '1px solid black',
  width: '200px',
  height: '40px',
  margin: '20px',
  fontSize: '1rem',
}
};

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

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
            <label style={styles.adminLoginLabelField}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              style={styles.adminLoginInputField}
              placeholder="Enter Username"
              required
            />
          </div>
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
