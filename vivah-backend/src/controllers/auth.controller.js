import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";
import { sendSms, verifyOtpSms } from "../services/sms.service.js";

export const sendOtp = async (req, res) => {
  try {
    console.log(req)
    const { phone } = req.body;

    // 🔍 Validate phone
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ msg: "Invalid phone number" });
    }

    await sendSms(phone);

    res.json({ msg: "OTP sent successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  const verification = await verifyOtpSms(phone, otp);

  // ❌ Invalid OTP
  if (verification.status !== "approved") {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  // 👤 Find or create user
  let user = await User.findOne({ phone });

  if (!user) {
    user = await User.create({
      phone,
      role: "USER"
    });
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  res.json({ token: accessToken, user });
};

export const loginWithPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ msg: "Invalid credentials" });

    // ❌ Prevent USER login here
    if (user.role === "USER") {
      return res.status(403).json({
        msg: "Use OTP login"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      role: user.role
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ msg: "Refresh token required" });
    }

    // Verify token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decoded.id);

    // ❌ Token mismatch (important security check)
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ msg: "Invalid refresh token" });
    }

    // ✅ Generate new tokens
    const newAccessToken = generateAccessToken(user);

    // 🔥 OPTIONAL: Rotate refresh token (recommended)
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    return res.status(403).json({
      msg: "Token expired or invalid"
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id; // from middleware

    await User.findByIdAndUpdate(userId, {
      refreshToken: null
    });

    res.json({ msg: "Logged out successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};