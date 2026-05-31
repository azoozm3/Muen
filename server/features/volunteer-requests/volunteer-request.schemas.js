import { z } from "zod";
import { volunteerServiceOptions } from "../../../shared/volunteer.js";

export const createVolunteerRequestSchema = z.object({
  serviceType: z.enum(volunteerServiceOptions, { required_error: "Service type is required", invalid_type_error: "Please select a valid service type" }),
  requestedDate: z.string().min(1, "Date is required"),
  requestedTime: z.string().min(1, "Time is required"),
  address: z.string().min(1, "Location is required"),
  locationNote: z.string().trim().max(200, "Location note must be less than 200 characters").optional().default(""),
  details: z.string().trim().max(500, "Details must be less than 500 characters").optional().default(""),
  urgency: z.enum(["low", "medium", "high"], { invalid_type_error: "Please select a valid urgency" }).optional().default("medium"),
  latitude: z.coerce.number().min(-90, "Latitude must be at least -90").max(90, "Latitude must be at most 90"),
  longitude: z.coerce.number().min(-180, "Longitude must be at least -180").max(180, "Longitude must be at most 180"),
  patientName: z.string().trim().min(1, "Patient name is required").max(120, "Patient name must be less than 120 characters").optional(),
  patientPhone: z.string().trim().min(1, "Patient phone is required").max(30, "Patient phone must be less than 30 characters").optional(),
});

export const statusSchema = z.object({
  status: z.enum(["in_progress", "completed"], { required_error: "Status is required", invalid_type_error: "Please select a valid status" }),
});

export const ratingSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  feedback: z.string().trim().max(300, "Feedback must be less than 300 characters").optional().default(""),
});
