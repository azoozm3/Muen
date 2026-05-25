import { CheckCircle2 } from "lucide-react";
import { aboutData, audienceData } from "@/features/landing/landing.data";
import logo from "@/assets/logo.png";

const audienceCardStyles = [
  "bg-blue-100 text-blue-700 shadow-blue-100",
  "bg-emerald-100 text-emerald-700 shadow-emerald-100",
  "bg-violet-100 text-violet-700 shadow-violet-100",
];

const pointCardStyles = [
  "bg-blue-50 text-blue-800 border-blue-100",
  "bg-emerald-50 text-emerald-800 border-emerald-100",
  "bg-orange-50 text-orange-800 border-orange-100",
];



export default function LandingAbout() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:rounded-[2.25rem] sm:p-8 lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="relative min-h-[320px] overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-100 via-cyan-50 to-emerald-100 p-6 text-slate-900 shadow-xl shadow-blue-100">
          <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full bg-blue-200/40 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-emerald-200/50 blur-2xl" />
          <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/30 blur-3xl" />

          <div className="relative flex h-full min-h-[270px] flex-col justify-between gap-8">
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white shadow-md">
                <img
                  src={logo}
                  alt="Mu'en logo"
                  className="h-12 w-12 object-contain"
                />
              </div>

              <span className="rounded-full bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-blue-700 shadow-sm backdrop-blur">
                Care network
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="max-w-sm text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
                One platform. Many ways to help.
              </h3>

              <p className="max-w-md text-sm leading-7 text-slate-600">
                Built to keep patient requests, providers, and support teams
                organized without confusing steps.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {audienceData.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.label}
                    className={`rounded-2xl p-3 text-center shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-lg ${audienceCardStyles[index % audienceCardStyles.length]
                      }`}
                  >
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-white/70">
                      <Icon className="h-5 w-5" />
                    </div>

                    <p className="text-xs font-black">{item.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-500">
            {aboutData.eyebrow}
          </p>

          <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            {aboutData.title}
          </h2>

          <p className="text-base leading-8 text-slate-600 sm:text-lg">
            {aboutData.description}
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {aboutData.points.map((point, index) => (
              <div
                key={point}
                className={`rounded-2xl border p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md ${pointCardStyles[index % pointCardStyles.length]
                  }`}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/80">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <p className="text-sm font-bold leading-6">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}