import { Quiz } from '../model/quiz.model.js';
import { User } from '../model/user.model.js';
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

export const submitQuiz = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(400).json({ error: 'User not authenticated' });
  }

  const { answers } = req.body;
  const userId = req.user._id;

  const scores = calculateScores(answers);

  const personalityType = getPersonalityType(scores);

  const quiz = new Quiz({
    userId,
    answers,
    scores,
    personality_type: personalityType,
  });

  await quiz.save();

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  user.personality_type = personalityType;
  await user.save();

  return res.status(200).json({
    message: 'Quiz submitted successfully and personality type set!',
    personality_type: personalityType,
  });
});

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
