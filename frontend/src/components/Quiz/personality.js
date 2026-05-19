import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as styles from "./personality.styles";

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
