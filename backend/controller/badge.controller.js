import Badge from '../model/badge.model.js';
import { User } from '../model/user.model.js';
import { ChallengesFile } from '../model/challengesFile.model.js';
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

export const getUserBadges = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const badges = await Badge.find({ userId: userId });
    if (!badges.length) {
      return res.status(404).json({ error: "No badges found for this user" });
    }

    res.status(200).json(badges);
  } catch (error) {
    logger.error("Error fetching user badges:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export const getTodayBadge = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId).select('personality_type');
    if (!user || !user.personality_type) {
      return res.status(404).json({ error: "User not found or personality type missing" });
    }

    const personalityType = user.personality_type;
    
    const challengesFile = await ChallengesFile.findOne({});
    if (!challengesFile || !challengesFile.personalityTypes) {
      return res.status(404).json({ error: "Challenges file not found" });
    }

    const today = new Date();
    const dayOfMonth = today.getDate() % 30 || 30;
    const typeData = challengesFile.personalityTypes.find((pt) => pt.type === personalityType);
    if (!typeData) {
      return res.status(404).json({ error: "No challenge data found for this personality type" });
    }

    const todayChallenge = typeData.dares.find((dare) => dare.day === dayOfMonth);
    if (!todayChallenge) {
      return res.status(404).json({ error: "No challenge found for today" });
    }

    const badgeName = `${today.toLocaleString('default', { month: 'short' })}${today.getDate()}`;
    const badgeDescription = todayChallenge.challenge;

    const existingBadge = await Badge.findOne({ userId, name: badgeName });
    if (existingBadge) {
      return res.status(200).json({ message: "Badge already allocated today", badge: existingBadge });
    }

    const newBadge = new Badge({
      name: badgeName,
      description: badgeDescription,
      userId: userId,
    });

    await newBadge.save();

    res.status(200).json({ message: "Badge allocated successfully", badge: newBadge });
  } catch (error) {
    logger.error("Error allocating badge:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
