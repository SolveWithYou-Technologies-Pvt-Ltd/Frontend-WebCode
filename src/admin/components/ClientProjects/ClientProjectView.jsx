import React, { useState, useEffect } from "react";
import { ArrowLeft, Briefcase, CheckCircle2, CircleDashed, Users, Calendar, ShieldCheck } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchClientProjectById, updateProjectTaskStatus, updateProjectDetails } from "../../api/clientProjectApi"; 

const ClientProjectView = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedSupport, setSelectedSupport] = useState("");
  const [isSavingSupport, setIsSavingSupport] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchClientProjectById(id);
        setProject(data);
      } catch (error) {
        toast.error("Failed to load project details");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const handleTaskStatusChange = async (taskId, newStatus) => {
    try {
      const response = await updateProjectTaskStatus(id, taskId, newStatus);
      if (response && response.success) {
        setProject(response.data);
        toast.success("Task status updated successfully");
      } else {
        toast.error("Failed to update task status");
      }
    } catch (error) {
      toast.error("Failed to update task status");
    }
  };

  const handleStartSupport = async () => {
    if (!selectedSupport) {
      toast.error("Please select a duration");
      return;
    }
    
    setIsSavingSupport(true);
    try {
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      if (selectedSupport === "7 Days") endDate.setDate(endDate.getDate() + 7);
      else if (selectedSupport === "15 Days") endDate.setDate(endDate.getDate() + 15);
      else if (selectedSupport === "1 Month") endDate.setMonth(endDate.getMonth() + 1);
      else if (selectedSupport === "6 Months") endDate.setMonth(endDate.getMonth() + 6);
      else if (selectedSupport === "1 Year") endDate.setFullYear(endDate.getFullYear() + 1);

      const response = await updateProjectDetails(id, {
        supportDuration: selectedSupport,
        supportStartDate: startDate,
        supportEndDate: endDate
      });

      if (response && response.success) {
        setProject(prev => ({
          ...response.data,
          assignedEmployee: response.data.assignedEmployee?.fullName ? response.data.assignedEmployee : prev.assignedEmployee,
          proposal: response.data.proposal?.totalCost ? response.data.proposal : prev.proposal
        }));
        toast.success("Support and Maintenance started successfully!");
      } else {
        toast.error("Failed to save support details");
      }
    } catch (error) {
      toast.error("Failed to start support");
    } finally {
      setIsSavingSupport(false);
    }
  };

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
    return <div className="p-10 text-center text-slate-500 font-medium">Loading project details...</div>;
  }

  if (!project) return null;

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

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <Link to="/admin/clientprojects" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-600 mb-6 transition-colors">
        <ArrowLeft size={16} />
        Back to Projects
      </Link>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm mb-6">
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
            <p className="mt-2 text-sm text-slate-500">Project ID: {project.projectId} • Client: {project.clientName}</p>
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

      {project.status === 'Completed' && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2 mb-1">
              <ShieldCheck size={20} className="text-emerald-600" /> Support & Maintenance
            </h2>
            <p className="text-sm text-emerald-700">Manage post-completion support for this project.</p>
          </div>

          {project.supportDuration && project.supportDuration !== "None" ? (
             <div className="bg-white px-5 py-3 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-6">
               <div>
                 <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Plan</p>
                 <p className="text-[14px] font-semibold text-slate-900">{project.supportDuration}</p>
               </div>
               <div className="h-8 w-px bg-slate-200"></div>
               <div>
                 <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Valid Until</p>
                 <p className="text-[14px] font-semibold text-slate-900">{formatDate(project.supportEndDate)}</p>
               </div>
             </div>
          ) : (
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={selectedSupport}
                onChange={(e) => setSelectedSupport(e.target.value)}
                className="flex-1 md:w-48 px-3 py-2.5 text-sm font-medium border rounded-xl outline-none bg-white border-emerald-200 text-slate-700 focus:border-emerald-500 transition-colors cursor-pointer"
              >
                <option value="">Select Duration...</option>
                <option value="7 Days">7 Days</option>
                <option value="15 Days">15 Days</option>
                <option value="1 Month">1 Month</option>
                <option value="6 Months">6 Months</option>
                <option value="1 Year">1 Year</option>
              </select>
              <button
                onClick={handleStartSupport}
                disabled={!selectedSupport || isSavingSupport}
                className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 transition-colors"
              >
                {isSavingSupport ? "Saving..." : "Start"}
              </button>
            </div>
          )}
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
                        <span className="text-amber-600 text-[12px] font-bold">Due: {formatTotal(task.taskDue, currencySymbol)}</span>
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

                    <select
                      value={task.status}
                      onChange={(e) => handleTaskStatusChange(task._id, e.target.value)}
                      className={`text-[11px] font-bold outline-none cursor-pointer bg-transparent py-1.5 px-2 border rounded-md transition-colors ${
                        task.status === 'Completed' ? 'border-emerald-300 text-emerald-700 bg-white hover:bg-emerald-50' :
                        task.status === 'In Progress' ? 'border-blue-300 text-blue-700 bg-white hover:bg-blue-50' :
                        'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500">No roadmap tasks defined yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Users size={20} className="text-teal-600" /> Assigned Team
            </h2>
            <div className="space-y-4">
              {project.assignedEmployee && project.assignedEmployee.fullName ? (
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

          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
             <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-teal-600" /> Schedule
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Start Date</p>
                <p className="mt-1 text-[14px] font-semibold text-slate-900">{formatDate(project.startDate)}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Target End Date</p>
                <p className="mt-1 text-[14px] font-semibold text-slate-900">{formatDate(project.endDate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProjectView;