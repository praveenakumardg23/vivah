import express from 'express';
import {
  getAllHalls,
  getHallById,
  getAgentHalls,
  getOwnerHalls,
  createHall,
  updateHall,
  deleteHall,
  updateBlockedDates
} from '../controllers/hall.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────
router.get('/', getAllHalls);

// ── Protected: static named paths BEFORE /:id ─────────────────────────────
// (Express matches routes top-down; /my/agent would be swallowed by /:id
//  if /:id were registered first.)

router.get(
  '/my/agent',
  verifyToken,
  authorizeRoles('AGENT', 'ADMIN'),
  getAgentHalls
);

router.get(
  '/my/owner',
  verifyToken,
  authorizeRoles('OWNER', 'AGENT', 'ADMIN'),
  getOwnerHalls
);

router.post(
  '/',
  verifyToken,
  authorizeRoles('AGENT', 'ADMIN'),
  createHall
);

// ── Parameterised routes — registered AFTER all static paths ──────────────
router.get('/:id', getHallById);   // public — detail page visible before login

router.put(
  '/:id',
  verifyToken,
  authorizeRoles('AGENT', 'ADMIN'),
  updateHall
);

router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('AGENT', 'ADMIN'),
  deleteHall
);

router.put(
  '/:id/blocked-dates',
  verifyToken,
  authorizeRoles('OWNER', 'AGENT', 'ADMIN'),
  updateBlockedDates
);

export default router;