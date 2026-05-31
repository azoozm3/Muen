import { ActivityLog, User } from "./models.js";
import { buildActivityPayload, buildAdminUserUpdateData, buildDoctorsQuery, buildProfileUpdateData, refreshPatientRating } from "./helpers/userStorageHelpers.js";

export const userStorageMethods = {
  async createUser(name, email, passwordHash, role, phone = null) {
    const userNumber = await this.getNextUserNumber();
    const isAdmin = role === "admin";
    return User.create({
      userNumber,
      publicUserId: `USR-${userNumber}`,
      name,
      email,
      passwordHash,
      role,
      phone,
      active: isAdmin || role === "patient",
      approvalStatus: isAdmin || role === "patient" ? "approved" : "pending",
    });
  },

  async getUserByEmail(email) {
    return User.findOne({ email });
  },

  async getUserById(id) {
    return User.findById(id);
  },

  async getAllUsers() {
    return User.find().sort({ createdAt: -1 });
  },

  async updateUserActive(id, active) {
    return User.findByIdAndUpdate(id, { active }, { returnDocument: "after" });
  },

  async updateUserByAdmin(id, data) {
    return User.findByIdAndUpdate(id, buildAdminUserUpdateData(data), { returnDocument: "after", runValidators: true });
  },

  async deleteUser(id) {
    return !!(await User.findByIdAndDelete(id));
  },

  async updateProfile(id, data) {
    const updateData = buildProfileUpdateData(data);
    if (Object.keys(updateData).length === 0) return this.getUserById(id);
    return User.findByIdAndUpdate(id, updateData, { returnDocument: "after" });
  },

  async getDoctors(filters) {
    return User.find(buildDoctorsQuery(filters))
      .select("-passwordHash -medicalHistory -medicalPdfUrl")
      .sort({ rating: -1, createdAt: -1 })
      .lean();
  },

  async createActivityLog(userIdOrPayload, userName, action, details) {
    const payload = buildActivityPayload(userIdOrPayload, userName, action, details);
    return ActivityLog.create({ userId: payload.userId || null, userName: payload.userName || null, userRole: payload.userRole || null, action: payload.action || "activity", details: payload.details || null });
  },

  async updatePatientRating(patientId) {
    return refreshPatientRating(patientId);
  }
};
