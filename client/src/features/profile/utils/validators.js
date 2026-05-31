export function getIncompleteProfileItems(profile) {
  if (!profile) return [];

  const missing = [];
  if (!profile.phone) missing.push("phone number");
  if (!profile.address) missing.push("address");

  if (profile.role === "doctor") {
    if (!profile.specialty) missing.push("specialty");
    if (!profile.licenseNumber) missing.push("license number");
    if (!profile.clinicAddress) missing.push("clinic address");
    if (profile.yearsOfExperience === undefined || profile.yearsOfExperience === null) missing.push("years of experience");
    if (!profile.bio) missing.push("doctor bio");
  }

  if (profile.role === "nurse") {
    if (!profile.licenseNumber) missing.push("license number");
    if (profile.yearsOfExperience === undefined || profile.yearsOfExperience === null) missing.push("years of experience");
    if (!profile.bio) missing.push("nurse bio");
  }

  if (profile.role === "volunteer") {
    if (!Array.isArray(profile.volunteerSupportTypes) || !profile.volunteerSupportTypes.length) {
      missing.push("supported services");
    }
    if (!profile.volunteerAvailability) missing.push("availability");
    if (!profile.volunteerCoverageArea) missing.push("coverage area");
    if (!profile.volunteerNotes) missing.push("volunteer notes");
  }

  return missing;
}

export function isProfileIncomplete(profile) {
  return getIncompleteProfileItems(profile).length > 0;
}
