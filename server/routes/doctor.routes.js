import { insertReviewSchema } from "../../shared/schema.js";
import Appointment from "../models/Appointment.js";
import { requireAuth, sanitizeUser, sendZodError } from "./helpers.js";

export function registerDoctorRoutes(app, { storage }) {
  app.get("/api/doctors", async (req, res) => {
    const specialty = typeof req.query.specialty === "string" ? req.query.specialty : undefined;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const minRating = req.query.minRating ? Number(req.query.minRating) : undefined;
    const onlineConsultation = req.query.onlineConsultation === "true";

    const doctors = await storage.getDoctors({ specialty, minRating, search, onlineConsultation });
    res.json(doctors.map(sanitizeUser));
  });

  app.get("/api/doctors/:id/reviews", async (req, res) => {
    const doctor = await storage.getUserById(req.params.id);
    if (!doctor || doctor.role !== "doctor") {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const reviews = await storage.getReviews(req.params.id);
    res.json(reviews);
  });

  app.get("/api/doctors/:id/available-slots", async (req, res) => {
    try {
      const { date } = req.query;
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(String(date))) {
        return res.status(400).json({ message: "date query param required" });
      }
      const doctor = await storage.getUserById(req.params.id);
      if (!doctor || doctor.role !== "doctor") return res.status(404).json({ message: "Doctor not found" });
      if (doctor.availabilityStatus === "unavailable") {
        return res.json({ slots: [], clinicAddress: doctor.clinicAddress || null, hasConfiguredAvailability: true, isDoctorUnavailable: true });
      }
      const [year, month, day] = String(date).split("-").map(Number);
      const dayOfWeek = new Date(year, month - 1, day, 12).toLocaleDateString("en-US", { weekday: "long" });
      const slotDef = (doctor.availableSlots || []).find((slot) => slot.day === dayOfWeek);
      const hasConfiguredAvailability = Boolean(slotDef);
      if (!slotDef) {
        return res.json({ slots: [], clinicAddress: doctor.clinicAddress || null, hasConfiguredAvailability });
      }
      const toMinutes = (time) => {
        const [hours = 0, minutes = 0] = String(time || "").split(":").map(Number);
        return hours * 60 + minutes;
      };
      const toTime = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
      const startMinutes = toMinutes(slotDef.startTime);
      const endMinutes = toMinutes(slotDef.endTime);
      const generated = [];
      if (endMinutes > startMinutes) {
        for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) generated.push(toTime(minutes));
      }
      const booked = await Appointment.find({ doctorId: String(doctor._id), date, status: { $in: ["pending", "confirmed"] } }).select("time").lean();
      const bookedSet = new Set(booked.map((appointment) => String(appointment.time || "").slice(0, 5)));
      const slots = generated.filter((slot) => !bookedSet.has(slot));
      return res.json({ slots, clinicAddress: doctor.clinicAddress || null, hasConfiguredAvailability, isDoctorUnavailable: false });
    } catch (error) {
      console.error("GET /api/doctors/:id/available-slots error:", error);
      return res.status(500).json({ message: "Failed to fetch available slots" });
    }
  });

  app.post("/api/doctors/:id/reviews", requireAuth, async (req, res) => {
    try {
      const doctorId = req.params.id;
      const doctor = await storage.getUserById(doctorId);
      if (!doctor || doctor.role !== "doctor") {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const user = await storage.getUserById(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const review = await storage.createReview(
        insertReviewSchema.parse({
          ...req.body,
          doctorId,
          patientId: user.id,
          patientName: user.name,
        }),
      );

      await storage.updateDoctorRating(doctorId);
      res.status(201).json(review);
    } catch (err) {
      return sendZodError(res, err);
    }
  });
}
