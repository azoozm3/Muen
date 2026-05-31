import { z } from "zod";
import { insertEmergencyRequestSchema, requestStatuses } from "../../../shared/schema.js";

export const createEmergencyRequestSchema = insertEmergencyRequestSchema;
export const requestLocationSchema = z.object({
  location: z.string().min(1, "Location is required").optional(),
  latitude: z.number().min(-90, "Latitude must be at least -90").max(90, "Latitude must be at most 90"),
  longitude: z.number().min(-180, "Longitude must be at least -180").max(180, "Longitude must be at most 180"),
});
export const responderLocationSchema = z.object({
  latitude: z.number().min(-90, "Latitude must be at least -90").max(90, "Latitude must be at most 90"),
  longitude: z.number().min(-180, "Longitude must be at least -180").max(180, "Longitude must be at most 180"),
});
export const requestStatusSchema = z.object({ status: z.enum(requestStatuses, { required_error: "Status is required", invalid_type_error: "Please select a valid status" }) });
export const cancelReasons = ["I got help", "Mistake", "No longer needed", "Other"];
export const requestStatusUpdateSchema = z.object({
  status: z.enum(requestStatuses, { required_error: "Status is required", invalid_type_error: "Please select a valid status" }),
  cancelReason: z.enum(cancelReasons, { invalid_type_error: "Please select a valid cancel reason" }).optional(),
  cancelReasonNote: z.string().trim().max(200, "Cancel reason note must be less than 200 characters").optional().nullable(),
});
export const emergencyReviewSchema = z.object({
  rating: z.number().int("Rating must be a whole number").min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().trim().optional().default(""),
});
