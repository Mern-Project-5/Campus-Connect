import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    is_virtual: { type: Boolean, default: false },
    banner_url: { type: String },
    organizer_id: { type: String },
    organizer_name: { type: String },
    attendees: { type: [String], default: [] }, // Array of user IDs
    registered_count: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Event = mongoose.model('Event', eventSchema);

