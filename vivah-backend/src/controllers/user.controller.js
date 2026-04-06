import User from '../models/user.model.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-refreshToken -password -otp -otpExpiry -emailOtp -emailOtpExpiry');
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select('-refreshToken -password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// SEND EMAIL OTP
export const sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is already taken by another user
    const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
    if (existing) {
      return res.status(400).json({ msg: 'Email already in use' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await User.findByIdAndUpdate(req.user.id, {
      email,
      emailOtp: otp,
      emailOtpExpiry: expiry,
      isEmailVerified: false
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Vivah - Email Verification OTP',
      html: `<p>Your OTP is <strong>${otp}</strong>. Valid for 10 minutes.</p>`
    });

    res.json({ msg: 'OTP sent to email' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// VERIFY EMAIL OTP
export const verifyEmailOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.emailOtp || user.emailOtp !== otp) {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    if (new Date() > user.emailOtpExpiry) {
      return res.status(400).json({ msg: 'OTP expired' });
    }

    user.isEmailVerified = true;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;
    await user.save();

    res.json({ msg: 'Email verified' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};