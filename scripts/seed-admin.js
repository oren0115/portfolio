#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const envPath = path.resolve(process.cwd(), ".env.local");
dotenv.config({ path: envPath });
dotenv.config(); // fallback to .env if available

const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing required env variables. Please set MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD."
  );
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model("User", UserSchema, "users");

async function seed() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  const email = ADMIN_EMAIL.toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin user already exists for ${email}. Skipping.`);
    return;
  }
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await User.create({ email, passwordHash, role: "admin" });
  console.log(`Admin user created for ${email}.`);
}

seed()
  .catch((error) => {
    console.error("Failed to seed admin user:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });

