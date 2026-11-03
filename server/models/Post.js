import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    author: {
      id: String,
      full_name: String,
      username: String,
      avatar_url: String,
      department: String,
      account_type: String,
      role: String,
      is_verified: Boolean,
    },
    content: { type: String, required: true },
    post_type: {
      type: String,
      enum: ['regular', 'project', 'question', 'achievement', 'notes'],
      default: 'regular',
    },
    media_url: String,
    media_type: {
      type: String,
      enum: ['image', 'pdf', 'document'],
    },
    attachment_name: String,
    attachment_size: String,
    tags: { type: [String], default: [] },
    community_id: String,
    community_name: String,
    likes: { type: [String], default: [] }, // Array of user IDs who liked
    likes_count: { type: Number, default: 0 },
    comments_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Post = mongoose.model('Post', postSchema);

