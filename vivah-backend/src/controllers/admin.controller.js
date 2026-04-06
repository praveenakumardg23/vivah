import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

// GET all users (Admin only)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-refreshToken -password -otp -otpExpiry');
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// POST register an Agent (Admin only)
// Admin sends phone + sets role to AGENT
export const registerAgent = async (req, res) => {
  try {
    const { phone, name } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ msg: 'Invalid phone number' });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone, name: name || '', role: 'AGENT' });
    } else {
      user.role = 'AGENT';
      if (name) user.name = name;
      await user.save();
    }

    res.status(201).json({ msg: 'Agent registered', user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// PUT change user role (Admin only)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['USER', 'AGENT', 'OWNER', 'ADMIN'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ msg: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-refreshToken -password');

    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET all agents (Admin)
export const getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'AGENT' }).select('-refreshToken -password');
    res.json(agents);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// GET all owners (Admin / Agent)
export const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'OWNER' }).select('-refreshToken -password');
    res.json(owners);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// POST register an Owner (Agent or Admin)
// Agents can register owners via this route
export const registerOwner = async (req, res) => {
  try {
    const { phone, name } = req.body;

    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({ msg: 'Invalid phone number' });
    }

    let user = await User.findOne({ phone });

    if (!user) {
      user = await User.create({ phone, name: name || '', role: 'OWNER' });
    } else if (user.role === 'USER') {
      user.role = 'OWNER';
      if (name) user.name = name;
      await user.save();
    } else {
      return res.status(400).json({ msg: 'User already has role: ' + user.role });
    }

    res.status(201).json({ msg: 'Owner registered', user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};