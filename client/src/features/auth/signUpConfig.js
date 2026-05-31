import { z } from "zod";

export const signUpRoles = [
  { value: "patient", label: "Patient" },
  { value: "doctor", label: "Doctor" },
  { value: "nurse", label: "Nurse" },
  { value: "volunteer", label: "Volunteer" },
];

export const signUpSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().min(6, "Phone number must be at least 6 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["patient", "doctor", "nurse", "volunteer"], { required_error: "Role is required", invalid_type_error: "Please select a valid role" }),
});
