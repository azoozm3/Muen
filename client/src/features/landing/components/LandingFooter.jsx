import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Twitter,
} from "lucide-react";
import { footerData } from "@/features/landing/landing.data";
const logo = "/favicon.png";

const socialLinks = [
  {
    label: "Twitter",
    icon: Twitter,
    href: "#",
    className: "bg-sky-50 text-sky-600 hover:bg-sky-100",
  },
  {
    label: "Instagram",
    icon: Instagram,
    href: "#",
    className: "bg-rose-50 text-rose-600 hover:bg-rose-100",
  },
  {
    label: "Facebook",
    icon: Facebook,
    href: "#",
    className: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
];

const contactItems = [
  {
    icon: Mail,
    label: "support@muen.com",
    href: "mailto:support@muen.com",
  },
  {
    icon: MapPin,
    label: "Jordan",
    href: "#",
  },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-blue-100 bg-gradient-to-br from-white via-blue-50 to-emerald-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_1fr_1fr] lg:items-start">
        <div className="space-y-5 text-center sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <img
              src={logo}
              alt="Mu'en logo"
              className="h-16 w-16 rounded-3xl bg-white object-contain p-2 shadow-md ring-1 ring-blue-100"
            />

            <div>
              <p className="text-2xl font-black text-slate-950">
                {footerData.brand}
              </p>

              <p className="mt-1 max-w-md text-sm leading-6 text-slate-600">
                {footerData.text}
              </p>
            </div>
          </div>

          <p className="max-w-lg text-sm leading-7 text-slate-500">
            Mu'en connects users with emergency support, online consultation,
            nearby care providers, and organized health services in one modern
            responsive platform.
          </p>
        </div>

        <div className="space-y-4 text-center sm:text-left">
          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
            Contact us
          </h3>

          <div className="space-y-3">
            {contactItems.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="mx-auto flex w-fit items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 text-sm font-bold text-slate-700 shadow-sm ring-1 ring-blue-100 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md sm:mx-0"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-4 w-4" />
                  </span>

                  {item.label}
                </a>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 text-center sm:text-left">
          <h3 className="text-sm font-black uppercase tracking-[0.25em] text-blue-600">
            Follow us
          </h3>

          <div className="flex justify-center gap-3 sm:justify-start">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ring-1 ring-white transition hover:-translate-y-1 hover:shadow-md ${item.className}`}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>

          <p className="rounded-2xl bg-white/80 p-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 shadow-sm ring-1 ring-blue-100">
            {footerData.note}
          </p>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-blue-100 pt-5 text-center text-xs font-semibold text-slate-500">
        © {new Date().getFullYear()} {footerData.brand}. All rights reserved.
      </div>
    </footer>
  );
}