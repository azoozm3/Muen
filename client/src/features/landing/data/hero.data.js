import { Activity, Clock3, HeartHandshake, ShieldCheck } from "lucide-react";

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
