import { Award, BriefcaseMedical, Hash, Star, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProfileSectionCard, StarRating } from "./ProfileSectionShared";

function Field({ label, children, icon: Icon }) {
  return (
    <div>
      <Label className={Icon ? "flex items-center gap-1" : undefined}>{Icon ? <Icon className="h-3.5 w-3.5" /> : null} {label}</Label>
      {children}
    </div>
  );
}

export function NurseDetailsSection({ isEditing, profile, formData, setFormData }) {
  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <ProfileSectionCard icon={Award} title="Nurse Information">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Specialty / Service" icon={Stethoscope}>
          {isEditing ? (
            <Input value={formData.specialty || ""} onChange={(e) => updateField("specialty", e.target.value)} placeholder="Home care, ICU, elderly care..." data-testid="input-profile-specialty" />
          ) : <p className="mt-1 text-sm" data-testid="text-profile-specialty">{profile?.specialty || "Not set"}</p>}
        </Field>

        <Field label="License Number" icon={Hash}>
          {isEditing ? (
            <Input value={formData.licenseNumber || ""} onChange={(e) => updateField("licenseNumber", e.target.value)} placeholder="Nursing license number" data-testid="input-profile-license" />
          ) : <p className="mt-1 text-sm" data-testid="text-profile-license">{profile?.licenseNumber || "Not set"}</p>}
        </Field>

        <Field label="Years of Experience" icon={BriefcaseMedical}>
          {isEditing ? (
            <Input type="number" min="0" value={formData.yearsOfExperience ?? ""} onChange={(e) => updateField("yearsOfExperience", e.target.value)} placeholder="0" data-testid="input-profile-experience" />
          ) : <p className="mt-1 text-sm" data-testid="text-profile-experience">{profile?.yearsOfExperience != null ? `${profile.yearsOfExperience} year(s)` : "Not set"}</p>}
        </Field>

        <Field label="Work / Clinic Address">
          {isEditing ? (
            <Input value={formData.clinicAddress || ""} onChange={(e) => updateField("clinicAddress", e.target.value)} placeholder="Hospital, clinic, or service area" data-testid="input-profile-clinic" />
          ) : <p className="mt-1 text-sm" data-testid="text-profile-clinic">{profile?.clinicAddress || "Not set"}</p>}
        </Field>

        <div className="sm:col-span-2">
          <Field label="Bio / Description">
            {isEditing ? (
              <Textarea value={formData.bio || ""} onChange={(e) => updateField("bio", e.target.value)} placeholder="Describe your nursing experience and services" className="min-h-[110px]" data-testid="input-profile-bio" />
            ) : <p className="mt-1 whitespace-pre-wrap text-sm" data-testid="text-profile-bio">{profile?.bio || "Not set"}</p>}
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Label className="flex items-center gap-1"><Star className="h-3.5 w-3.5" /> Rating</Label>
          <StarRating rating={profile?.rating} />
        </div>
      </div>
    </ProfileSectionCard>
  );
}
