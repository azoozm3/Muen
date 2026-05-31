import storage from "../../../storage/index.js";
import { consumeCapturedPayment } from "../../../routes/payment.routes.js";
import { refundCapturedPayment } from "../../../services/payment-refund.service.js";
import { createZoomMeeting } from "../../../services/zoom/zoom.service.js";
import { buildAppointmentStartTime } from "../appointment.helpers.js";
import { getDoctorOwnedAppointment, getPatientOwnedAppointment } from "./appointmentAccess.js";

export async function createAppointmentForPatient(req, payload) {
  const patient = await storage.getUserById(req.session.userId);
  if (!patient) throw new Error("PATIENT_NOT_FOUND");

  const doctor = await storage.getUserById(payload.doctorId);
  if (!doctor || doctor.role !== "doctor") throw new Error("DOCTOR_NOT_FOUND");
  if (payload.appointmentType === "online" && !doctor.onlineConsultation) throw new Error("ONLINE_NOT_AVAILABLE");
  if (doctor.availabilityStatus === "unavailable") throw new Error("DOCTOR_UNAVAILABLE");

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const normalizeDay = (value) => dayNames.find((day) => day.toLowerCase() === String(value || "").trim().toLowerCase()) || null;
  const toMinutes = (time) => {
    const match = String(time || "").trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;
    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return hours * 60 + minutes;
  };
  const [year, month, day] = String(payload.date).split("-").map(Number);
  const requestedDay = new Date(year, month - 1, day, 12).toLocaleDateString("en-US", { weekday: "long" });
  const requestedTime = String(payload.time || "").slice(0, 5);
  const weeklySlots = (Array.isArray(doctor.availableSlots) ? doctor.availableSlots : [])
    .map((slot) => ({ day: normalizeDay(slot?.day), startTime: String(slot?.startTime || "").slice(0, 5), endTime: String(slot?.endTime || "").slice(0, 5) }))
    .filter((slot) => slot.day && toMinutes(slot.startTime) !== null && toMinutes(slot.endTime) !== null && toMinutes(slot.endTime) > toMinutes(slot.startTime));
  const slotDef = weeklySlots.find((slot) => slot.day === requestedDay);
  if (!slotDef) throw new Error("SLOT_NOT_AVAILABLE");
  const requestedMinutes = toMinutes(requestedTime);
  const startMinutes = toMinutes(slotDef.startTime);
  const endMinutes = toMinutes(slotDef.endTime);
  if (requestedMinutes === null || requestedMinutes < startMinutes || requestedMinutes >= endMinutes || (requestedMinutes - startMinutes) % 30 !== 0) {
    throw new Error("SLOT_NOT_AVAILABLE");
  }
  const existingAppointment = await storage.getAppointmentByDoctorDateTime(String(payload.doctorId), payload.date, requestedTime);
  if (existingAppointment) throw new Error("SLOT_ALREADY_BOOKED");

  const capturedPayment = consumeCapturedPayment(req, payload.paymentOrderId, "appointment");
  const appointment = await storage.createAppointment({
    patientId: String(req.session.userId),
    doctorId: String(payload.doctorId),
    patientName: patient.name,
    patientPhone: patient.phone || "",
    doctorName: doctor.name,
    specialty: doctor.specialty || "",
    date: payload.date,
    time: payload.time,
    reason: payload.reason,
    appointmentType: payload.appointmentType,
    pricingSnapshot: capturedPayment.pricing,
    payment: { ...capturedPayment.payment },
  });

  return { appointment, doctor, patient, capturedPayment };
}

export async function refundAppointmentPayment(appointment, reason) {
  return refundCapturedPayment(appointment, { reason: reason || "Refunded", note: reason || "Appointment refund" });
}

export async function attachZoomMeetingToAppointment(appointment) {
  if (!appointment || appointment.appointmentType !== "online" || appointment.zoomJoinUrl) return appointment;

  const zoomMeeting = await createZoomMeeting({
    topic: `Mu'en Appointment - ${appointment.patientName} with Dr. ${appointment.doctorName}`,
    startTime: buildAppointmentStartTime(appointment.date, appointment.time),
    duration: 30,
  });

  if (zoomMeeting.skipped) return appointment;
  return storage.saveAppointmentZoomMeeting(appointment.id || appointment._id, zoomMeeting);
}

export async function respondToAppointment({ appointmentId, doctorId, action }) {
  const appointment = await getDoctorOwnedAppointment(appointmentId, doctorId);
  if (appointment.status !== "pending") throw new Error("ALREADY_HANDLED");

  let updated = await storage.updateAppointmentStatus(appointmentId, action);
  if (action === "confirmed") updated = await attachZoomMeetingToAppointment(updated);
  if (action === "rejected") await refundAppointmentPayment(updated, "Appointment rejected by doctor");
  return { appointment, updated };
}

export async function cancelAppointmentForPatient({ appointmentId, patientId, reason }) {
  const appointment = await getPatientOwnedAppointment(appointmentId, patientId);
  if (["completed", "cancelled"].includes(appointment.status)) throw new Error("CANNOT_CANCEL");
  const updated = await storage.updateAppointmentStatus(appointmentId, "cancelled");
  await refundAppointmentPayment(updated, reason || "Appointment cancelled by patient");
  return updated;
}

export async function completeAppointmentForDoctor({ appointmentId, doctorId, status }) {
  const appointment = await getDoctorOwnedAppointment(appointmentId, doctorId);
  if (!["confirmed", "completed"].includes(appointment.status)) throw new Error("NOT_CONFIRMABLE");
  return { appointment, updated: appointment.status === "completed" ? appointment : await storage.updateAppointmentStatus(appointmentId, status) };
}

export async function saveAppointmentNotes({ appointmentId, doctorId, consultationSummary, prescription }) {
  const appointment = await getDoctorOwnedAppointment(appointmentId, doctorId);
  const updated = await storage.updateAppointmentNotes(appointmentId, consultationSummary, prescription);
  return { appointment, updated };
}

export async function submitAppointmentReview({ appointmentId, patientId, rating, comment }) {
  const appointment = await getPatientOwnedAppointment(appointmentId, patientId);
  if (appointment.status !== "completed") throw new Error("REVIEW_TOO_EARLY");
  if (appointment.reviewSubmitted) throw new Error("REVIEW_EXISTS");

  const patient = await storage.getUserById(patientId);
  const review = await storage.createReview({ doctorId: appointment.doctorId, patientId: String(patientId), patientName: patient?.name || appointment.patientName, rating, comment });
  await storage.markAppointmentReviewSubmitted(appointmentId);
  await storage.updateDoctorRating(appointment.doctorId);
  return { appointment, patient, review };
}
