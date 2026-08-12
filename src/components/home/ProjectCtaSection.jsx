import { ArrowRight, Laptop, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const ProjectCtaSection = () => {
  return (
    <section className="bg-white px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-teal-700 to-emerald-600 px-6 py-8 text-white shadow-xl shadow-teal-950/10 sm:px-8 sm:py-10 lg:flex-row lg:items-center lg:px-12">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold sm:text-sm">
            <Code2 size={16} />
            Client-first development experience
          </div>
          <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
            Ready to build your digital product?
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-teal-50 sm:text-base">
            Explore our services, discuss your project requirements, and choose
            a tech stack that works best for your business growth.
          </p>
        </div>
        <Link
          to="/contact"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-bold text-teal-700 transition hover:bg-teal-50"
        >
          <Laptop size={18} />
          Start a Project
          <ArrowRight size={17} />
        </Link>
      </div>
    </section>
  );
};

export default ProjectCtaSection;