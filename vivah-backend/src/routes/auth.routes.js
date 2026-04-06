import express from 'express';
import {
  sendOtp,
  verifyOtp,
  loginWithPassword,
  refreshToken,
  logout
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginWithPassword);
router.post('/refresh', refreshToken);

// Logout needs a valid token (best-effort — still works if expired)
router.post('/logout', verifyToken, logout);

export default router;