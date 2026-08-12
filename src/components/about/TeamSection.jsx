const teamMembers = [
  {
    name: "Vikram Sharma",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Priya Patel",
    role: "Chief Technology Officer (CTO)",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Arjun Desai",
    role: "Lead UI/UX Designer",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Neha Gupta",
    role: "Lead Cloud Engineer",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop",
  },
];

const TeamSection = () => {
  return (
    <section className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Meet Our Experts
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            A dedicated team of developers, designers, and strategists working together to bring your ideas to life.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member) => (
            <div key={member.name} className="group text-center">
              <div className="mx-auto overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={member.image}
                  alt={member.name}
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-950">
                {member.name}
              </h3>
              <p className="text-sm font-medium text-teal-600">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;