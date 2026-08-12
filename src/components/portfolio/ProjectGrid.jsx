import { useState } from "react";
import { ArrowUpRight, Cloud, Stethoscope, Compass, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const categories = ["All", "SaaS & Apps", "Web Platforms"];

const projects = [
  {
    id: 1,
    title: "BookMyGlow App & Platform",
    category: "SaaS & Apps",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1374&auto=format&fit=crop",
    description: "A comprehensive salon and client management platform equipped with mobile apps, automated appointment scheduling, and Google Play Console publishing integration.",
    icon: Cloud,
  },
  {
    id: 2,
    title: "Doctor & Client Management System",
    category: "Web Platforms",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1470&auto=format&fit=crop",
    description: "A secure medical and healthcare portal designed to manage doctor schedules, patient profiles, digital prescriptions, and clinic workflows seamlessly.",
    icon: Stethoscope,
  },
  {
    id: 3,
    title: "Travel Explorer Website",
    category: "Web Platforms",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1470&auto=format&fit=crop",
    description: "An immersive travel booking platform featuring destination packages, interactive itineraries, tour guides, and secure reservation processing.",
    icon: Compass,
  },
  {
    id: 4,
    title: "Modern Blogging Website",
    category: "Web Platforms",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1470&auto=format&fit=crop",
    description: "A fast, SEO-optimized content publishing platform featuring clean typography, category filters, and an engaging reader interface.",
    icon: BookOpen,
  },
];

const ProjectGrid = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = projects.filter((project) =>
    activeCategory === "All" ? true : project.category === activeCategory
  );

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={[
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                activeCategory === category
                  ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:text-teal-700"
              ].join(" ")}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {filteredProjects.map((project) => {
            const Icon = project.icon;
            
            return (
              <div
                key={project.id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
                    <Icon size={14} className="text-teal-600" />
                    {project.category}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-slate-950">
                    {project.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                    {project.description}
                  </p>
                  
                  <Link
                    to="/contact"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition hover:text-teal-700"
                  >
                    Discuss a similar project
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProjectGrid;