import { CalendarDays, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function AppointmentDetailsCard({
  doctor,
  form,
  minDate,
  updateField,
  onCancel,
  slotsLoading,
  availableSlots,
  availableDays,
  clinicAddress,
  hasConfiguredAvailability,
  isOnlineConsultation,
  isDoctorUnavailable,
}) {
  const showSlotPicker = hasConfiguredAvailability || Boolean(availableDays?.size);

  function getDayName(dateString) {
    if (!dateString) return "";
    const [y, m, d] = dateString.split("-").map(Number);
    return new Date(y, m - 1, d, 12).toLocaleDateString("en-US", { weekday: "long" });
  }

  const selectedDayName = getDayName(form.date);
  const selectedDateNotInSchedule = Boolean(form.date && availableDays?.size && !availableDays.has(selectedDayName));
  const availableDaysText = availableDays?.size ? [...availableDays].join(", ") : "";

  return (
    <Card className="rounded-2xl p-4">
      <div className="mb-4 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">Appointment details</h3>
          <p className="text-sm text-muted-foreground">Choose date and time, then pay once to send the request.</p>
        </div>
      </div>

      {isDoctorUnavailable ? <p className="mb-3 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">This doctor is currently unavailable for booking.</p> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input disabled={isDoctorUnavailable}
            type="date"
            min={minDate}
            value={form.date}
            onChange={(e) => updateField("date", e.target.value)}
          />
          {availableDaysText ? <p className="text-xs text-muted-foreground">Available days: {availableDaysText}</p> : null}
        </div>
        <div className="space-y-2">
          <Label>Time</Label>
          {showSlotPicker ? (
            slotsLoading ? (
              <p className="text-sm text-muted-foreground">Loading available times...</p>
            ) : availableSlots.length === 0 ? (
              <p className="text-sm text-destructive">
                {selectedDateNotInSchedule ? `Doctor is not available on ${selectedDayName}.` : form.date ? "No available time slots for this date." : "Select a date first."}
              </p>
            ) : (
              <select
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
                disabled={isDoctorUnavailable}
                className="h-10 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a time</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            )
          ) : (
            <Input disabled={isDoctorUnavailable} type="time" value={form.time} onChange={(e) => updateField("time", e.target.value)} />
          )}
          {clinicAddress && !isOnlineConsultation ? (
            <p className="mt-2 text-sm text-muted-foreground">
              📍 Clinic: <span className="font-medium">{clinicAddress}</span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label>Reason</Label>
        <Textarea rows={4} value={form.reason} onChange={(e) => updateField("reason", e.target.value)} placeholder="Write a short reason for the visit" />
      </div>

      <div className="mt-4 space-y-2">
        <Label>Consultation type</Label>
        <RadioGroup value={form.appointmentType} onValueChange={(value) => updateField("appointmentType", value)} className="grid gap-2">
          {doctor?.onlineConsultation ? (
            <label className="flex items-center gap-3 rounded-2xl border p-3">
              <RadioGroupItem value="online" />
              <Video className="h-4 w-4 text-primary" />
              <div>
                <div className="font-medium">Online consultation</div>
                <div className="text-sm text-muted-foreground">Video meeting link appears after the doctor confirms.</div>
              </div>
            </label>
          ) : null}
          <label className="flex items-center gap-3 rounded-2xl border p-3">
            <RadioGroupItem value="in_person" />
            <CalendarDays className="h-4 w-4 text-primary" />
            <div>
              <div className="font-medium">In-person visit</div>
              <div className="text-sm text-muted-foreground">Clinic or agreed location.</div>
            </div>
          </label>
        </RadioGroup>
      </div>

      <div className="mt-4 flex justify-end"><Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button></div>
    </Card>
  );
}
