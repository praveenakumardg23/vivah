/**
 * Admin Seeder Script
 * Run: node seed-admin.js
 *
 * Creates or updates an ADMIN user in the database.
 * Set your desired admin credentials below before running.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

const ADMIN_PHONE = '9999999999';   // ← change this
const ADMIN_EMAIL = 'admin@vivah.com'; // ← change this
const ADMIN_NAME = 'Super Admin';
const ADMIN_PASSWORD = 'Admin@123';  // ← change this (min 8 chars)

// ─── User Schema (inline to avoid import issues) ───────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: String,
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    isEmailVerified: { type: Boolean, default: false },
    password: String,
    refreshToken: String,
    role: { type: String, enum: ['USER', 'AGENT', 'OWNER', 'ADMIN'], default: 'USER' },
    profileCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

// ─── Seed ──────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    const admin = await User.findOneAndUpdate(
      { phone: ADMIN_PHONE },
      {
        name: ADMIN_NAME,
        phone: ADMIN_PHONE,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'ADMIN',
        isEmailVerified: true,
        profileCompleted: true
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin user created/updated:');
    console.log(`   Name  : ${admin.name}`);
    console.log(`   Phone : ${admin.phone}`);
    console.log(`   Email : ${admin.email}`);
    console.log(`   Role  : ${admin.role}`);
    console.log('\n🔐 Login credentials:');
    console.log(`   Email    : ${ADMIN_EMAIL}`);
    console.log(`   Password : ${ADMIN_PASSWORD}`);
    console.log('\nAdmin can also log in via OTP using phone:', ADMIN_PHONE);

  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  }
};

seed();