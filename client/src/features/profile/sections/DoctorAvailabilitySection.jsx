import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DoctorAvailabilitySection({ formData, setFormData, isEditing }) {
  if (!isEditing) {
    return (
      <Card>
        <CardHeader><CardTitle>Clinic & Availability</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm"><span className="font-medium">Availability Status:</span> {formData.availabilityStatus === "unavailable" ? "Unavailable" : "Available"}</p>
          <p className="text-sm"><span className="font-medium">Clinic Address:</span> {formData.clinicAddress || "Not added"}</p>
          <div className="space-y-2">
            {(formData.availableSlots || []).length === 0 ? <p className="text-sm text-muted-foreground">No weekly availability added.</p> : formData.availableSlots.map((slot) => <p key={slot.day} className="text-sm"><span className="font-medium">{slot.day}:</span> {slot.startTime} - {slot.endTime}</p>)}
          </div>
        </CardContent>
      </Card>
    );
  }

  const availableSlots = Array.isArray(formData.availableSlots) ? formData.availableSlots : [];
  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));
  const isDayEnabled = (day) => availableSlots.some((s) => s.day === day);
  const updateSlots = (slots) => updateField("availableSlots", slots);
  const toggleDay = (day, checked) => checked ? updateSlots([...availableSlots, { day, startTime: "08:00", endTime: "17:00" }]) : updateSlots(availableSlots.filter((s) => s.day !== day));
  const updateSlotTime = (day, field, value) => updateSlots(availableSlots.map((s) => (s.day === day ? { ...s, [field]: value } : s)));
  const getSlot = (day) => availableSlots.find((s) => s.day === day) || { day, startTime: "08:00", endTime: "17:00" };

  return (
    <Card>
      <CardHeader><CardTitle>Clinic & Weekly Availability</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Availability Status</Label>
          <RadioGroup value={formData.availabilityStatus || "available"} onValueChange={(value) => updateField("availabilityStatus", value)} className="flex gap-4">
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="available" />Available</label>
            <label className="flex items-center gap-2 text-sm"><RadioGroupItem value="unavailable" />Unavailable</label>
          </RadioGroup>
        </div>
        <div className="space-y-2"><Label>Clinic Address</Label><Input value={formData.clinicAddress || ""} onChange={(e) => updateField("clinicAddress", e.target.value)} placeholder="Enter your clinic address" /></div>
        <div className="space-y-3">
          <Label>Available Days</Label>
          {DAYS.map((day) => {
            const enabled = isDayEnabled(day);
            const slot = getSlot(day);
            return (
              <div key={day} className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={enabled} onChange={(e) => toggleDay(day, e.target.checked)} />{day}</label>
                {enabled ? <div className="flex items-center gap-2"><Input type="time" value={slot.startTime} onChange={(e) => updateSlotTime(day, "startTime", e.target.value)} /><span className="text-sm text-muted-foreground">to</span><Input type="time" value={slot.endTime} onChange={(e) => updateSlotTime(day, "endTime", e.target.value)} /></div> : null}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
