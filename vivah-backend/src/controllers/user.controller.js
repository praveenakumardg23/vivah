import User from "../models/user.model.js";
import { sendOtpEmail } from "../services/email.service.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-refreshToken");

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, email, isEmailVerified } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, isEmailVerified },
      { returnDocument: "after" },
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const sendEmailOtp = async (req, res) => {
  const { email } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { email, isEmailVerified: false },
    { returnDocument: "after" },
  );

  if (!user) {
    user = await User.create({ email });
  }

  const otp = generateOTP();

  user.emailOtp = otp;
  user.emailOtpExpiry = Date.now() + 5 * 60 * 1000; // 5 min

  await user.save();

  await sendOtpEmail(email, otp);

  res.json({ message: "OTP sent to email" });
};

export const verifyEmailOtp = async (req, res) => {
  const { email, otp } = req.body;

  console.log("email " + email);
  console.log("otp " + otp);

  const user = await User.findOne({
    email,
    emailOtp: otp,
    emailOtpExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isEmailVerified = true;
  user.emailOtp = undefined;
  user.emailOtpExpiry = undefined;

  await user.save();

  res.json({ message: "Email verified successfully" });
};
