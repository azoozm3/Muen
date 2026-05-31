import {
  Activity,
  Ambulance,
  CalendarCheck,
  Clock3,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Stethoscope,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

export const heroData = {
  badge: "Smart medical support platform",
  title: "Healthcare support, faster and easier for everyone.",
  description:
    "Mu'en connects patients with doctors, nurses, volunteers, emergency support, nearby hospitals, and online consultations through one clean responsive platform.",
  primaryAction: {
    label: "Get Started",
    href: "/signup",
  },
  secondaryAction: {
    label: "See How It Works",
    href: "#how-it-works",
  },
};

export const heroHighlights = [
  {
    icon: ShieldCheck,
    title: "Emergency ready",
    description: "Quick request flow with location and status updates.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: HeartHandshake,
    title: "Human care",
    description: "Doctors, nurses, volunteers, and patients connected clearly.",
    color: "bg-rose-100 text-rose-700",
  },
  {
    icon: Clock3,
    title: "Fast actions",
    description: "Book, request, track, and manage care with fewer steps.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: Activity,
    title: "One dashboard",
    description: "Appointments, records, payments, and requests in one place.",
    color: "bg-emerald-100 text-emerald-700",
  },
];

export const statsData = [
  { value: "24/7", label: "Emergency flow" },
  { value: "6+", label: "Care services" },
  { value: "100%", label: "Responsive UI" },
];

export const aboutData = {
  eyebrow: "About Mu'en",
  title: "A professional digital bridge between patients and healthcare teams.",
  description:
    "Mu'en is designed to simplify healthcare support for patients, doctors, nurses, volunteers, and admins. By connecting everyone through a single platform, Mu'en makes it easier to request help, book appointments, manage care, and stay informed without the usual confusion of multiple apps or phone calls.",
  points: [
    "Emergency-first patient requests",
    "Doctor, nurse, volunteer, and admin workflows",
    "Clean design for phone, tablet, and laptop screens",
  ],
};

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

export const workflowSteps = [
  {
    number: "01",
    title: "Choose a service",
    description:
      "Pick emergency support, appointments, nursing, volunteer help, records, or hospital search.",
  },
  {
    number: "02",
    title: "Add the details",
    description:
      "Share the needed medical information, time, contact details, and location when required.",
  },
  {
    number: "03",
    title: "Get connected",
    description:
      "The correct doctor, nurse, volunteer, or admin workflow receives the request clearly.",
  },
  {
    number: "04",
    title: "Track progress",
    description:
      "Follow statuses, appointments, payments, reports, and care history from the dashboard.",
  },
];

export const ctaData = {
  title: "Start using Mu'en with a cleaner, faster experience.",
  description:
    "Create an account and access a responsive healthcare platform made for daily patient support and provider coordination.",
  primaryAction: {
    label: "Create Account",
    href: "/signup",
  },
  secondaryAction: {
    label: "Sign In",
    href: "/signin",
  },
};

export const footerData = {
  brand: "Mu'en",
  text: "© 2026 Mu'en. All rights reserved.",
  note: "Responsive healthcare platform",
};

export const audienceData = [
  { icon: UsersRound, label: "Patients" },
  { icon: Stethoscope, label: "Doctors" },
  { icon: HeartHandshake, label: "Nurses & Volunteers" },
];
