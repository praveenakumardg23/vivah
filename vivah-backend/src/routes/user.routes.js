import express from 'express';
import { getProfile, sendEmailOtp, updateProfile, verifyEmailOtp } from '../controllers/user.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(verifyToken);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

router.post("/email/send-otp", sendEmailOtp);
router.post("/email/verify-otp", verifyEmailOtp);

export default router;