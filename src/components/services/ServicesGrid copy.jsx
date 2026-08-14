import { Smartphone, Cloud, Code, Palette, Wrench, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const servicesData = [
  {
    id: "app-development",
    title: "1. App Development & Publishing",
    description: "Mobile solutions designed for maximum performance, seamless publishing, and top-tier discoverability.",
    icon: Smartphone,
    features: [
      "Custom Mobile App Development (Native & Cross-Platform / Flutter / React Native)",
      "App Store & Play Store Publishing (Google Play Console, Apple App Store, Data Safety Forms & Compliance)",
      "App Store Optimization (ASO) for ranking & keyword optimization"
    ],
  },
  {
    id: "saas-software",
    title: "2. Custom Software & SaaS Development",
    description: "Robust business automation and management tools tailored to scale your enterprise operations.",
    icon: Cloud,
    features: [
      "SaaS Solutions (Custom management software, billing systems, CRMs)",
      "Custom Web Applications & tailored client portals",
      "API Integration & Development (Payment gateways, SMS services, third-party tools)"
    ],
  },
  {
    id: "web-development",
    title: "3. Web Design & Development",
    description: "Establish a powerful online presence with high-performing, responsive, and secure websites.",
    icon: Code,
    features: [
      "Corporate & Business Websites for small to large enterprises",
      "E-commerce Development & online store setup",
      "High-Converting Landing Pages for marketing campaigns & lead generation"
    ],
  },
  {
    id: "ui-ux-design",
    title: "4. UI/UX & Graphic Design",
    description: "Attractive interfaces and compelling visual branding that capture user attention instantly.",
    icon: Palette,
    features: [
      "UI/UX Design (User-friendly interfaces via Figma / Adobe XD)",
      "Branding & Visuals (Logos, social media graphics, promotional materials)"
    ],
  },
  {
    id: "maintenance-support",
    title: "5. Maintenance & Technical Support",
    description: "Reliable recurring services to keep your software secure, updated, and locally visible.",
    icon: Wrench,
    features: [
      "Monthly Maintenance Packages (Server hosting, backups, security updates)",
      "Bug Fixing & Updates (Error resolution and new feature additions)",
      "Business Profile & Local Setup (Google Business Profile setup and optimization)"
    ],
  },
];

const ServicesGrid = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Our Core Services
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            End-to-end digital solutions engineered to scale your business and accelerate growth.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {servicesData.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-teal-300 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div>
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-950">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-6 grid gap-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 size={18} className="text-teal-600 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition hover:text-teal-700"
                  >
                    Get a quote for this service
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;