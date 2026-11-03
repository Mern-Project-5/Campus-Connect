import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['AI/ML', 'Coding', 'Placements', 'Academics', 'Design', 'Robotics', 'Sports'],
      required: true,
    },
    description: { type: String, required: true },
    avatar_url: { type: String },
    banner_url: { type: String },
    members: { type: [String], default: [] }, // Array of user IDs
    members_count: { type: Number, default: 1 },
    created_by: { type: String },
  },
  { timestamps: true }
);

export const Community = mongoose.model('Community', communitySchema);

