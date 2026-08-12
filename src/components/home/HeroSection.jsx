import { ArrowRight, Code, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import heroDevImage from "../../assets/home/hero-developer.svg";

const HeroSection = () => {
  return (
    <section className="overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white">
      <div className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.03fr_0.97fr] lg:px-8 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1.5 text-xs font-semibold text-teal-700 shadow-sm sm:text-sm">
            <ShieldCheck size={16} />
            Reliable code, seamless scaling
          </span>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl lg:text-5xl xl:text-6xl">
            Build robust software solutions to accelerate your business.
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base lg:text-lg">
            From custom web platforms to mobile applications, we design, develop,
            and deploy high-performance digital products tailored for modern enterprises.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/portfolio"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-teal-600 px-5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              <Code size={18} />
              View Portfolio
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Discuss Your Idea
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["Modern Tech", "React & Node.js"],
              ["Scalable", "Cloud Architecture"],
              ["Secure", "Data Protection"],
            ].map(([title, description]) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <p className="text-sm font-bold text-slate-900">{title}</p>
                <p className="mt-0.5 text-xs text-slate-500">{description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -left-8 top-14 h-40 w-40 rounded-full bg-emerald-100 blur-3xl" />
          <div className="absolute -right-8 bottom-12 h-48 w-48 rounded-full bg-teal-100 blur-3xl" />
          <div className="relative rounded-[28px] border border-teal-100 bg-white p-3 shadow-2xl shadow-teal-950/10 sm:p-5">
            <img
              src={heroDevImage}
              alt="Software development illustration"
              className="w-full rounded-[22px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;