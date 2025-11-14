import express from "express";
import Notification from "../models/Notification.js";

const router = express.Router();

// Get Notifications for User
router.get("/:userId", async (req, res) => {
  const list = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json({ success: true, notifications: list });
});

// Mark As Read
router.put("/:id/read", async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ success: true });
});

export default router;
