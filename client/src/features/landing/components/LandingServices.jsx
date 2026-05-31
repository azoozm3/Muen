import { servicesData } from "@/features/landing/landing.data";

export default function LandingServices() {
  return (
    <section className="space-y-7">
      <div className="mx-auto max-w-3xl space-y-3 text-center">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-blue-600">Services</p>
        <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
          Everything important is grouped into one journey.
        </h2>
        <p className="text-base leading-8 text-slate-600">
          From scheduling rides to coordinating care, Mu'en keeps everything organized in one place for patients, providers, and support teams.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {servicesData.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/70"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg} ${item.text}`}>
                  <Icon className="h-7 w-7" />
                </div>
                <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${item.color} opacity-20 blur-xl transition group-hover:opacity-40`} />
              </div>

              <h3 className="text-xl font-black text-slate-950">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
              <div className={`mt-6 h-1.5 w-20 rounded-full bg-gradient-to-r ${item.color}`} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
