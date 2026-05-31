import { requireAuth, sendZodError } from "../../../routes/helpers.js";
import { createNurseRequestSchema, createRequestFromBody, serializeNurseRequest } from "./nurseRouteUtils.js";

export function registerNurseCreateRoutes(app) {
  app.post("/api/nurse-requests", requireAuth, async (req, res) => {
    if (req.currentUser.role !== "patient") return res.status(403).json({ message: "Only patients can create nurse requests" });
    const parsed = createNurseRequestSchema.safeParse(req.body || {});
    if (!parsed.success) return sendZodError(res, parsed.error);
    const requestDateTime = new Date(`${parsed.data.requestedDate}T${parsed.data.requestedTime}:00`);
    if (Number.isNaN(requestDateTime.getTime()) || requestDateTime < new Date()) {
      return res.status(400).json({ message: "Cannot request nursing service in the past" });
    }

    try {
      const request = await createRequestFromBody(req, parsed.data);
      res.status(201).json(serializeNurseRequest(request));
    } catch (error) {
      res.status(500).json({ message: error?.message || "Failed to create nurse request" });
    }
  });
}
