import { HeartHandshake, Shield, Stethoscope, UserRound } from "lucide-react";

export function getRoleIcon(role) {
  if (role === "doctor") return Stethoscope;
  if (role === "nurse") return Shield;
  if (role === "volunteer") return HeartHandshake;
  return UserRound;
}

export function getBackPath(role) {
  if (role === "doctor") return "/dashboard/doctor";
  if (role === "nurse") return "/dashboard/nurse";
  if (role === "volunteer") return "/dashboard/volunteer";
  if (role === "admin") return "/dashboard/admin";
  return "/dashboard/patient/services";
}
