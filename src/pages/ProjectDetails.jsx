import React, { useState, useEffect } from "react";
import { ArrowLeft, Briefcase, Globe, Code, CheckCircle2, CircleDashed, Users, ExternalLink, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ProjectDetails = () => {
  const { id } = useParams(); 
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem("UserAuthToken")
        const response = await axios.get(`http://localhost:8000/api/clientprojects/quote/${id}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (response.data && response.data.success) {
          setProject(response.data.data);
        }
      } catch (error) {
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const parseAmount = (val) => {
    if (!val) return 0;
    const match = String(val).match(/[\d,]+(\.\d+)?/);
    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
  };

  const getCurrencySymbol = (val) => {
    if (!val) return 'Rs.';
    const str = String(val).trim();
    const match = str.match(/^[^\d]+/);
    let sym = match ? match[0].trim() : 'Rs.';
    if (sym === '₹' || sym === 'INR') sym = 'Rs.';
    return sym;
  };

  const formatTotal = (num, currencySymbol) => {
    return `${currencySymbol} ${Number(num || 0).toLocaleString('en-IN')}`;
  };

  if (loading) {
    return <div className="p-10 text-center font-medium text-slate-500 min-h-[60vh] flex items-center justify-center">Loading project details...</div>;
  }

  if (!project) {
    return (
      <div className="p-10 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Project Not Initiated</h2>
        <p className="text-slate-500 mb-6">This project setup has not been completed by the administrative team yet.</p>
        <Link to="/quotes" className="px-5 py-2.5 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition">Return to Quotes</Link>
      </div>
    );
  }

  const totalCostRaw = project.proposal?.totalCost || "0";
  const currencySymbol = getCurrencySymbol(totalCostRaw);
  const proposalTotalAmount = parseAmount(totalCostRaw);

  let taskCalculationsTotal = 0;
  let totalPaidFromTasks = 0;

  const tasksWithCalculations = project.tasks?.map((task) => {
    const taskTotal = parseAmount(task.amount);
    let taskDue = taskTotal;

    if (task.due !== undefined) {
      taskDue = parseAmount(task.due);
    } else if (task.dueAmount !== undefined) {
      taskDue = parseAmount(task.dueAmount);
    } else if (task.dueDate !== undefined && !isNaN(Number(String(task.dueDate).replace(/,/g, '')))) {
      taskDue = parseAmount(task.dueDate);
    } else if (task.status === "Completed") {
      taskDue = 0;
    }

    const taskPaid = taskTotal - taskDue;

    taskCalculationsTotal += taskTotal;
    totalPaidFromTasks += taskPaid;

    return {
      ...task,
      taskTotal,
      taskDue,
      taskPaid
    };
  }) || [];

  const overallProjectTotal = proposalTotalAmount > 0 ? proposalTotalAmount : taskCalculationsTotal;
  const overallDue = Math.max(0, overallProjectTotal - totalPaidFromTasks);

  let daysRemaining = null;
  if (project.supportEndDate) {
    const today = new Date();
    const endDate = new Date(project.supportEndDate);
    const timeDiff = endDate.getTime() - today.getTime();
    daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  return (
    <div className="p-6 sm:p-10">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-600 mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm mb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Briefcase className="text-teal-600" size={24} />
              <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                project.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {project.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{project.title}</h1>
            <p className="mt-2 text-sm text-slate-500">Project ID: {project.projectId} • Started: {new Date(project.startDate).toLocaleDateString()}</p>
          </div>

          <div className="w-full max-w-sm rounded-2xl bg-slate-50 p-4 border border-slate-100">
            <div className="flex justify-between text-sm font-bold text-slate-900 mb-3">
              <span>Overall Progress</span>
              <span className="text-teal-600">{project.progress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div 
                className="h-full rounded-full bg-teal-500 transition-all duration-1000" 
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {project.supportDuration && project.supportDuration !== "None" && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2 mb-3">
              <ShieldCheck size={20} className="text-emerald-600" /> Support & Maintenance
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-2">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700/70">Plan</span>
                <p className="text-sm font-semibold text-emerald-900">{project.supportDuration}</p>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700/70">Valid Until</span>
                <p className="text-sm font-semibold text-emerald-900">{formatDate(project.supportEndDate)}</p>
              </div>
            </div>
            
            {daysRemaining !== null && daysRemaining <= 5 && daysRemaining > 0 && (
               <p className="mt-3 text-[13px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg inline-block">
                 Support and maintenance expires in {daysRemaining} days.
               </p>
            )}
            {daysRemaining !== null && daysRemaining <= 0 && (
               <p className="mt-3 text-[13px] font-bold text-red-700 bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg inline-block">
                 Support and maintenance has expired.
               </p>
            )}
          </div>
          
          <a
            href="http://localhost:5173/support"
            className="shrink-0 px-6 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
          >
            Get Support
          </a>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-lg font-bold text-slate-900">Project Roadmap & Tasks</h2>
              
              {overallProjectTotal > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[13px] font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                    Total: {formatTotal(overallProjectTotal, currencySymbol)}
                  </span>
                  {totalPaidFromTasks > 0 && (
                    <span className="text-[13px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      Paid: {formatTotal(totalPaidFromTasks, currencySymbol)}
                    </span>
                  )}
                  {overallDue > 0 ? (
                    <span className="text-[13px] font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                      Due: {formatTotal(overallDue, currencySymbol)}
                    </span>
                  ) : (
                    <span className="text-[13px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      Fully Paid
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4">
              {tasksWithCalculations.length > 0 ? tasksWithCalculations.map((task) => (
                <div key={task._id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border p-4 transition-colors ${
                  task.status === 'Completed' ? 'border-emerald-200 bg-emerald-50/50' : 
                  'border-slate-100 bg-slate-50'
                }`}>
                  <div className="flex items-center gap-3">
                    {task.status === 'Completed' ? (
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                    ) : (
                      <CircleDashed size={18} className={task.status === 'In Progress' ? "text-blue-500 shrink-0" : "text-slate-400 shrink-0"} />
                    )}
                    <span className={`text-[13px] font-semibold ${task.status === 'Completed' ? 'text-slate-900 line-through opacity-70' : 'text-slate-700'}`}>
                      {task.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                    <div className="flex flex-col items-start sm:items-end gap-0.5 mr-1 text-[13px] font-medium">
                      {task.taskTotal > 0 && (
                        <span className="text-slate-600 font-bold">Total: {formatTotal(task.taskTotal, currencySymbol)}</span>
                      )}
                      
                      {task.taskPaid > 0 && (
                        <span className="text-emerald-600 text-[12px] font-bold">Paid: {formatTotal(task.taskPaid, currencySymbol)}</span>
                      )}

                      {task.taskDue > 0 && (
                        <span className="text-amber-600 text-[12px] font-bold">Please Pay: {formatTotal(task.taskDue, currencySymbol)}</span>
                      )}

                      {task.targetDate && (
                        <span className="text-slate-500 text-[10px]">Target: {task.targetDate}</span>
                      )}
                      
                      {task.dueDate && isNaN(Number(String(task.dueDate).replace(/,/g, ''))) && (
                        <span className="text-slate-500 text-[10px]">Target: {task.dueDate}</span>
                      )}

                      {task.status === 'Completed' && task.completedDate && (
                        <span className="text-slate-500 text-[10px] mt-0.5">Completed: {formatDate(task.completedDate)}</span>
                      )}
                    </div>
                    
                    <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border ${
                      task.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                      task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                      'bg-slate-50 text-slate-600 border-slate-300'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500">No roadmap tasks defined yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {project.links && project.links.length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Globe size={20} className="text-teal-600" /> Quick Links
              </h2>
              <div className="space-y-3">
                {project.links.map((link, idx) => (
                  <a key={idx} href={link.url} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition">
                    <span className="flex items-center gap-2">
                      <Code size={16} /> {link.label}
                    </span>
                    <ExternalLink size={14} />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users size={20} className="text-teal-600" /> Assigned Team
            </h2>
            <div className="space-y-4">
              {project.assignedEmployee ? (
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-teal-100 font-bold text-teal-700 uppercase">
                    {project.assignedEmployee.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{project.assignedEmployee.fullName}</p>
                    <p className="text-xs font-medium text-slate-500">
                      {project.assignedEmployee.designation || "Project Specialist"}
                      {project.assignedEmployee.employeeCode ? ` • Emp ID: ${project.assignedEmployee.employeeCode}` : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Team assignment in progress...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;