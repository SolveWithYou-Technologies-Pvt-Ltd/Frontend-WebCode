import React from 'react';

const teamMembers = [
  {
    name: "Aditya Kr Yadav",
    role: "Software Developer",
    description: "Architecting scalable web solutions from intuitive front-end interfaces to robust back-end databases.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Puneet Prajapati",
    role: "Software Developer",
    description: "Crafting responsive, high-performance websites with a strong focus on clean code and modern UI layouts.",
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Aman Narayan",
    role: "App Developer",
    description: "Building powerful, user-centric mobile applications that connect businesses with seamless digital interactions.",
    image: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=500&auto=format&fit=crop",
  },
  {
    name: "Ali Mehdi",
    role: "Business Dev & Ops Lead",
    description: "Acquiring strategic projects, building client relationships, and overseeing end-to-end operations for smooth delivery.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500&auto=format&fit=crop",
  },
];

const TeamSection = () => {
  return (
    <section className="bg-slate-50 py-10 sm:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Meet Our Core Team
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            A dedicated group of tech enthusiasts and strategists working together to bring your digital vision to life.
          </p>
        </div>

        <div className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="group flex flex-col items-center rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl text-center"
            >
              <div className="relative mx-auto mb-6 h-32 w-32 rounded-full ring-4 ring-slate-50 overflow-hidden shadow-inner">
                <img
                  src={member.image}
                  alt={`${member.role} concept`}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              {/* Enhanced Name Font */}
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-950">
                {member.name}
              </h3>

              {/* Enhanced Role Font */}
              <p className="mt-2 text-sm font-bold uppercase tracking-wider text-teal-600">
                {member.role}
              </p>

              {/* Enhanced Description Font */}
              <p className="mt-4 flex-1 text-base leading-relaxed text-slate-600">
                {member.description}
              </p>

              <div className="mt-8 flex gap-5">
                <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-teal-600 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;