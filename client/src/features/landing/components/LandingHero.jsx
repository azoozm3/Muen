import { useLocation } from "wouter";
import { ArrowRight, CheckCircle2, HeartPulse, Laptop, MapPin, Smartphone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroData, heroHighlights, statsData } from "@/features/landing/landing.data";
import logo from "@/assets/logo.png";

const statCardStyle =
  "rounded-2xl border border-sky-100 bg-sky-50/80 p-4 shadow-sm shadow-sky-100/70 backdrop-blur";

const highlightCardStyles = [
  "border-emerald-100 bg-emerald-50/80 shadow-emerald-100/70",
  "border-yellow-100 bg-yellow-50/80 shadow-yellow-100/70",
  "border-rose-100 bg-rose-50/80 shadow-rose-100/70",
  "border-blue-100 bg-blue-50/80 shadow-blue-100/70",
];

function LaptopPreview() {
  return (
    <div className="relative z-10 ml-auto w-full rounded-[1.7rem] border border-slate-200 bg-slate-950 p-2.5 shadow-2xl sm:p-3">
      <div className="overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 p-4 sm:p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <img src={logo} alt="Mu'en logo" className="h-10 w-10 rounded-xl bg-white object-contain p-1 shadow-sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-slate-950">Mu'en Dashboard</p>
              <p className="text-xs font-medium text-slate-500">Live care overview</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700">
            Online
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <HeartPulse className="h-5 w-5" />
            </div>
            <br />
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Emergency</p>

          </div>

          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-4 text-white shadow-lg shadow-blue-500/20">
            <Laptop className="mb-5 h-6 w-6" />
            <p className="text-base font-black">Online consultation</p>

            <div className="mt-5 h-2 rounded-full bg-white/25">
              <div className="h-2 w-2/3 rounded-full bg-white" />
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Nearest provider</p>
              <p className="mt-1 text-sm font-black text-slate-950">Nurse assigned nearby</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              ["Request", true],
              ["Match", true],
              ["Arrive", false],
            ].map(([step, done]) => (
              <div key={step} className="rounded-xl bg-slate-50 p-2 text-center">
                <div className={`mx-auto mb-1 h-2 w-2 rounded-full ${done ? "bg-emerald-500" : "bg-slate-300"}`} />
                <p className="text-[10px] font-bold text-slate-500">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-3 h-1.5 w-24 rounded-full bg-slate-700" />
    </div>
  );
}

function PhonePreview() {
  return (
    <div className="absolute bottom-4 left-2 z-20 w-[45%] max-w-[210px] rounded-[2rem] border-[9px] border-slate-950 bg-slate-950 shadow-[0_24px_70px_rgba(15,23,42,0.3)] sm:bottom-8 sm:left-6">
      <div className="rounded-[1.35rem] bg-white p-3">
        <div className="mx-auto mb-3 h-1.5 w-14 rounded-full bg-slate-200" />
        <div className="rounded-2xl bg-gradient-to-br from-red-500 to-red-400 p-3 text-white">
          <Smartphone className="mb-6 h-5 w-5" />
          <p className="text-xs text-[20px] font-black">Help</p>
          <p className="mt-1 text-[10px] font-medium text-white/85">Share location in one tap</p>
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-2 rounded-full bg-slate-100" />
          <div className="h-2 w-2/3 rounded-full bg-slate-100" />
          <div className="rounded-xl bg-emerald-50 p-2 text-[10px] font-black text-emerald-700">
            Provider on the way
          </div>
        </div>
      </div>
    </div>
  );
}

function DevicePreview() {
  return (
    <div className="relative mx-auto min-h-[470px] w-full max-w-[560px] rounded-[2.25rem] border border-white/70 bg-white/75 p-4 shadow-[0_30px_90px_rgba(15,23,42,0.18)] backdrop-blur sm:min-h-[560px] sm:p-6">
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-300/50 blur-3xl" />
      <div className="absolute -bottom-20 -left-16 h-60 w-60 rounded-full bg-emerald-300/40 blur-3xl" />
      <div className="absolute left-12 top-20 h-32 w-32 rounded-full bg-blue-400/20 blur-2xl" />
      <div className="relative ml-auto w-[88%] sm:w-[92%]">
        <LaptopPreview />
      </div>
      <PhonePreview />
    </div>
  );
}

export default function LandingHero() {
  const [, navigate] = useLocation();

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 p-5 shadow-[0_24px_90px_rgba(37,99,235,0.13)] backdrop-blur sm:rounded-[2.5rem] sm:p-8 lg:p-12">
      <div className="absolute left-0 top-0 h-44 w-44 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-emerald-300/30 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.95fr)] lg:items-center">
        <div className="space-y-7">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm backdrop-blur">
            <HeartPulse className="h-4 w-4 shrink-0" />
            <span className="truncate">{heroData.badge}</span>
          </div>

          <div className="space-y-5">
            <h1 className="max-w-4xl text-4xl font-black leading-[1.04] tracking-tight text-slate-950 sm:text-5xl xl:text-6xl">
              {heroData.title}
            </h1>

            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              {heroData.description}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              size="lg"
              className="h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 px-7 text-base font-black text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-cyan-600"
              onClick={() => navigate(heroData.primaryAction.href)}
            >
              {heroData.primaryAction.label}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="ghost"
              className="h-12 rounded-2xl border border-slate-200 bg-white/85 px-7 text-base font-black text-slate-800 shadow-sm backdrop-blur hover:bg-white"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
            >
              {heroData.secondaryAction.label}
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {statsData.map((item) => (
              <div key={item.label} className={statCardStyle}>
                <p className="text-2xl font-black text-slate-950">
                  {item.value}
                </p>

                <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {heroHighlights.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`rounded-[1.35rem] border p-4 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl ${highlightCardStyles[index % highlightCardStyles.length]
                    }`}
                >
                  <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-2xl ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="text-base font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-3 top-8 z-30 hidden rounded-2xl border border-white/70 bg-white/85 p-3 shadow-xl backdrop-blur sm:flex sm:items-center sm:gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Video className="h-5 w-5" />
            </div>

            <div>
              <p className="text-xs font-black text-slate-950">Online care</p>
              <p className="text-xs font-medium text-slate-500">
                Consult with providers remotely
              </p>
            </div>
          </div>

          <DevicePreview />
        </div>
      </div>
    </section>
  );
}