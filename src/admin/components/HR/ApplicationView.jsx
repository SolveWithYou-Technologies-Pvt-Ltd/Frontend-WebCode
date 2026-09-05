import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, User, Briefcase, Mail, Phone, FileText, ExternalLink, Calendar, Trash2 } from "lucide-react";
import { fetchApplicationById, updateApplicationStatus, deleteApplication } from "../../api/applicationApi";

const ApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApplicationById(id);
        setApplication(data);
      } catch (error) {
        toast.error("Failed to load application details");
        navigate("/admin/hr/applicants");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await updateApplicationStatus(id, newStatus);
      setApplication(prev => ({ ...prev, status: newStatus }));
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplication(id);
        toast.success("Application deleted successfully");
        navigate("/admin/hr/applicants");
      } catch (error) {
        toast.error("Failed to delete application");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-10 min-h-[60vh]">
        <p className="text-sm font-medium text-slate-500">Loading details...</p>
      </div>
    );
  }

  if (!application) return null;

  const currentSalary = Number(application.currentSalary || 0);
  const expectedSalary = Number(application.expectedSalary || 0);
  let salaryHike = null;

  if (application.experienceLevel === "Experienced" && currentSalary > 0 && expectedSalary > 0) {
    salaryHike = (((expectedSalary - currentSalary) / currentSalary) * 100).toFixed(1);
  }

  return (
    <div className="mx-auto w-full max-w-5xl flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl">
            <User size={18} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Application Details <span className="text-teal-600">#{application.applicationId}</span>
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-0.5">
              {application.isGeneral ? "Direct Application" : "Vacancy Application"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={application.status}
            onChange={handleStatusChange}
            className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all cursor-pointer"
          >
            <option value="Pending">Status: Pending</option>
            <option value="Reviewed">Status: Reviewed</option>
            <option value="Shortlisted">Status: Shortlisted</option>
            <option value="Rejected">Status: Rejected</option>
          </select>
          <button
            onClick={handleDelete}
            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
            title="Delete Application"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User size={20} className="text-teal-600" /> Candidate Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                <p className="mt-1.5 text-sm font-bold text-slate-900">{application.fullName}</p>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Applied Role</label>
                <p className="mt-1.5 text-sm font-bold text-slate-900">{application.appliedRole}</p>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Mail size={14} className="text-slate-400" /> {application.email}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                <div className="mt-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Phone size={14} className="text-slate-400" /> {application.phone}
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Experience Level</label>
                <p className="mt-1.5 text-sm font-bold text-slate-900">{application.experienceLevel}</p>
              </div>

              {application.experienceLevel === "Experienced" ? (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Current Salary</label>
                    <p className="mt-1.5 text-sm font-semibold text-slate-700">₹ {currentSalary.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Expected Salary</label>
                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-700">₹ {expectedSalary.toLocaleString('en-IN')}</span>
                      {salaryHike !== null && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${salaryHike >= 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {salaryHike > 0 ? '+' : ''}{salaryHike}% Hike
                        </span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                application.experienceLevel !== "Fresher" && application.experienceLevel !== "0" && (
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">Expected Salary</label>
                    <p className="mt-1.5 text-sm font-semibold text-slate-700">₹ {expectedSalary.toLocaleString('en-IN')}</p>
                  </div>
                )
              )}
            </div>
          </div>

          {application.coverLetter && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-teal-600" /> Cover Letter
              </h2>
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {application.coverLetter}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-5">Documents & Links</h2>

            <a
              href={application.resumeLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between bg-teal-50 border border-teal-100 p-4 rounded-xl hover:bg-teal-100 transition-colors mb-4 group"
            >
              <div className="flex items-center gap-3">
                <FileText size={20} className="text-teal-600" />
                <span className="text-sm font-bold text-teal-900">View Resume</span>
              </div>
              <ExternalLink size={16} className="text-teal-600 group-hover:scale-110 transition-transform" />
            </a>

            {application.portfolioLink && (
              <a
                href={application.portfolioLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between bg-slate-50 border border-slate-200 p-4 rounded-xl hover:bg-slate-100 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <ExternalLink size={20} className="text-slate-500" />
                  <span className="text-sm font-bold text-slate-700">Portfolio / LinkedIn</span>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:scale-110 transition-transform" />
              </a>
            )}
          </div>

          {!application.isGeneral && application.jobId && (
            <div className="bg-slate-900 rounded-2xl shadow-sm p-6 text-white">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <Briefcase size={20} className="text-teal-400" /> Vacancy Details
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Position</p>
                  <p className="text-sm font-bold mt-1">{application.jobId.title || "N/A"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Department</p>
                    <p className="text-sm font-medium mt-1">{application.jobId.department || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Experience Required</p>
                    <p className="text-sm font-medium mt-1">{application.jobId.experience ? `${application.jobId.experience} Years` : "N/A"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Location & Type</p>
                  <p className="text-sm font-medium mt-1 flex items-center gap-2">
                    {application.jobId.location || "N/A"} <span className="w-1 h-1 rounded-full bg-slate-500"></span> {application.jobId.type || "N/A"}
                  </p>
                </div>

                {application.jobId.type === "Internship" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Internship Type</p>
                      <p className="text-sm font-medium mt-1">{application.jobId.internshipType || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Duration</p>
                      <p className="text-sm font-medium mt-1">{application.jobId.duration || "N/A"}</p>
                    </div>
                  </div>
                )}

                {(application.jobId.minSalary || application.jobId.maxSalary) && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Salary Range</p>
                    <p className="text-sm font-medium mt-1">
                      {application.jobId.minSalary ? `₹${application.jobId.minSalary.toLocaleString('en-IN')}` : ""}
                      {application.jobId.minSalary && application.jobId.maxSalary ? " - " : ""}
                      {application.jobId.maxSalary ? `₹${application.jobId.maxSalary.toLocaleString('en-IN')}` : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-900 mb-4">Application Timeline</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <div className="bg-slate-100 p-2 rounded-lg text-slate-500 mt-0.5">
                  <Calendar size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Applied On</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {new Date(application.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ApplicationView;