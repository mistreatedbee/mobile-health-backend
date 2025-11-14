import express from "express";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation
import User from "../models/User.js"; // make sure User model exists

const router = express.Router();

// Get all doctors
router.get("/", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching doctors:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get all approved doctors
router.get("/approved", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", status: "approved" });
    res.json(doctors);
  } catch (err) {
    console.error("Error fetching approved doctors:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Get doctor by ID
router.get("/:id", async (req, res) => {
  try {
    // ✅ Fix: Validate if req.params.id is a valid ObjectId to prevent CastError
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid doctor ID");
    }

    const doctor = await User.findById(req.params.id);
    if (!doctor) return res.status(404).send("Doctor not found");
    res.json(doctor);
  } catch (err) {
    console.error("Error fetching doctor by ID:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Approve / Reject Doctor
router.put("/:id/status", async (req, res) => {
  try {
    // ✅ Fix: Validate if req.params.id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send("Invalid doctor ID");
    }

    const { status } = req.body; // approved | rejected | pending
    const doctor = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!doctor) return res.status(404).send("Doctor not found");
    res.json(doctor);
  } catch (err) {
    console.error("Error updating doctor status:", err);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
