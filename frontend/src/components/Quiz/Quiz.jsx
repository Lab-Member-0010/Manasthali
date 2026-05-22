import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Api from "../../apis/Api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateUserProfile } from "../../redux-config/UserSlice";

const circleSizes = {1: "w-[50px] h-[50px]", 2: "w-[40px] h-[40px]", 3: "w-[30px] h-[30px]", 4: "w-[40px] h-[40px]", 5: "w-[50px] h-[50px]"};
const circleBorders = {1: "border-[#66BB6A]", 2: "border-[#9CCC65]", 3: "border-[#90CAF9]", 4: "border-[#FFA726]", 5: "border-[#EF5350]"};
const circleActiveBgs = {1: "bg-[#66BB6A]", 2: "bg-[#9CCC65]", 3: "bg-[#90CAF9]", 4: "bg-[#FFA726]", 5: "bg-[#EF5350]"};

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
    <div className="flex items-center justify-center h-screen bg-cover bg-center" style={{backgroundImage: "url('https://i.pinimg.com/originals/cf/85/d9/cf85d966c302f3728a0e8f81805c132a.gif')"}}>
      <div className="bg-white/30 rounded-[15px] p-10 w-[700px] h-[300px] shadow-lg backdrop-blur-md border border-white/20">
        <div className="text-center">
          <div id="question" className="text-2xl mb-8 font-bold text-[#333]">
            {`${currentQuestionIndex * 1 + 1}. ${questions[currentQuestionIndex]}`}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl w-[15%] text-center text-[#333]">Agree</span>
            <div className="flex justify-between items-center w-[70%]">
              {[1, 2, 3, 4, 5].map((value) => {
                const isActive = answers[currentQuestionIndex] === value;
                const circleClassName = "rounded-full border-[3px] bg-transparent cursor-pointer " + circleSizes[value] + " " + circleBorders[value] + (isActive ? " " + circleActiveBgs[value] : "");
                return (
                  <div
                    key={value}
                    className={circleClassName}
                    onClick={() => handleOptionSelect(currentQuestionIndex, value)}
                  ></div>
                );
              })}
            </div>
            <span className="text-xl w-[15%] text-center text-[#333]">Disagree</span>
          </div>
        </div>
        <div className="mt-8 flex justify-between">
          <button
            onClick={goToPrevious}
            className={currentQuestionIndex === 0 ? "border-none px-6 py-3 text-xl rounded-[40px] bg-[#cfcfcf] text-gray-500 shadow-md" : "border-none px-6 py-3 text-xl rounded-[40px] bg-[#c093fc] text-white shadow-md"}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className={isLoading ? "border-none px-6 py-3 text-xl rounded-[40px] bg-[#cfcfcf] text-gray-500 shadow-md" : "border-none px-6 py-3 text-xl rounded-[40px] bg-[#c093fc] text-white shadow-md"}
              disabled={isLoading}
            >
              Submit Quiz
            </button>
          ) : (
            <button onClick={goToNext} className="border-none px-6 py-3 text-xl rounded-[40px] bg-[#c093fc] text-white shadow-md">Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
