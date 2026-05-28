import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notification_type:  { type: String, enum: ['like', 'comment'] },
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  read_status: { type: Boolean, default: false }
}, {
  timestamps: true
});

notificationSchema.index({ receiver_id: 1, createdAt: -1 });
notificationSchema.index({ read_status: 1 });

export default mongoose.model('Notification', notificationSchema);