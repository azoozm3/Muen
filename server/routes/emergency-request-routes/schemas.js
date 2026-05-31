import { z } from "zod";
import { insertEmergencyRequestSchema, requestStatuses } from "../../../shared/schema.js";

export const createEmergencyRequestSchema = insertEmergencyRequestSchema;
export const requestLocationSchema = z.object({
  location: z.string().min(1).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
export const responderLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});
export const requestStatusSchema = z.object({ status: z.enum(requestStatuses) });
export const cancelReasons = ["I got help", "Mistake", "No longer needed", "Other"];
export const requestStatusUpdateSchema = z.object({
  status: z.enum(requestStatuses),
  cancelReason: z.enum(cancelReasons).optional(),
  cancelReasonNote: z.string().trim().max(200).optional().nullable(),
});
export const emergencyReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().optional().default(""),
});
