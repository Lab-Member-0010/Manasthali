import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { HiArrowSmRight } from "react-icons/hi";
const styles = {
quizGetStartedContainer: {
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
  color: 'black',
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
  borderRadius: '50px',
  backgroundColor: '#c093fc',
  color: 'white',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
}
};

const QuizGetStarted = () => {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div style={styles.quizGetStartedContainer}>
      {<img
        src="https://i.pinimg.com/originals/cf/85/d9/cf85d966c302f3728a0e8f81805c132a.gif"
        alt="Background"
        style={styles.backgroundImage}
      />}
      <h2>Unleash Your Inner Self!</h2>
      <p>Are you ready to discover your true personality? Click the arrow to embark on this exciting journey!</p>
      <button onClick={startQuiz} style={styles.nextButton}>Lets Begin
      <HiArrowSmRight />
      </button>
    </div>
  );
};

export default QuizGetStarted;
