const technologies = [
  { category: "Frontend", tools: ["React.js", "Next.js", "Vue.js", "Tailwind CSS"] },
  { category: "Backend", tools: ["Node.js", "Python", "Java", "PHP / Laravel"] },
  { category: "Mobile App", tools: ["React Native", "Flutter", "iOS (Swift)", "Android (Kotlin)"] },
  { category: "Cloud & DevOps", tools: ["AWS", "Google Cloud", "Docker", "CI/CD Pipelines"] },
];

const TechStackSection = () => {
  return (
    <section className="bg-slate-950 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Technologies We Master
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            We use modern, scalable, and secure technology stacks to build enterprise-grade applications.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {technologies.map((tech) => (
            <div key={tech.category} className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h3 className="text-lg font-semibold text-teal-400">
                {tech.category}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {tech.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-md bg-slate-800 px-3 py-1.5 text-sm font-medium text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;