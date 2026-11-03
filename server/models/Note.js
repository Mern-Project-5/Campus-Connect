import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    author: {
      id: String,
      full_name: String,
      username: String,
      avatar_url: String,
    },
    title: { type: String, required: true },
    subject: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: String, required: true },
    description: { type: String, required: true },
    file_url: { type: String, default: '#' },
    file_name: { type: String, required: true },
    file_size: { type: String, required: true },
    downloads_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Note = mongoose.model('Note', noteSchema);

