import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema(
  {
    sender_id: { type: String, required: true },
    receiver_id: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

