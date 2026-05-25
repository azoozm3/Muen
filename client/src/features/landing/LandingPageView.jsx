import LandingHero from "@/features/landing/components/LandingHero";
import LandingAbout from "@/features/landing/components/LandingAbout";
import LandingServices from "@/features/landing/components/LandingServices";
import LandingWorkflow from "@/features/landing/components/LandingWorkflow";
import LandingCTA from "@/features/landing/components/LandingCTA";
import LandingFooter from "@/features/landing/components/LandingFooter";

export default function LandingPageView() {
  return (
    <div className="min-h-screen overflow-hidden bg-slate-50 text-slate-950">
      <main className="relative">
        <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_34%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#ffffff_70%,#f8fafc_100%)]" />
        <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 sm:py-8 lg:gap-12 lg:px-8 lg:py-10">
          <LandingHero />
          <LandingAbout />
          <LandingServices />
          <LandingWorkflow />
          <LandingCTA />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
