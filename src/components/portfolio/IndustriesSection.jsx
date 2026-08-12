import { ShoppingBag, Scissors, Stethoscope, Briefcase, GraduationCap } from "lucide-react";

const industries = [
  { name: "Salons & Wellness", icon: Scissors },
  { name: "Retail & E-Commerce", icon: ShoppingBag },
  { name: "Healthcare Apps", icon: Stethoscope },
  { name: "Corporate Services", icon: Briefcase },
  { name: "EdTech Platforms", icon: GraduationCap },
];

const IndustriesSection = () => {
  return (
    <section className="border-b border-slate-200 bg-white py-10 sm:py-14">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
          Industries we empower with modern technology
        </p>
        
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8 opacity-80 sm:gap-16 lg:gap-24">
          {industries.map((industry) => {
            const Icon = industry.icon;
            return (
              <div key={industry.name} className="flex flex-col items-center gap-2 text-slate-700 hover:text-teal-600 transition-colors">
                <Icon size={32} strokeWidth={1.5} />
                <span className="text-sm font-semibold tracking-tight">{industry.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default IndustriesSection;