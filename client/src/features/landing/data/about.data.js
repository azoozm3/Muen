import { HeartHandshake, Stethoscope, UsersRound } from "lucide-react";

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

export const audienceData = [
  { icon: UsersRound, label: "Patients" },
  { icon: Stethoscope, label: "Doctors" },
  { icon: HeartHandshake, label: "Nurses & Volunteers" },
];
