const DAY_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function toMinutes(time) {
  if (typeof time !== "string" || !/^\d{2}:\d{2}$/.test(time)) return null;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  return `${h12}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function getValidSlots(doctor) {
  const slots = Array.isArray(doctor?.availableSlots) ? doctor.availableSlots : [];
  return slots.filter((slot) => slot?.day && toMinutes(slot?.startTime) != null && toMinutes(slot?.endTime) != null);
}

export function getScheduleSummary(doctor) {
  const validSlots = getValidSlots(doctor);
  if (!validSlots.length) return { hasSchedule: false, daysText: "No schedule configured", hoursText: "" };

  const uniqueDays = [...new Set(validSlots.map((slot) => slot.day))]
    .filter((day) => DAY_ORDER.includes(day))
    .sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b));

  const start = Math.min(...validSlots.map((slot) => toMinutes(slot.startTime)));
  const end = Math.max(...validSlots.map((slot) => toMinutes(slot.endTime)));
  const startTime = `${String(Math.floor(start / 60)).padStart(2, "0")}:${String(start % 60).padStart(2, "0")}`;
  const endTime = `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`;

  const indices = uniqueDays.map((d) => DAY_ORDER.indexOf(d));
  const consecutive = indices.every((value, i) => i === 0 || value === indices[i - 1] + 1);
  const daysText = consecutive && uniqueDays.length > 1 ? `${uniqueDays[0]} – ${uniqueDays[uniqueDays.length - 1]}` : uniqueDays.join(", ");

  return { hasSchedule: true, daysText, hoursText: `${formatTime(startTime)} – ${formatTime(endTime)}` };
}

export function isDoctorBookable(doctor) {
  const manuallyUnavailable = doctor?.availabilityStatus === "unavailable";
  return !manuallyUnavailable && getValidSlots(doctor).length > 0;
}
