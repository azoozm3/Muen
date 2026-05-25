import mongoose from "mongoose";
import { defaultSchemaOptions } from "../lib/mongoose-utils.js";

const medicalHistoryRowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    details: {
      type: String,
      trim: true,
      default: "",
    },
    recordDate: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { _id: true },
);

const userSchema = new mongoose.Schema(
  {
    userNumber: { type: Number, unique: true, index: true, sparse: true },
    publicUserId: { type: String, unique: true, index: true, sparse: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true, enum: ["patient", "doctor", "nurse", "volunteer", "admin"] },
    active: { type: Boolean, default: true },
    approvalStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    phone: { type: String, default: null },
    address: { type: String, default: null },
    gender: { type: String, enum: ["male", "female", "other", null], default: null },
    specialty: { type: String, default: null },
    licenseNumber: { type: String, default: null, trim: true },
    clinicAddress: { type: String, default: null, trim: true },
    availableSlots: [
      {
        day: {
          type: String,
          enum: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        },
        startTime: { type: String, default: "08:00" },
        endTime: { type: String, default: "17:00" },
      },
    ],
    yearsOfExperience: { type: Number, default: null, min: 0 },
    medicalHistory: { type: [medicalHistoryRowSchema], default: [] },
    bio: { type: String, default: null },
    onlineConsultation: { type: Boolean, default: false },
    availabilityStatus: { type: String, enum: ["available", "unavailable"], default: "available" },
    volunteerSupportTypes: { type: [String], default: [] },
    volunteerAvailability: { type: String, default: null },
    volunteerHasTransportation: { type: Boolean, default: false },
    volunteerCoverageArea: { type: String, default: null },
    volunteerNotes: { type: String, default: null },
    rating: { type: Number, default: null },
    patientRating: { type: Number, default: null },
    patientRatingCount: { type: Number, default: 0 },
    profileImage: { type: String, default: null },
    medicalRecordAcknowledged: { type: Boolean, default: false },
    medicalPdfUrl: { type: String, default: null },
  },
  defaultSchemaOptions,
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
