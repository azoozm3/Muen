import { Ambulance, CalendarCheck, HeartHandshake, MapPin, Stethoscope, UserRoundPlus } from "lucide-react";

export const servicesData = [
  {
    icon: Ambulance,
    title: "Emergency Support",
    description:
      "Send urgent medical requests with patient and location details.",
    color: "from-rose-500 to-orange-400",
    bg: "bg-rose-50",
    text: "text-rose-600",
  },
  {
    icon: CalendarCheck,
    title: "Doctor Appointments",
    description:
      "Book in-person or online consultations with available doctors.",
    color: "from-blue-600 to-cyan-500",
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  {
    icon: Stethoscope,
    title: "Home Nursing",
    description:
      "Request nursing care at home for follow-up and daily support.",
    color: "from-emerald-500 to-teal-400",
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    icon: HeartHandshake,
    title: "Volunteer Help",
    description:
      "Ask volunteers for practical support such as transport or pickup.",
    color: "from-violet-500 to-fuchsia-500",
    bg: "bg-violet-50",
    text: "text-violet-600",
  },
  {
    icon: MapPin,
    title: "Nearby Hospitals",
    description: "Find hospitals and clinics around the patient quickly.",
    color: "from-amber-500 to-yellow-400",
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  {
    icon: UserRoundPlus,
    title: "Health Records",
    description:
      "Keep important patient information easier to review and manage.",
    color: "from-sky-500 to-indigo-500",
    bg: "bg-sky-50",
    text: "text-sky-600",
  },
];
