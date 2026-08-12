import { Mail } from "lucide-react";

const QuoteHero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-24 lg:py-32">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
      
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-400">
          <Mail size={16} />
          Get In Touch
        </span>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Let's build something amazing together.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
          Fill out the form below with your project details or requirements, and our team will get back to you with a tailored proposal and estimate.
        </p>
      </div>
    </section>
  );
};

export default QuoteHero;