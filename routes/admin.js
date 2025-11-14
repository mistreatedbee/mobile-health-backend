import express from "express";
import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

router.get("/patients", async (req, res) => {
  const users = await User.find({ role: "patient" });
  res.json(users);
});

router.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

router.get("/stats", async (req, res) => {
  const users = await User.find();
  const appointments = await Appointment.find();

  res.json({
    totalPatients: users.filter(u => u.role === "patient").length,
    totalDoctors: users.filter(u => u.role === "doctor" && u.status === "approved").length,
    totalAppointments: appointments.length,
    onlineAppointments: appointments.filter(a => a.type === "online").length,
    inPersonAppointments: appointments.filter(a => a.type === "in-person").length
  });
});

export default router;
