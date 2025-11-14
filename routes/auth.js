import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

/* ---------------------------------------------------
   REGISTER PATIENT
--------------------------------------------------- */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, ...rest } = req.body;

    const normalizedEmail = String(email || "").toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });
    if (exists)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashed,
      role: "patient",
      ...rest,
    });

    const { password: _, ...safe } = user.toObject();
    res.json({ success: true, user: safe });

  } catch (e) {
    res.status(500).json({ success: false, message: "Patient registration failed" });
  }
});

/* ---------------------------------------------------
   REGISTER DOCTOR
--------------------------------------------------- */
router.post("/register-doctor", async (req, res) => {
  try {
    const data = req.body;
    const normalizedEmail = String(data.email || "").toLowerCase().trim();
    const exists = await User.findOne({ email: normalizedEmail });

    if (exists)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(data.password, 10);

    const doctor = await User.create({
      ...data,
      email: normalizedEmail,
      password: hashed,
      role: "doctor",
      status: "pending",
    });

    const { password: _, ...safe } = doctor.toObject();
    res.json({ success: true, user: safe });

  } catch {
    res.status(500).json({ success: false, message: "Doctor registration failed" });
  }
});

/* ---------------------------------------------------
   LOGIN (FULLY FIXED)
--------------------------------------------------- */
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    // Normalize email
    email = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid email or password" });

    // Remove password from response
    const { password: _pw, ...safeUser } = user.toObject();

    return res.json({ success: true, user: safeUser });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
});

/* ---------------------------------------------------
   CURRENT USER
--------------------------------------------------- */
router.get("/me/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });

  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch user" });
  }
});

export default router;
