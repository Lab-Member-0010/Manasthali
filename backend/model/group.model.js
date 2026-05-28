import mongoose from 'mongoose';

const groupMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    readBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

groupMessageSchema.index({ group: 1, createdAt: -1 });

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GroupMessage' }],
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

groupSchema.index({ communityId: 1 });
groupSchema.index({ members: 1 });

export const Group = mongoose.model('Group', groupSchema);
export default mongoose.model('GroupMessage', groupMessageSchema);
