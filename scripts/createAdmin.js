/* eslint-disable no-undef */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import User from "../models/User.js";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const exists = await User.findOne({ email: "admin@health.com" });
    if (exists) {
      console.log("✅ Admin already exists. No action taken.");
      process.exit();
    }

    const hashed = await bcrypt.hash("admin123", 10);

    await User.create({
      firstName: "System",
      lastName: "Admin",
      email: "admin@health.com",
      password: hashed,
      role: "admin",
      status: "approved"
    });

    console.log("✅ Admin account created:");
    console.log("Email: admin@health.com");
    console.log("Password: admin123");
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();
