import { Briefcase, ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const mockProjects = [
  {
    id: "PRJ-2026-042",
    title: "Corporate Portfolio Website",
    status: "In Progress",
    progress: 65,
    startDate: "May 20, 2026",
  },
  {
    id: "PRJ-2026-081",
    title: "Salon Management SaaS Platform",
    status: "Planning",
    progress: 15,
    startDate: "Aug 10, 2026",
  },
  {
    id: "PRJ-2025-112",
    title: "E-Commerce Mobile App",
    status: "Completed",
    progress: 100,
    startDate: "Nov 05, 2025",
  }
];

const Projects = () => {
  return (
    <div className="p-6 sm:p-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl flex items-center gap-2">
            <Briefcase className="text-teal-600" size={28} />
            My Projects
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Track the progress of your ongoing and completed projects.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {mockProjects.map((project) => (
          <div
            key={project.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {project.id}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${
                  project.status === "Completed"
                    ? "bg-emerald-100 text-emerald-700"
                    : project.status === "In Progress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {project.status === "Completed" && <CheckCircle2 size={12} className="mr-1" />}
                {project.status === "Planning" && <Clock size={12} className="mr-1" />}
                {project.status}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
              <p className="mt-2 text-sm font-medium text-slate-500">Started: {project.startDate}</p>

              <div className="mt-6">
                <div className="flex justify-between text-sm font-bold text-slate-900 mb-2">
                  <span>Progress</span>
                  <span className="text-teal-600">{project.progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-500 transition-all duration-1000"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4">
              <Link
                to={`/project/${project.id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-teal-700 border border-teal-200 transition hover:bg-teal-50"
              >
                View Project Details
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;