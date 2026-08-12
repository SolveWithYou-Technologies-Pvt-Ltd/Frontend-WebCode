import { Check, Settings2, ServerCog, Wrench } from "lucide-react";
import maintenanceImage from "../../assets/home/system-maintenance.svg";

const supportPoints = [
  {
    title: "Server & Cloud Management",
    description: "We handle database optimizations, scaling configurations, and regular server health checks.",
    icon: ServerCog,
  },
  {
    title: "Performance Monitoring",
    description: "Track application speed, error rates, and user analytics to ensure smooth operations.",
    icon: Settings2,
  },
  {
    title: "Regular Updates & Fixes",
    description: "Keep your software secure with regular dependency updates and immediate bug resolutions.",
    icon: Wrench,
  },
];

const PostLaunchSupportSection = () => {
  return (
    <section className="bg-slate-50/60 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600 sm:text-sm">
            Post-launch support
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            Keep your applications running smoothly without downtime
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Our platform goes beyond just building your product. We ensure long-term stability with dedicated maintenance and support packages.
          </p>
          <div className="mt-7 grid gap-4">
            {supportPoints.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-teal-600 shadow-sm">
                    <Icon size={19} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 sm:text-base">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-6 text-slate-600 sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 sm:text-sm">
            <Check size={16} />
            Everything connected to a central support dashboard
          </div>
        </div>
        <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-950/5 sm:p-8">
          <img
            src={maintenanceImage}
            alt="System maintenance and support"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default PostLaunchSupportSection;