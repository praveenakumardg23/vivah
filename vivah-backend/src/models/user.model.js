import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  phone: {
    type: String,
    required: true,
    unique: true
  },
  email: String,
  password: String,
  refreshToken: String,
  role: {
    type: String,
    enum: ["USER", "AGENT", "OWNER", "ADMIN"],
    default: "USER"
  },
  otp: String,
  otpExpiry: Date,
  profileCompleted: {
    type: Boolean,
    default: false
  }  
}, { timestamps: true });

export default mongoose.model('User', userSchema);