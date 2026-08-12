import { useState } from "react";
import {
  CheckCircle2,
  FileCode2,
  Laptop,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import dashboardImage from "../../assets/home/secure-dashboard.svg";

const features = [
  {
    id: "secure",
    title: "Secure cloud infrastructure",
    description: "Deploy applications on highly scalable and protected cloud environments.",
    icon: ShieldCheck,
  },
  {
    id: "agile",
    title: "Agile development process",
    description: "Track progress with regular sprint updates and adaptable feature planning.",
    icon: CheckCircle2,
  },
  {
    id: "code",
    title: "Clean & modern codebase",
    description: "We use the latest tech stacks to write maintainable and efficient code.",
    icon: FileCode2,
  },
  {
    id: "support",
    title: "Dedicated project support",
    description: "Get direct communication channels with your project manager and development team.",
    icon: MessageSquare,
  },
  {
    id: "cross-platform",
    title: "Cross-platform solutions",
    description: "Build once and deploy across web, iOS, and Android seamlessly.",
    icon: Laptop,
  },
];

const ServiceFeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(features[2]);

  return (
    <section className="bg-slate-50 py-14 sm:py-16 lg:py-20">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600 sm:text-sm">
            Connected development experience
          </p>
          <h2 className="mt-3 max-w-2xl text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            Important tech decisions simplified in one platform
          </h2>
          <div className="mt-7 grid gap-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              const isActive = feature.id === activeFeature.id;
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => setActiveFeature(feature)}
                  className={[
                    "flex w-full items-start gap-3 rounded-xl border px-4 py-4 text-left transition sm:px-5",
                    isActive
                      ? "border-teal-200 bg-white shadow-md shadow-teal-950/5"
                      : "border-transparent bg-transparent hover:border-slate-200 hover:bg-white",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                      isActive ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600",
                    ].join(" ")}
                  >
                    <Icon size={18} />
                  </span>
                  <span>
                    <span
                      className={[
                        "block text-sm font-bold sm:text-base",
                        isActive ? "text-slate-950" : "text-slate-700",
                      ].join(" ")}
                    >
                      {feature.title}
                    </span>
                    {isActive && (
                      <span className="mt-1.5 block text-xs leading-6 text-slate-600 sm:text-sm">
                        {feature.description}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-8 rounded-full bg-teal-100 blur-3xl" />
          <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/5 sm:p-6">
            <img
              src={dashboardImage}
              alt="Secure development dashboard interface"
              className="w-full"
            />
            <div className="mt-4 rounded-xl bg-slate-950 px-4 py-3 text-white">
              <p className="text-xs font-semibold text-teal-300">Selected Feature</p>
              <p className="mt-1 text-sm font-bold sm:text-base">{activeFeature.title}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceFeaturesSection;