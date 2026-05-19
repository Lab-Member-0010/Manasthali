import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Api from "../../apis/Api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as styles from "./Quiz.styles";

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

  const { token, isLoggedIn } = useSelector((state) => state.user);
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

      toast.success("Quiz submitted successfully!");
      setIsLoading(false);
      navigate("/personality", { state: { personality } });
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
