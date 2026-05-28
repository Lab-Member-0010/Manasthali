import { Group } from '../model/group.model.js';
import Community from '../model/community.model.js';
import { User } from '../model/user.model.js';
import asyncHandler from "../middleware/asyncHandler.js";
import logger from "../middleware/logger.js";

// create group
export const createGroup = asyncHandler(async (req, res) => {
  try {
    const { personality_type, name, description } = req.body;

    const community = await Community.findOne({ personality_type });
    logger.info(community)
    if (!community) {
      return res.status(404).json({ message: "Community with this personality type not found" });
    }

    const newGroup = new Group({
      name: name,
      description: description,
      communityId: community._id,
      createdBy: req.user?._id,
    });
    logger.info(newGroup)
    await newGroup.save();

    return res.status(201).json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    logger.error("Error creating group:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Get group details
export const getGroupDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id)
      .populate('communityId')
      .populate('members', 'username email');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(group);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update group details
export const updateGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, communityId } = req.body;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Authorization check: Make sure the user is the creator or admin
    if (!group.createdBy || group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You are not the creator of this group" });
    }

    const updatedGroup = await Group.findByIdAndUpdate(id, { name, description, communityId }, { new: true });
    if (!updatedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json(updatedGroup);
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Delete a group
export const deleteGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Authorization check: Make sure the user is the creator or admin
    if (!group.createdBy || group.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You are not the creator of this group" });
    }

    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.json({ message: 'Group deleted' });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Join a group
export const joinGroup = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Add the user to the group members list if not already a member
    if (group.members.some(id => id.toString() === userId.toString())) {
      return res.status(400).json({ message: 'You are already a member of this group' });
    }

    group.members.push(userId);
    await group.save();
    res.status(200).json({ message: 'Successfully joined the group', group });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Leave a group
export const leaveGroup = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is already a member before attempting to leave
    if (!group.members.some(id => id.toString() === userId.toString())) {
      return res.status(400).json({ message: 'You are not a member of this group' });
    }

    group.members = group.members.filter(memberId => memberId.toString() !== userId.toString());
    await group.save();
    res.status(200).json({ message: 'Successfully left the group', group });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get group members
export const getGroupMembers = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findById(id).populate('members', 'username email');
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }
    res.status(200).json({ members: group.members });
  } catch (err) {
    logger.error(err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// get groups by personality
export const getGroups = asyncHandler(async (req, res) => {
  try {
    const communityName = req.params.personality_type; 

    const community = await Community.findOne({ personality_type: communityName });

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const groups = await Group.find({ communityId: community._id });

    return res.status(200).json(groups);
  } catch (error) {
    logger.error("Error fetching groups:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


export const getJoinedGroups = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find groups that the user is a member of
    const joinedGroups = await Group.find({ members: req.user.id });

    return res.status(200).json(joinedGroups);
  } catch (error) {
    logger.error('Error fetching joined groups:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
