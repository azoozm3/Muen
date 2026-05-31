import { z } from "zod";

export const updateRoleSchema = z.object({
  role: z.enum(["patient", "doctor", "nurse", "volunteer", "admin"], { required_error: "Role is required", invalid_type_error: "Please select a valid role" }),
});

export const toggleStatusSchema = z.object({
  active: z.boolean(),
  approvalStatus: z.enum(["pending", "approved", "rejected"], { invalid_type_error: "Please select a valid approval status" }).optional(),
});

export const markProviderPayoutSchema = z.object({
  providerType: z.enum(["doctor", "nurse"], { required_error: "Provider type is required", invalid_type_error: "Please select a valid provider type" }),
  providerId: z.string().min(1, "Provider is required"),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().optional(),
  role: z.enum(["patient", "doctor", "nurse", "volunteer", "admin"], { invalid_type_error: "Please select a valid role" }).optional(),
  active: z.boolean().optional(),
});

const pricingRowSchema = z.object({
  label: z.string().min(1, "Label is required").optional(),
  price: z.coerce.number().min(0, "Price cannot be negative").optional(),
  platformFee: z.coerce.number().min(0, "Platform fee cannot be negative").optional(),
  currency: z.string().min(1, "Currency is required").optional(),
  active: z.boolean().optional(),
});

export const updateServiceSettingsSchema = z.object({
  servicePricing: z.object({
    appointment: pricingRowSchema.optional(),
    nurseRequest: pricingRowSchema.optional(),
    emergencyRequest: pricingRowSchema.optional(),
  }).optional().default({}),
  paymentProvider: z.object({
    provider: z.string().min(1, "Payment provider is required").optional(),
    mode: z.string().min(1, "Payment mode is required").optional(),
    paypalClientIdPublic: z.string().optional(),
  }).optional().default({}),
});
