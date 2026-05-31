import { z } from "zod";

export const createAppointmentSchema = z.object({
  doctorId: z.string().min(1, "Doctor is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  reason: z.string().optional().default(""),
  appointmentType: z.enum(["in_person", "online"], { invalid_type_error: "Please select a valid appointment type" }).optional().default("in_person"),
  paymentOrderId: z.string().min(1, "Payment is required"),
});

export const appointmentResponseSchema = z.object({
  action: z.enum(["confirmed", "rejected"], { required_error: "Action is required", invalid_type_error: "Please select a valid action" }),
});

export const appointmentCancelSchema = z.object({
  reason: z.string().optional().default(""),
});

export const prescriptionItemSchema = z.object({
  medicineName: z.string().optional().default(""),
  dosage: z.string().optional().default(""),
  frequency: z.string().optional().default(""),
  duration: z.string().optional().default(""),
  notes: z.string().optional().default(""),
});

export const appointmentNotesSchema = z.object({
  consultationSummary: z.string().optional().default(""),
  prescription: z.array(prescriptionItemSchema).optional().default([]),
});

export const appointmentReviewSchema = z.object({
  rating: z.coerce.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().optional().default(""),
});

export const appointmentStatusSchema = z.object({
  status: z.enum(["completed"], { required_error: "Status is required", invalid_type_error: "Please select a valid status" }),
});
