import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SecurityIcon from '@mui/icons-material/Security';
import sporeGif from "@assets/spore.gif";
const styles = {
backgroundContainer: {
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
  adminLoginToggle: {
  width: '60px',
  height: '60px',
  position: 'absolute',
  bottom: '20px',
  right: '20px',
},
  homeContainer: {
  backgroundColor: 'transparent',
  padding: '50px',
  borderRadius: '20px',
  boxShadow: '0px 1px 2px 1px rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  textAlign: 'center',
  maxWidth: '1000px',
  position: 'relative',
  right: '0',
},
  customBtn: {
  color: 'black',
  backgroundColor: 'transparent',
  fontWeight: 'bold',
  padding: '14px 24px',
  fontSize: '1.1rem',
  boxShadow: '0px 1px 0px 1px rgba(0, 0, 0, 0.2)',
},
  customBtnOutline: {
  color: 'black',
  backgroundColor: 'transparent',
  fontWeight: 'bold',
  padding: '14px 24px',
  fontSize: '1.1rem',
  boxShadow: '0px 1px 0px 1px rgba(0, 0, 0, 0.2)',
},
  modalAbout: {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgb(251, 248, 248)',
  borderRadius: '10px',
  zIndex: 9999,
  height: '50%',
  width: '50%',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
},
  modalAboutOverlay: {
  position: 'fixed',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9998,
},
  closeButton: {
  background: 'none',
  width: '20px',
  height: '20px',
  border: '1px solid gray',
  borderRadius: '50%',
  fontWeight: 'bold',
  fontSize: '10px',
  color: 'lightgray',
  backgroundColor: 'white',
}
};

const Home = () => {
  const navigate = useNavigate();

  const handleAdminToggle = () => {
    navigate("/admin-login");
  };

  return (
    <div style={styles.backgroundContainer}>
      <SecurityIcon style={styles.adminLoginToggle} onClick={() => handleAdminToggle()} />
      <div className="container-fluid text-center" style={styles.homeContainer}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h3 className="display-4 mb-4">Welcome to Manasthali</h3>
            <p className="lead">
              A platform to connect with people based on your personality.
            </p>
            <div className="d-grid gap-3 col-6 mx-auto mt-4">
              <button
                className="btn"
                style={{...styles.customBtn, ...styles.customBtnOutline}}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
              <button
                className="btn"
                style={{...styles.customBtn, ...styles.customBtnOutline}}
                onClick={() => navigate("/signin")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
