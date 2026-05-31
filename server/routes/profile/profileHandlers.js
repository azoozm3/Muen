import { updateProfileSchema } from "../../../shared/schema.js";
import { sanitizeUser, sendZodError } from "../helpers.js";
import { buildPublicProviderSummary, getProfileRatings, getPublicPatientRatings } from "./profileHelpers.js";

export function createProfileHandlers(storage) {
  return {
    readMe: async (req, res) => {
      const user = await storage.getUserById(req.session.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      const ratings = await getProfileRatings(user);
      res.json({ ...sanitizeUser(user), ...ratings });
    },

    readPublic: async (req, res) => {
      const user = await storage.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.role === "patient") {
        const patientRatings = await getPublicPatientRatings(req.params.id);
        return res.json({ ...sanitizeUser(user), patientRatings });
      }

      const { providerRatings } = await getProfileRatings(user);
      const ratingSummary = buildPublicProviderSummary(user, providerRatings);
      return res.json({ ...sanitizeUser(user), ...ratingSummary, providerRatings });
    },

    createPatientRating: async (req, res) => {
      try {
        const { patientId, interactionType, interactionId, rating, feedback = "" } = req.body || {};
        if (!patientId || !interactionType || !interactionId || !rating) {
          return res.status(400).json({ message: "Missing required fields" });
        }

        if (!["doctor", "nurse", "volunteer"].includes(req.session.userRole)) {
          return res.status(403).json({ message: "Only providers can rate patients" });
        }

        const saved = await storage.createPatientInteractionRating({
          patientId,
          providerId: req.session.userId,
          providerRole: req.session.userRole,
          interactionType,
          interactionId,
          rating: Number(rating),
          feedback,
        });

        res.status(201).json(saved);
      } catch (error) {
        if (error?.code === 11000) {
          return res.status(400).json({ message: "Patient rating already saved for this interaction" });
        }
        throw error;
      }
    },

    updateMe: async (req, res) => {
      try {
        const data = updateProfileSchema.parse(req.body);
        const updated = await storage.updateProfile(req.session.userId, data);
        if (!updated) return res.status(404).json({ message: "User not found" });

        await storage.createActivityLog(req.session.userId, updated.name, "profile_updated", `${updated.role} profile updated`);
        res.json(sanitizeUser(updated));
      } catch (error) {
        return sendZodError(res, error);
      }
    },

    acknowledgeMedicalRecord: async (req, res) => {
      try {
        if (req.session.userRole !== "patient") return res.status(403).json({ message: "Patients only" });
        await storage.updateProfile(req.session.userId, { medicalRecordAcknowledged: true });
        return res.json({ medicalRecordAcknowledged: true });
      } catch (error) {
        console.error("acknowledge medical record error:", error);
        return res.status(500).json({ message: "Failed to acknowledge medical record" });
      }
    },

    uploadMedicalPdf: async (req, res) => {
      try {
        if (req.session.userRole !== "patient") return res.status(403).json({ message: "Patients only" });
        const fileDataUri = req.body?.fileDataUri;
        if (!fileDataUri || typeof fileDataUri !== "string") return res.status(400).json({ message: "No file uploaded" });
        if (!fileDataUri.startsWith("data:application/pdf;base64,")) return res.status(400).json({ message: "Only PDF files are allowed" });
        const base64Payload = fileDataUri.slice("data:application/pdf;base64,".length);
        const sizeBytes = Math.floor((base64Payload.length * 3) / 4);
        if (sizeBytes > 5 * 1024 * 1024) return res.status(400).json({ message: "PDF must be 5MB or smaller" });
        const updated = await storage.updateProfile(req.session.userId, { medicalPdfUrl: fileDataUri });
        return res.json({ success: true, medicalPdfUrl: updated?.medicalPdfUrl ? "uploaded" : null });
      } catch (error) {
        console.error("upload medical pdf error:", error);
        return res.status(500).json({ message: "Failed to upload medical PDF" });
      }
    },

    deleteMedicalPdf: async (req, res) => {
      if (req.session.userRole !== "patient") return res.status(403).json({ message: "Patients only" });
      await storage.updateProfile(req.session.userId, { medicalPdfUrl: null });
      return res.json({ success: true });
    },
  };
}
