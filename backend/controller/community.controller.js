import Community from '../model/community.model.js';
import { Group } from '../model/group.model.js';
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

export const getAllCommunities = asyncHandler(async (req, res) => {
    const communities = await Community.find();
    return res.status(200).json({ success: true, data: communities });
});

export const getCommunityDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const community = await Community.findById(id);
    if (!community) {
        return res.status(404).json({ success: false, message: "Community not found" });
    }
    return res.status(200).json({ success: true, data: community });
});

export const getGroupsInCommunity = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const groups = await Group.find({ communityId: id });
    if (!groups) {
        return res.status(404).json({ success: false, message: "No groups found in this community" });
    }
    return res.status(200).json({ success: true, data: groups });
});

export const createCommunity = asyncHandler(async (req, res) => {
    const { name, description, personality_type } = req.body;

    if (!name) {
        return res.status(400).json({ success: false, message: "Community name is required" });
    }

    const newCommunity = new Community({
        name,
        description,
        personality_type
    });

    const savedCommunity = await newCommunity.save();
    return res.status(201).json({ success: true, data: savedCommunity });
});
