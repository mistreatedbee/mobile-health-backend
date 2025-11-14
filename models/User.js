import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Shared
    firstName: { type: String, required: true },
    lastName:  { type: String, required: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true },
    role:      { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },

    // Shared optionals
    phone:   { type: String },
    province:{ type: String },
    city:    { type: String },

    // Patient profile (optional)
    age: { type: Number },
    gender: { type: String },
    dateOfBirth: { type: String },
    bloodType: { type: String },
    allergies: [{ type: String }],
    chronicConditions: [{ type: String }],
    currentMedications: [{ type: String }],
    pastProcedures: [{ type: String }],
    medicalHistory: { type: String }, // ✅ Added
    emergencyContactName: { type: String },
    emergencyContactPhone: { type: String },

    // Doctor fields
    specialty:           { type: String },
    registrationNumber:  { type: String },
    yearsOfExperience:   { type: Number },
    clinicName:          { type: String },
    status:              { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

    // Push notifications
    pushToken:           { type: String }, // FCM/APNs/Capacitor token
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
