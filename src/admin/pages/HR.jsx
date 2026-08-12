import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  UserCheck, 
  FileText, 
  CalendarClock, 
  UserMinus,
  FileSignature,
  Clock,
  Banknote,
  Laptop,
  TrendingUp,
  CalendarDays
} from 'lucide-react';

const HR = () => {
  const navigate = useNavigate();

  const hrModules = [
    {
      title: "Job Postings & Hiring",
      description: "Create and manage active job openings on the career page.",
      icon: Briefcase,
      path: "/admin/hr/hiring",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      title: "Applied Candidates",
      description: "Review new resumes and track applicant statuses.",
      icon: Users,
    //   path: "/admin/hr/applicants",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      title: "Selected Candidates",
      description: "Manage shortlisted and hired candidates ready for onboarding.",
      icon: UserCheck,
    //   path: "/admin/hr/selected",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      title: "Offer Letters & Docs",
      description: "Generate offer letters, experience certificates, and agreements.",
      icon: FileSignature,
    //   path: "/admin/hr/documents",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    },
    {
      title: "Attendance Tracking",
      description: "Monitor daily check-ins, check-outs, and working hours.",
      icon: Clock,
    //   path: "/admin/hr/attendance",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    },
    {
      title: "Leaves Management",
      description: "Approve or reject employee leave and time-off requests.",
      icon: CalendarClock,
    //   path: "/admin/hr/leaves",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Payroll & Payslips",
      description: "Manage employee salaries, deductions, and generate payslips.",
      icon: Banknote,
    //   path: "/admin/hr/payroll",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      title: "Asset Management",
      description: "Track company laptops, test devices, and software licenses.",
      icon: Laptop,
    //   path: "/admin/hr/assets",
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      title: "Performance & Appraisals",
      description: "Track employee KPIs, annual reviews, and promotions.",
      icon: TrendingUp,
    //   path: "/admin/hr/performance",
      color: "text-rose-600",
      bgColor: "bg-rose-50"
    },
    {
      title: "Company Holidays",
      description: "Manage official company holiday calendar for the year.",
      icon: CalendarDays,
    //   path: "/admin/hr/holidays",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50"
    },
    {
      title: "Notice Period & Exits",
      description: "Manage resignations, notice periods, and exit formalities.",
      icon: UserMinus,
    //   path: "/admin/hr/offboarding",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      title: "Employee Directory",
      description: "View and manage all active employees in the organization.",
      icon: FileText,
      path: "/admin/employees",
      color: "text-slate-600",
      bgColor: "bg-slate-100"
    }
  ];

  return (
    <div className="flex w-full flex-col p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">HR Management</h1>
        
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {hrModules.map((module, index) => {
          const Icon = module.icon;
          return (
            <div 
              key={index}
              onClick={() => navigate(module.path)}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-teal-300 hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${module.bgColor} ${module.color} transition-transform group-hover:scale-110`}>
                <Icon size={22} />
              </div>
              <h3 className="mb-1.5 text-[15px] font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                {module.title}
              </h3>
              <p className="text-[12px] leading-relaxed text-slate-500">
                {module.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HR;