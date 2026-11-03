import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender_id: { type: String, required: true },
    receiver_id: { type: String, required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);

