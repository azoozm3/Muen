export const DEFAULT_FORM = {
  serviceType: "General Care",
  requestedDate: "",
  requestedTime: "",
  address: "",
  location: "",
  note: "",
  locationLat: "",
  locationLng: "",
};

export { getTodayLocal as getToday } from "@/lib/timeUtils";
