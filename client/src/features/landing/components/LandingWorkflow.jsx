import { workflowSteps } from "@/features/landing/landing.data";

export default function LandingWorkflow() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 rounded-[2rem] bg-gradient-to-br from-sky-100 via-blue-200 to-blue-700 p-5 text-slate-900 shadow-xl shadow-blue-200/50 sm:rounded-[2.25rem] sm:p-8 lg:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="space-y-3">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-700">
            How it works
          </p>

          <h2 className="max-w-xl text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            A simple path from request to support.
          </h2>

          <p className="text-base leading-7 text-slate-700 sm:text-lg">
            Mu'en guides users through clear steps so the platform feels simple
            on phones and professional on laptops.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {workflowSteps.map((step, index) => (
            <div
              key={step.number}
              className="rounded-[1.5rem] border border-white/60 bg-white/85 p-6 shadow-md backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-black text-white shadow-md">
                  {step.number}
                </span>

                <div className="h-px flex-1 bg-slate-200" />

                <span className="text-xs font-black text-slate-500">
                  Step {index + 1}
                </span>
              </div>

              <h3 className="text-xl font-black text-slate-900">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}