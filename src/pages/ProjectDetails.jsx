import { ArrowLeft, Briefcase, Globe, Code, CheckCircle2, CircleDashed, Users, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

const projectData = {
  id: "PRJ-2026-042",
  title: "Corporate Portfolio Website",
  status: "In Progress",
  progress: 65,
  startDate: "May 20, 2026",
  links: [
    { label: "Staging Environment", url: "#", icon: Globe },
    { label: "Figma Design File", url: "#", icon: Code },
  ],
  team: [
    { name: "Vikram Sharma", role: "Project Manager" },
    { name: "Priya Patel", role: "Lead Developer" },
  ],
  tasks: [
    { name: "UI/UX Design Finalization", completed: true, date: "May 28" },
    { name: "Frontend Development (React)", completed: true, date: "June 15" },
    { name: "Backend API Integration", completed: false, date: "In Progress" },
    { name: "SEO Optimization & Content", completed: false, date: "Pending" },
    { name: "Final QA Testing & Launch", completed: false, date: "Pending" },
  ]
};

const ProjectDetails = () => {
  return (
    <div className="p-6 sm:p-10">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-600 mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm mb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="text-teal-600" size={24} />
              <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                {projectData.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{projectData.title}</h1>
            <p className="mt-2 text-sm text-slate-500">Project ID: {projectData.id} • Started: {projectData.startDate}</p>
          </div>

          <div className="w-full max-w-sm rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="flex justify-between text-sm font-bold text-slate-900 mb-3">
              <span>Overall Progress</span>
              <span className="text-teal-600">{projectData.progress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div 
                className="h-full rounded-full bg-teal-500 transition-all duration-1000" 
                style={{ width: `${projectData.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6">Project Roadmap & Tasks</h2>
            <div className="space-y-4">
              {projectData.tasks.map((task, idx) => (
                <div key={idx} className={`flex items-center justify-between rounded-xl border p-4 transition-colors ${task.completed ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle2 size={20} className="text-emerald-500" />
                    ) : (
                      <CircleDashed size={20} className="text-slate-400" />
                    )}
                    <span className={`text-sm font-semibold ${task.completed ? 'text-slate-900' : 'text-slate-700'}`}>{task.name}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-500">{task.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Globe size={20} className="text-teal-600" /> Quick Links
            </h2>
            <div className="space-y-3">
              {projectData.links.map((link, idx) => {
                const Icon = link.icon;
                return (
                  <a key={idx} href={link.url} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition">
                    <span className="flex items-center gap-2">
                      <Icon size={16} /> {link.label}
                    </span>
                    <ExternalLink size={14} />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users size={20} className="text-teal-600" /> Assigned Team
            </h2>
            <div className="space-y-4">
              {projectData.team.map((member, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-teal-100 font-bold text-teal-700">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{member.name}</p>
                    <p className="text-xs font-medium text-slate-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;