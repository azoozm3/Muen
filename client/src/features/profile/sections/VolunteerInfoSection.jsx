import { Car, Clock, HeartHandshake, MapPin, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { volunteerAvailabilityOptions, volunteerServiceOptions } from "@shared/volunteer";
import { ProfileSectionCard, StarRating } from "./ProfileSectionShared";

function Field({ label, children, icon: Icon }) {
  return (
    <div>
      <Label className={Icon ? "flex items-center gap-1" : undefined}>{Icon ? <Icon className="h-3.5 w-3.5" /> : null} {label}</Label>
      {children}
    </div>
  );
}

export function VolunteerInfoSection({ isEditing, profile, formData, setFormData }) {
  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));
  const supportTypes = Array.isArray(formData.volunteerSupportTypes) ? formData.volunteerSupportTypes : [];
  const toggleSupportType = (option, checked) => {
    updateField(
      "volunteerSupportTypes",
      checked ? [...new Set([...supportTypes, option])] : supportTypes.filter((item) => item !== option),
    );
  };

  return (
    <ProfileSectionCard icon={HeartHandshake} title="Volunteer Information">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Coverage Area" icon={MapPin}>
          {isEditing ? (
            <Input value={formData.volunteerCoverageArea || ""} onChange={(e) => updateField("volunteerCoverageArea", e.target.value)} placeholder="City or area" data-testid="input-profile-volunteer-area" />
          ) : <p className="mt-1 text-sm">{profile?.volunteerCoverageArea || profile?.address || "Not set"}</p>}
        </Field>

        <Field label="Availability" icon={Clock}>
          {isEditing ? (
            <Select value={formData.volunteerAvailability || ""} onValueChange={(value) => updateField("volunteerAvailability", value)}>
              <SelectTrigger data-testid="select-profile-volunteer-availability"><SelectValue placeholder="Select availability" /></SelectTrigger>
              <SelectContent>{volunteerAvailabilityOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}</SelectContent>
            </Select>
          ) : <p className="mt-1 text-sm">{profile?.volunteerAvailability || "Not set"}</p>}
        </Field>

        <div className="sm:col-span-2">
          <Field label="Support Services" icon={HeartHandshake}>
            {isEditing ? (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {volunteerServiceOptions.map((option) => (
                  <label key={option} className="flex items-center gap-2 rounded-xl border p-3 text-sm">
                    <input type="checkbox" checked={supportTypes.includes(option)} onChange={(e) => toggleSupportType(option, e.target.checked)} />
                    {option}
                  </label>
                ))}
              </div>
            ) : <p className="mt-1 text-sm">{Array.isArray(profile?.volunteerSupportTypes) && profile.volunteerSupportTypes.length ? profile.volunteerSupportTypes.join(", ") : "Not set"}</p>}
          </Field>
        </div>

        <Field label="Transportation" icon={Car}>
          {isEditing ? (
            <label className="mt-2 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!formData.volunteerHasTransportation} onChange={(e) => updateField("volunteerHasTransportation", e.target.checked)} />
              I have transportation
            </label>
          ) : <p className="mt-1 text-sm">{profile?.volunteerHasTransportation ? "Available" : "Not set"}</p>}
        </Field>

        <div className="sm:col-span-2">
          <Field label="Bio / Notes">
            {isEditing ? (
              <Textarea value={formData.volunteerNotes || ""} onChange={(e) => updateField("volunteerNotes", e.target.value)} placeholder="Add your skills, languages, emergency support experience, and important notes" className="min-h-[110px]" data-testid="input-profile-volunteer-notes" />
            ) : <p className="mt-1 whitespace-pre-wrap text-sm">{profile?.volunteerNotes || profile?.bio || "Not set"}</p>}
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
