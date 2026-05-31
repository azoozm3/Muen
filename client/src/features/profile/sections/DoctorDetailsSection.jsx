import { BriefcaseMedical, Hash, Star, Stethoscope } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { specialties } from "@shared/schema";
import { ProfileSectionCard, StarRating } from "./ProfileSectionShared";

function Field({ label, children, icon: Icon }) {
  return (
    <div>
      <Label className={Icon ? "flex items-center gap-1" : undefined}>{Icon ? <Icon className="h-3.5 w-3.5" /> : null} {label}</Label>
      {children}
    </div>
  );
}

export function DoctorDetailsSection({ isEditing, profile, formData, setFormData }) {
  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <ProfileSectionCard icon={Stethoscope} title="Doctor Information">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Specialty" icon={Stethoscope}>
          {isEditing ? (
            <Select value={formData.specialty || ""} onValueChange={(value) => updateField("specialty", value)}>
              <SelectTrigger data-testid="select-profile-specialty"><SelectValue placeholder="Select specialty" /></SelectTrigger>
              <SelectContent>{specialties.map((specialty) => <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>)}</SelectContent>
            </Select>
          ) : <p className="mt-1 text-sm" data-testid="text-profile-specialty">{profile?.specialty || "Not set"}</p>}
        </Field>

        <Field label="License Number" icon={Hash}>
          {isEditing ? (
            <Input value={formData.licenseNumber || ""} onChange={(e) => updateField("licenseNumber", e.target.value)} placeholder="Medical license number" data-testid="input-profile-license" />
          ) : <p className="mt-1 text-sm" data-testid="text-profile-license">{profile?.licenseNumber || "Not set"}</p>}
        </Field>

        <Field label="Years of Experience" icon={BriefcaseMedical}>
          {isEditing ? (
            <Input type="number" min="0" value={formData.yearsOfExperience ?? ""} onChange={(e) => updateField("yearsOfExperience", e.target.value)} placeholder="0" data-testid="input-profile-experience" />
          ) : <p className="mt-1 text-sm" data-testid="text-profile-experience">{profile?.yearsOfExperience != null ? `${profile.yearsOfExperience} year(s)` : "Not set"}</p>}
        </Field>

        <Field label="Online Consultation">
          {isEditing ? (
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!formData.onlineConsultation} onChange={(e) => updateField("onlineConsultation", e.target.checked)} />
              Enable online consultation requests
            </label>
          ) : <p className="mt-1 text-sm" data-testid="text-profile-online-consultation">{profile?.onlineConsultation ? "Available" : "Not available"}</p>}
        </Field>

        <div className="sm:col-span-2">
          <Field label="Bio / Description">
            {isEditing ? (
              <Textarea value={formData.bio || ""} onChange={(e) => updateField("bio", e.target.value)} placeholder="Describe your experience and areas of expertise" className="min-h-[110px]" data-testid="input-profile-bio" />
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
