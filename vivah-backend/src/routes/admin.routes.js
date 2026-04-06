import express from 'express';
import {
  getAllUsers,
  registerAgent,
  registerOwner,
  updateUserRole,
  getAllAgents,
  getAllOwners
} from '../controllers/admin.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(verifyToken);

// Admin only
router.get('/users', authorizeRoles('ADMIN'), getAllUsers);
router.post('/register-agent', authorizeRoles('ADMIN'), registerAgent);
router.put('/users/:id/role', authorizeRoles('ADMIN'), updateUserRole);
router.get('/agents', authorizeRoles('ADMIN'), getAllAgents);

// Admin + Agent
router.post('/register-owner', authorizeRoles('ADMIN', 'AGENT'), registerOwner);
router.get('/owners', authorizeRoles('ADMIN', 'AGENT'), getAllOwners);

export default router;