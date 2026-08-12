import { ArrowRight, Code2 } from "lucide-react";
import { Link } from "react-router-dom";

const AboutHeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-32">
      <div className="absolute inset-0 bg-slate-50/50" />
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-teal-100/40 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-emerald-100/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
              <Code2 size={16} />
              About SolveWithYou Pvt Ltd
            </span>

            <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              Empowering businesses through innovative digital solutions.
            </h1>

            <p className="mt-6 text-base leading-7 text-slate-600 sm:text-lg">
              We are a team of passionate software engineers, designers, and digital strategists. 
              Our goal is to help businesses navigate the digital landscape by building scalable, 
              secure, and high-performing web and mobile applications.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-teal-600 px-6 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Let's work together
                <ArrowRight size={17} />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1470&auto=format&fit=crop"
                alt="Development team collaborating"
                className="h-full w-full object-cover transition hover:scale-105 duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;