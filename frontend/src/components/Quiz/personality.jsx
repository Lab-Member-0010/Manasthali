import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
const styles = {
typeContainer: {
  backgroundImage: `url(${quizGif})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundAttachment: 'fixed',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
},
  backgroundImage: {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  zIndex: -1,
},
  nextButton: {
  border: 'none',
  padding: '0.75rem 1.5rem',
  fontSize: '1.25rem',
  borderRadius: '40px',
  backgroundColor: '#c093fc',
  color: 'white',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
}
};

const Personality = () => {
  const location = useLocation();
  const personality = location.state?.personality || "Unknown";
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/feed");
  };

  return (
    <div style={styles.typeContainer}>
      <h2>Hey, your personality type is:</h2>
      <h1>{personality}</h1>
      <button type="submit" style={styles.nextButton} onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default Personality;
