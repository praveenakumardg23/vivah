import express from 'express';
import { loginWithPassword, sendOtp, verifyOtp, refreshToken, logout } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Password (Agents / Owners)
router.post("/login", loginWithPassword);

// Common
router.post("/refresh", refreshToken);
router.post("/logout", logout);

export default router;