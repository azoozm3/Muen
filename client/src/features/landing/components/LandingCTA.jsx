import { useLocation } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ctaData } from "@/features/landing/landing.data";

export default function LandingCTA() {
  const [, navigate] = useLocation();

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 p-6 text-white shadow-2xl shadow-blue-500/20 sm:rounded-[2.25rem] sm:p-8 lg:p-10">
      <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-24 right-0 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {ctaData.title}
          </h2>
          <p className="text-base leading-8 text-blue-50 sm:text-lg">
            {ctaData.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
          <Button
            size="lg"
            className="h-12 rounded-2xl bg-white px-7 text-base font-black text-blue-700 shadow-xl shadow-slate-900/10 hover:bg-blue-50"
            onClick={() => navigate(ctaData.primaryAction.href)}
          >
            {ctaData.primaryAction.label}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="h-12 rounded-2xl border border-white/40 bg-white/10 px-7 text-base font-black text-white backdrop-blur hover:bg-white/20 hover:text-white"
            onClick={() => navigate(ctaData.secondaryAction.href)}
          >
            {ctaData.secondaryAction.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
