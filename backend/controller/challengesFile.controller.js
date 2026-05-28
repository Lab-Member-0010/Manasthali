import { User } from "../model/user.model.js";
import {ChallengesFile} from "../model/challengesFile.model.js";
import asyncHandler from "../middleware/asyncHandler.js";

export const getDailyChallenge = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId).select("personality_type");

  if (!user || !user.personality_type) {
    return res.status(404).json({ error: "User or personality type not found" });
  }

  const personalityType = user.personality_type;

  const challengesFile = await ChallengesFile.findOne({});
  if (!challengesFile || !challengesFile.personalityTypes) {
    return res.status(404).json({ error: "Challenges file not found or missing personality types" });
  }

  const typeData = challengesFile.personalityTypes.find((pt) => pt.type === personalityType);

  if (!typeData) {
    return res.status(404).json({ error: "No challenges found for this personality type" });
  }

  const today = new Date();
  const dayOfMonth = today.getDate() % 30 || 30;
  const todayChallenge = typeData.dares.find((dare) => dare.day === dayOfMonth);

  if (!todayChallenge) {
    return res.status(404).json({ error: "No challenge found for today" });
  }

  res.status(200).json({
    message: "Today's challenge fetched successfully",
    challenge: todayChallenge.challenge,
  });
});
