import express from "express";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

/* ---------------------------------------------------
   GET ALL PATIENTS
--------------------------------------------------- */
router.get("/patients", async (req, res) => {
  try {
    const users = await User.find({ role: "patient" }).select("-password");
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load patients" });
  }
});

/* ---------------------------------------------------
   DELETE USER
--------------------------------------------------- */
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
});

/* ---------------------------------------------------
   FIXED ADMIN STATS — SAFARI SAFE
--------------------------------------------------- */
router.get("/stats", async (req, res) => {
  try {
    const users = await User.find().lean();
    const appointments = await Appointment.find().lean();

    const stats = {
      totalPatients: users.filter(u => u.role === "patient").length,
      totalDoctors: users.filter(u => u.role === "doctor" && u.status === "approved").length,
      totalAppointments: appointments.length,
      onlineAppointments: appointments.filter(a => a.type === "online").length,
      inPersonAppointments: appointments.filter(a => a.type === "in-person").length
    };

    // Safari needs explicit JSON + success wrapper
    res.status(200).json({
      success: true,
      ...stats
    });

  } catch (err) {
    console.error("Admin /stats error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load stats"
    });
  }
});

export default router;
