import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import {
  generateAccessToken,
  generateRefreshToken
} from '../utils/generateTokens.js';
import jwt from 'jsonwebtoken';
import { sendSms, verifyOtpSms } from '../services/sms.service.js';

// POST /auth/send-otp
export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ msg: 'Invalid phone number' });
    }

    await sendSms(phone);
    res.json({ msg: 'OTP sent successfully' });
  } catch (error) {
    console.error('sendOtp error:', error.message);
    res.status(500).json({ msg: 'Failed to send OTP' });
  }
};

// POST /auth/verify-otp
export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const verification = await verifyOtpSms(phone, otp);

    if (verification.status !== 'approved') {
      return res.status(400).json({ msg: 'Invalid OTP' });
    }

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone, role: 'USER' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    // Return token + user (including role)
    res.json({
      token: accessToken,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        refreshToken
      }
    });
  } catch (error) {
    console.error('verifyOtp error:', error.message);
    res.status(500).json({ msg: 'OTP verification failed' });
  }
};

// POST /auth/login  (Agent / Owner / Admin - email + password)
export const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Regular USERs must use OTP
    if (user.role === 'USER') {
      return res.status(403).json({ msg: 'Please use OTP login' });
    }

    if (!user.password) {
      return res.status(400).json({ msg: 'Password not set for this account' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      role: user.role,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// POST /auth/refresh
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ msg: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ msg: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    return res.status(403).json({ msg: 'Token expired or invalid' });
  }
};

// POST /auth/logout
export const logout = async (req, res) => {
  try {
    // req.user may not be set if token already expired — handle gracefully
    if (req.user?.id) {
      await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    }
    res.json({ msg: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};