import express from 'express';
import {
  createBooking,
  getUserBookings,
  getOwnerBookings,
  updateBookingStatus,
  cancelBooking,
  createOfflineBooking
} from '../controllers/booking.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// All booking routes require authentication
router.use(verifyToken);

// ── Static paths BEFORE parameterised /:id routes ─────────────────────────
router.post(
  '/',
  authorizeRoles('USER', 'OWNER', 'AGENT', 'ADMIN'),
  createBooking
);

router.get(
  '/my',
  authorizeRoles('USER', 'OWNER', 'AGENT', 'ADMIN'),
  getUserBookings
);

router.get(
  '/hall-bookings',
  authorizeRoles('OWNER', 'AGENT', 'ADMIN'),
  getOwnerBookings
);

router.post(
  '/offline',
  authorizeRoles('OWNER', 'AGENT', 'ADMIN'),
  createOfflineBooking
);

// ── Parameterised /:id routes ─────────────────────────────────────────────
router.put(
  '/:id/status',
  authorizeRoles('OWNER', 'AGENT', 'ADMIN'),
  updateBookingStatus
);

router.put(
  '/:id/cancel',
  authorizeRoles('USER', 'OWNER', 'AGENT', 'ADMIN'),
  cancelBooking
);

export default router;