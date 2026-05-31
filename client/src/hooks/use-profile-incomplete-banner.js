import { useMemo } from "react";

const REQUIRED_BY_ROLE = {
  doctor: ["specialty", "phone", "address", "bio", "licenseNumber", "clinicAddress", "yearsOfExperience"],
  nurse: ["phone", "address", "bio", "licenseNumber", "yearsOfExperience"],
  volunteer: ["phone", "volunteerAvailability", "volunteerCoverageArea", "volunteerNotes"],
};

export function useProfileIncompleteBanner(profile) {
  return useMemo(() => {
    if (!profile) return false;
    if (profile.active === true) return false;
    const required = REQUIRED_BY_ROLE[profile.role];
    if (!required) return false;

    const missingScalar = required.some((field) => {
      const value = profile[field];
      return value === undefined || value === null || String(value).trim() === "";
    });

    const missingArrays =
      profile.role === "volunteer" &&
      (!Array.isArray(profile.volunteerSupportTypes) || profile.volunteerSupportTypes.length === 0);

    return missingScalar || missingArrays;
  }, [profile]);
}
