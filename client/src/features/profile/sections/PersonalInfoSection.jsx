import { Mail, MapPin, Phone, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileSectionCard } from "./ProfileSectionShared";

function EditableField({ id, label, value, onChange, placeholder, testId, icon: Icon }) {
  return (
    <div>
      <Label htmlFor={id} className={Icon ? "flex items-center gap-1" : undefined}>{Icon ? <Icon className="h-3.5 w-3.5" /> : null} {label}</Label>
      <Input id={id} value={value} onChange={onChange} placeholder={placeholder} data-testid={testId} />
    </div>
  );
}

function ReadonlyField({ label, value, testId, icon: Icon, muted = false }) {
  return (
    <div>
      <Label className={Icon ? "flex items-center gap-1" : undefined}>{Icon ? <Icon className="h-3.5 w-3.5" /> : null} {label}</Label>
      <p className={`mt-1 text-sm ${muted ? "text-muted-foreground" : ""}`.trim()} data-testid={testId}>{value}</p>
    </div>
  );
}

export function PersonalInfoSection({ isEditing, profile, formData, setFormData }) {
  return (
    <ProfileSectionCard icon={User} title="Personal Information">
      <div className="grid gap-4 sm:grid-cols-2">
        {isEditing ? (
          <EditableField id="name" label="Full Name" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} testId="input-profile-name" />
        ) : (
          <ReadonlyField label="Full Name" value={profile?.name || "Not set"} testId="text-profile-name" />
        )}

        <ReadonlyField label="Email" value={profile?.email} testId="text-profile-email" icon={Mail} muted />

        {isEditing ? (
          <EditableField id="phone" label="Phone Number" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Enter phone number" testId="input-profile-phone" icon={Phone} />
        ) : (
          <ReadonlyField label="Phone Number" value={profile?.phone || "Not set"} testId="text-profile-phone" icon={Phone} />
        )}

        {isEditing ? (
          <div>
            <Label>Gender</Label>
            <Select value={formData.gender || "not_set"} onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value === "not_set" ? "" : value }))}>
              <SelectTrigger data-testid="select-profile-gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="not_set">Not set</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <ReadonlyField label="Gender" value={profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "Not set"} testId="text-profile-gender" />
        )}

        <div className="sm:col-span-2">
          {isEditing ? (
            <EditableField id="address" label="Address" value={formData.address} onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))} placeholder="Enter address" testId="input-profile-address" icon={MapPin} />
          ) : (
            <ReadonlyField label="Address" value={profile?.address || "Not set"} testId="text-profile-address" icon={MapPin} />
          )}
        </div>
      </div>
    </ProfileSectionCard>
  );
}
