const stats = [
  { label: "Successful Projects", value: "150+" },
  { label: "Happy Clients", value: "90+" },
  { label: "Expert Developers", value: "25+" },
  { label: "Years of Excellence", value: "5+" },
];

const StatsSection = () => {
  return (
    <section className="bg-slate-950 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm font-medium text-slate-400 sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;