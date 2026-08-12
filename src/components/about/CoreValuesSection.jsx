import { Lightbulb, ShieldCheck, Target, Users } from "lucide-react";

const values = [
  {
    title: "Innovation First",
    description: "We constantly explore new technologies and frameworks to deliver future-proof solutions.",
    icon: Lightbulb,
  },
  {
    title: "Uncompromising Quality",
    description: "Our code goes through rigorous testing to ensure security, performance, and scalability.",
    icon: ShieldCheck,
  },
  {
    title: "Client-Centric Approach",
    description: "We align our development process with your business goals to ensure maximum ROI.",
    icon: Target,
  },
  {
    title: "Collaborative Teamwork",
    description: "We believe in transparent communication and working closely with our clients at every step.",
    icon: Users,
  },
];

const CoreValuesSection = () => {
  return (
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Our Core Values
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            The principles that drive our engineering culture and shape how we deliver value to our clients.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div
                key={value.title}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-8 transition hover:border-teal-200 hover:bg-white hover:shadow-xl hover:shadow-teal-950/5"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm">
                  <Icon size={24} />
                </div>
                <h3 className="mt-6 text-lg font-bold text-slate-950">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;