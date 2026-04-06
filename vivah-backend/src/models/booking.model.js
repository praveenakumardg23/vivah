import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    hall: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hall',
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: { type: Date, required: true },
    guests: { type: Number, required: true },
    notes: { type: String },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'REJECTED', 'CANCELLED'],
      default: 'PENDING'
    },
    // For offline/manual bookings added by owner
    isOfflineBooking: { type: Boolean, default: false },
    offlineGuestName: { type: String },
    offlineGuestPhone: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);