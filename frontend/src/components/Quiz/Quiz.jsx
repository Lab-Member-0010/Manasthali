import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Api from "../../apis/Api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateUserProfile } from "../../redux-config/UserSlice";
const styles = {
quizWrapper: {
  backgroundImage: "url('https://i.pinimg.com/originals/cf/85/d9/cf85d966c302f3728a0e8f81805c132a.gif')",
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
},
  quizContainer: {
  background: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '15px',
  padding: '40px',
  width: '700px',
  height: '300px',
  boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.15)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
},
  questionContainer: {
  textAlign: 'center',
},
  question: {
  fontSize: '1.5rem',
  marginBottom: '30px',
  fontWeight: 'bold',
  color: '#333',
},
  sliderOptions: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
},
  label: {
  fontSize: '1.2rem',
  width: '15%',
  textAlign: 'center',
  color: '#333',
},
  circles: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '70%',
},
  circle: {
  width: '30px',
  height: '30px',
  borderRadius: '50%',
  border: '3px solid yellow',
  backgroundColor: 'transparent',
  cursor: 'pointer',
},
  circle1: {
  width: '50px',
  height: '50px',
  borderColor: '#66BB6A',
},
  circle2: {
  width: '40px',
  height: '40px',
  borderColor: '#9CCC65',
},
  circle3: {
  borderColor: '#90CAF9',
  width: '30px',
  height: '30px',
},
  circle4: {
  width: '40px',
  height: '40px',
  borderColor: '#FFA726',
},
  circle5: {
  width: '50px',
  height: '50px',
  borderColor: '#EF5350',
},
  circle1Active: {
  color: '#66BB6A',
  backgroundColor: '#66BB6A',
},
  circle2Active: {
  color: '#9CCC65',
  backgroundColor: '#9CCC65',
},
  circle3Active: {
  color: '#90CAF9',
  backgroundColor: '#90CAF9',
},
  circle4Active: {
  color: '#FFA726',
  backgroundColor: '#FFA726',
},
  circle5Active: {
  color: '#EF5350',
  backgroundColor: '#EF5350',
},
  navigationButtons: {
  marginTop: '30px',
  display: 'flex',
  justifyContent: 'space-between',
},
  preNextButton: {
  border: 'none',
  padding: '0.75rem 1.5rem',
  fontSize: '1.25rem',
  borderRadius: '40px',
  backgroundColor: '#c093fc',
  color: 'white',
  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
},
  preNextButtonDisabled: {
  backgroundColor: '#cfcfcf',
  color: 'gray',
}
};

const questions = [
  "I enjoy socializing with new people.",
  "I feel drained after socializing, even in small groups.",
  "I frequently seek out new experiences.",
  "I usually plan my activities in advance.",
  "I prefer staying at home rather than going out.",
  "I am often the one to start conversations at a social gathering.",
  "I value harmony and avoid conflict at all costs.",
  "I tend to focus on the details rather than the big picture.",
  "I respond well to criticism.",
  "I prefer working alone rather than in a group.",
  "I often feel anxious or nervous about the future.",
  "I enjoy brainstorming new ideas or concepts.",
  "I am more of a 'doer' than a 'thinker'.",
  "I often take charge in group situations.",
  "I make decisions based on my feelings rather than logic.",
  "I am careful about spending money.",
  "I frequently feel overwhelmed by my emotions.",
  "I find it easy to adapt to new situations.",
  "I prefer following established rules rather than making my own.",
  "I actively seek out intellectual challenges.",
  "I help others without expecting anything in return.",
  "I find it difficult to relax even when I have free time.",
  "I follow through on my commitments.",
  "I enjoy trying new foods or cuisines.",
  "I am more likely to trust others easily.",
  "I react calmly to unexpected changes in plans.",
  "I feel uncomfortable when people express emotions openly.",
  "I prefer detailed plans over spontaneity.",
  "Having a routine is important to me.",
  "I prefer to avoid conflict, even if I disagree with someone.",
  "I feel at ease in large social gatherings.",
  "I often feel a sense of accomplishment after completing a task.",
  "I feel the need to be in control of situations.",
  "I worry about my performance or success.",
  "I am more comfortable with facts and data than with abstract ideas."
];

// Active circle style maps keyed by circle index value
const activeCircleStyles = [
  null,
  styles.circle1Active,
  styles.circle2Active,
  styles.circle3Active,
  styles.circle4Active,
  styles.circle5Active,
];

const circleBaseStyles = [
  null,
  styles.circle1,
  styles.circle2,
  styles.circle3,
  styles.circle4,
  styles.circle5,
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  const { token, isLoggedIn, user: currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const calculateScores = (answers) => {
    const scores = { E_I: 0, S_N: 0, T_F: 0, J_P: 0 };
    scores.E_I += answers[0] + answers[1] + answers[2] + answers[3];
    scores.E_I -= answers[16] + answers[17] + answers[18] + answers[19];
    scores.S_N += answers[4] + answers[5] + answers[6] + answers[7];
    scores.S_N -= answers[20] + answers[21] + answers[22] + answers[23];
    scores.T_F += answers[8] + answers[9] + answers[10] + answers[11];
    scores.T_F -= answers[24] + answers[25] + answers[26] + answers[27];
    scores.J_P += answers[12] + answers[13] + answers[14] + answers[15];
    scores.J_P -= answers[28] + answers[29] + answers[30] + answers[31];
    return scores;
  };

  const getPersonalityType = (scores) => {
    const personality = [];
    personality.push(scores.E_I > 0 ? 'E' : 'I');
    personality.push(scores.S_N > 0 ? 'S' : 'N');
    personality.push(scores.T_F > 0 ? 'T' : 'F');
    personality.push(scores.J_P > 0 ? 'J' : 'P');
    return personality.join('');
  };

  const handleOptionSelect = (index, answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      toast.error("Please answer all the questions before submitting.");
      return;
    }

    const scores = calculateScores(answers);
    const personality = getPersonalityType(scores);

    setIsLoading(true);

    try {
      if (!isLoggedIn || !token) {
        toast.error("You are not logged in. Please log in first.");
        setIsLoading(false);
        return;
      }

      console.log('Submitting quiz...');
      const quizResponse = await axios.post(
        Api.SUBMIT_QUIZ,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (quizResponse.status !== 200) throw new Error("Error submitting quiz.");

      // Keep Redux user state in sync with the personality type the backend just saved
      const personalityType = quizResponse.data?.personality_type || personality;
      dispatch(
        updateUserProfile({
          ...(currentUser || {}),
          personality_type: personalityType,
        })
      );

      toast.success("Quiz submitted successfully!");
      setIsLoading(false);
      navigate("/personality", { state: { personality: personalityType } });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("There was an error submitting the quiz. Please try again.");
      setIsLoading(false);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <div style={styles.quizWrapper}>
      <div style={styles.quizContainer}>
        <div style={styles.questionContainer}>
          <div id="question" style={styles.question}>
            {`${currentQuestionIndex * 1 + 1}. ${questions[currentQuestionIndex]}`}
          </div>
          <div style={styles.sliderOptions}>
            <span style={styles.label}>Agree</span>
            <div style={styles.circles}>
              {[1, 2, 3, 4, 5].map((value) => {
                const isActive = answers[currentQuestionIndex] === value;
                const circleStyle = {
                  ...styles.circle,
                  ...circleBaseStyles[value],
                  ...(isActive ? activeCircleStyles[value] : {}),
                };
                return (
                  <div
                    key={value}
                    style={circleStyle}
                    onClick={() => handleOptionSelect(currentQuestionIndex, value)}
                  ></div>
                );
              })}
            </div>
            <span style={styles.label}>Disagree</span>
          </div>
        </div>
        <div style={styles.navigationButtons}>
          <button
            onClick={goToPrevious}
            style={currentQuestionIndex === 0 ? {...styles.preNextButton, ...styles.preNextButtonDisabled} : styles.preNextButton}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              style={isLoading ? {...styles.preNextButton, ...styles.preNextButtonDisabled} : styles.preNextButton}
              disabled={isLoading}
            >
              Submit Quiz
            </button>
          ) : (
            <button onClick={goToNext} style={styles.preNextButton}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
