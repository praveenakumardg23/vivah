import mongoose from 'mongoose';

const hallSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    location: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String },
    capacity: { type: Number, required: true },
    price: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User' // Agent who registered this hall
    },
    isActive: { type: Boolean, default: true },
    blockedDates: [{ type: Date }] // offline bookings / unavailable dates
  },
  { timestamps: true }
);

export default mongoose.model('Hall', hallSchema);