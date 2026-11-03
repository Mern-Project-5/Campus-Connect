import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    post_id: { type: String, required: true },
    user_id: { type: String, required: true },
    author: {
      id: String,
      full_name: String,
      username: String,
      avatar_url: String,
    },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export const Comment = mongoose.model('Comment', commentSchema);

