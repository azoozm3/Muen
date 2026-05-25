import { Review } from "../../models/Review.js";
import { EmergencyRequest } from "../../models/EmergencyRequest.js";
import { caseLabel, getCurrentUser, sendZodError } from "../helpers.js";
import { createEmergencyRequestSchema, emergencyReviewSchema, requestLocationSchema, requestStatusSchema, responderLocationSchema } from "./schemas.js";
import { attachEmergencyPatientRatings } from "./reviewHelpers.js";
import { acceptEmergencyCase, canUpdateEmergencyStatus, finalizeEmergencyStatusUpdate } from "./statusHelpers.js";
import { consumeCapturedPayment } from "../payment.routes.js";
import { saveSession } from "../../services/payment-session.service.js";

export function createEmergencyRequestHandlers(storage) {
  return {
    listAll: async (_req, res) => {
      const requests = await storage.getRequests();
      res.json(await attachEmergencyPatientRatings(requests));
    },

    listMine: async (req, res) => {
      const requests = await storage.getRequestsByPatient(req.session.userId);
      const activeRequest = await storage.getLatestActiveRequestByPatient(req.session.userId);
      res.json({ activeRequest, requests, history: requests.filter((item) => ["resolved", "cancelled"].includes(item.status)) });
    },

    create: async (req, res) => {
      try {
        const parsed = createEmergencyRequestSchema.parse(req.body);
        const { paypalOrderId, ...emergencyFields } = parsed;
        if (!paypalOrderId) return res.status(400).json({ message: "PayPal payment is required." });
        const existing = await EmergencyRequest.findOne({ paypalOrderId }).select("_id").lean();
        if (existing) {
          return res.status(409).json({ message: "This PayPal order has already been used." });
        }
        let capturedPayment;
        try {
          capturedPayment = consumeCapturedPayment(req, paypalOrderId, "emergencyRequest");
        } catch (error) {
          console.error("Emergency payment session error:", error);
          return res.status(402).json({ message: error.message || "Payment failed. Please try again." });
        }
        const payment = capturedPayment?.payment || {};
        const pricing = capturedPayment?.pricing || {};
        const request = await storage.createRequest({
          ...emergencyFields,
          paypalOrderId: payment.providerOrderId || paypalOrderId,
          paypalCaptureId: payment.captureId || payment.paymentRef || null,
          paypalStatus: payment.status || "captured",
          paypalAmount: String(payment.grossAmount ?? pricing.grossAmount ?? "1.00"),
          paypalCurrency: payment.currency || pricing.currency || "USD",
          paymentVerified: true,
        }, req.session.userId || null);
        await saveSession(req);
        await storage.createActivityLog(req.session.userId || null, null, "case_created", `Emergency case ${caseLabel(request, request.id)} created: ${request.emergencyType}`);
        res.status(201).json(request);
      } catch (err) {
        return sendZodError(res, err);
      }
    },

    readOne: async (req, res) => {
      const request = await storage.getRequest(req.params.id);
      if (!request) return res.status(404).json({ message: "Request not found" });
      res.json(request);
    },

    updatePatientLocation: async (req, res) => {
      try {
        const data = requestLocationSchema.parse(req.body);
        const request = await storage.getRequest(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });
        const updated = await storage.updateRequestLocation(req.params.id, { location: data.location ?? request.location, latitude: data.latitude, longitude: data.longitude });
        res.json(updated);
      } catch (err) {
        return sendZodError(res, err);
      }
    },

    updateResponderLocation: async (req, res) => {
      try {
        const data = responderLocationSchema.parse(req.body);
        const request = await storage.getRequest(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });
        const user = await getCurrentUser(storage, req);
        const isAssignedResponder = String(request.primaryResponderId || "") === String(req.session.userId || "") || req.session.userRole === "admin";
        if (!user || !isAssignedResponder) return res.status(403).json({ message: "Not allowed to update responder location" });
        const updated = await storage.updateResponderLocation(req.params.id, data);
        res.json(updated);
      } catch (err) {
        return sendZodError(res, err);
      }
    },

    createReview: async (req, res) => {
      try {
        const { rating, comment } = emergencyReviewSchema.parse(req.body);
        const request = await storage.getRequest(req.params.id);
        if (!request) return res.status(404).json({ message: "Request not found" });
        if (String(request.patientId || "") !== String(req.session.userId || "")) return res.status(403).json({ message: "Not allowed" });
        if (request.status !== "resolved") return res.status(400).json({ message: "You can rate only after resolution" });
        if (request.reviewSubmitted) return res.status(400).json({ message: "Review already submitted" });
        if (String(request.primaryResponderRole || "") !== "doctor") return res.status(400).json({ message: "Doctor rating is not available for this case" });

        const patient = await storage.getUserById(req.session.userId);
        if (!patient) return res.status(404).json({ message: "Patient not found" });

        await Review.create({ doctorId: request.primaryResponderId, patientId: req.session.userId, patientName: patient.name || "Patient", rating, comment });
        await storage.updateDoctorRating(request.primaryResponderId);
        const updated = await storage.updateRequest(req.params.id, { reviewSubmitted: true, reviewedAt: new Date() });
        return res.json(updated);
      } catch (err) {
        return sendZodError(res, err);
      }
    },

    updateStatus: async (req, res) => {
      try {
        const { status } = requestStatusSchema.parse(req.body);
        const requestId = req.params.id;
        const currentRequest = await storage.getRequest(requestId);
        if (!currentRequest) return res.status(404).json({ message: "Request not found" });

        const userId = req.session.userId;
        const userRole = req.session.userRole;
        const user = await storage.getUserById(userId);
        if (!user) return res.status(401).json({ message: "User not found" });
        if (userRole === "volunteer") return res.status(403).json({ message: "Volunteers cannot manage medical case statuses" });

        if (status === "accepted" && currentRequest.status === "pending") {
          return acceptEmergencyCase({ storage, requestId, currentRequest, userId, userRole, user, res });
        }

        const permission = canUpdateEmergencyStatus({ currentRequest, userId, userRole, status });
        if (!permission.ok) return res.status(permission.code).json({ message: permission.message });
        return finalizeEmergencyStatusUpdate({ storage, requestId, status, userId, user, currentRequest, res });
      } catch (err) {
        return sendZodError(res, err);
      }
    },
  };
}
