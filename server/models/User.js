import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  link: String,
  tags: [String],
});

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    avatar_url: { type: String },
    cover_url: { type: String },
    account_type: {
      type: String,
      enum: ['student', 'professional'],
      default: 'student',
    },
    role: {
      type: String,
      enum: ['student', 'professional', 'admin'],
      default: 'student',
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    department: { type: String, required: true },
    branch: { type: String, required: true },
    academic_year: { type: String },
    graduation_year: { type: String, required: true },
    company_or_institution: { type: String },
    designation: { type: String },
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    interests: { type: [String], default: [] },
    projects: { type: [projectSchema], default: [] },
    achievements: { type: [String], default: [] },
    linkedin_url: { type: String },
    github_url: { type: String },
    instagram_url: { type: String },
    is_verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);

