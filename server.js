/* eslint-env node */
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import admin from "firebase-admin";


import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import appointmentRoutes from "./routes/appointments.js";
import prescriptionRoutes from "./routes/prescriptions.js";
import doctorRoutes from "./routes/doctors.js";
import patientRoutes from "./routes/patients.js";
import adminRoutes from "./routes/admin.js";
import pushRoutes from "./routes/push.js";
import notificationRoutes from "./routes/notifications.js";
import notesRoutes from "./routes/notes.js";

dotenv.config({ path: "./.env" });

const app = express();

/* ---------------------------------------------------
   ✅ CORS FIX — ALLOW React Web App Access
--------------------------------------------------- */
app.use(
  cors({
    origin: "http://localhost:5173", // Your React frontend
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(express.json());

/* ---------------------------------------------------
   ✅ Debug Log
--------------------------------------------------- */
console.log("🔍 MONGO_URI Loaded:", process.env.MONGO_URI ? "YES ✅" : "NO ❌");

/* ---------------------------------------------------
   ✅ MongoDB Connect
--------------------------------------------------- */
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((error) => console.log("❌ MongoDB Connection Error:", error.message));

/* ---------------------------------------------------
   ✅ Firebase Admin Setup (FCM Notifications)
--------------------------------------------------- */
(function initFirebaseAdmin() {
  try {
    if (admin.apps.length) return;
    const keyPath =
      process.env.GOOGLE_APPLICATION_CREDENTIALS &&
      fs.existsSync(process.env.GOOGLE_APPLICATION_CREDENTIALS)
        ? process.env.GOOGLE_APPLICATION_CREDENTIALS
        : path.resolve("./firebase-service-account.json");

    if (fs.existsSync(keyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log("✅ Firebase Admin initialized with service account");
    } else {
      console.log("⚠️ Firebase Admin not initialized (service account not found)");
    }
  } catch (e) {
    console.log("⚠️ Firebase Admin init error:", e.message);
  }
})();

/* ---------------------------------------------------
   ✅ Test Route
--------------------------------------------------- */
app.get("/", (_req, res) => {
  res.send("✅ Backend API is running correctly");
});

/* ---------------------------------------------------
   ✅ Routes
--------------------------------------------------- */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/appointments", appointmentRoutes);
app.use("/prescriptions", prescriptionRoutes);
app.use("/doctors", doctorRoutes);
app.use("/patients", patientRoutes);
app.use("/admin", adminRoutes);
app.use("/push", pushRoutes);
app.use("/notifications", notificationRoutes);
app.use("/notes", notesRoutes); // ✅ Add this

/* ---------------------------------------------------
   ✅ Start Server
--------------------------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server Running → http://localhost:${PORT}`)
);

export default app;
