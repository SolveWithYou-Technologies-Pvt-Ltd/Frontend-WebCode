import { useState, useEffect } from "react";
import { Briefcase, MapPin, Clock, ArrowRight, Laptop, Users, Zap, HeartPulse, Banknote, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Seo from "../../src/Seo/Seo";

const perks = [
  {
    icon: Laptop,
    title: "Flexible & Remote Work",
    description: "Work from anywhere or join us in our modern office. We value output over hours."
  },
  {
    icon: HeartPulse,
    title: "Health & Wellness",
    description: "Comprehensive medical insurance for you and your family to keep you secure."
  },
  {
    icon: Zap,
    title: "Learning Budget",
    description: "Annual allowance for courses, conferences, and books to accelerate your growth."
  },
  {
    icon: Users,
    title: "Great Team Culture",
    description: "Collaborative environment with regular team outings and zero micromanagement."
  }
];

const API_URL = "https://backendapi.solvewithyou.in/api/jobs";

const Careers = () => {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await axios.get(`${API_URL}/public`);
        setJobOpenings(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getJobs();
  }, []);

  const filteredJobs = jobOpenings.filter((job) => {
    if (filter === "All") return true;
    if (filter === "Job") return job.type !== "Internship";
    if (filter === "Internship") return job.type === "Internship";
    return true;
  });

  return (
    <>
      <Seo 
        title="Careers at SolveWithYou | IT Jobs & Software Development Opportunities"
        description="Looking for your next big career move? Join SolveWithYou. We are hiring talented developers, designers, and innovators to build scalable digital solutions."
        keywords="Careers at SolveWithYou, IT jobs, software developer jobs, web development careers, UI/UX designer jobs, tech hiring, remote tech jobs, startup jobs"
      />
      <main className="min-h-screen bg-slate-50">
        <section className="relative overflow-hidden bg-slate-900 py-20 sm:py-28 lg:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900/40 to-slate-900" />
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-teal-500/20 blur-[100px]" />
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center rounded-full bg-teal-500/10 px-3 py-1 text-sm font-semibold text-teal-300 ring-1 ring-inset ring-teal-500/20 mb-6">
              We are hiring!
            </span>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build the Future of Digital with Us
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300 leading-relaxed">
              Join our team of passionate creators, engineers, and problem solvers. Let's build world-class software solutions together.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a href="#open-positions" className="rounded-xl bg-teal-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-500">
                View Open Positions
              </a>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Why join our team?</h2>
              <p className="mt-4 text-lg text-slate-600">
                We care about our team as much as we care about our clients. Here is what you get when you work with us.
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {perks.map((perk, index) => {
                const Icon = perk.icon;
                return (
                  <div key={index} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 mb-6">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3">{perk.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{perk.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="open-positions" className="bg-white py-16 sm:py-24 border-t border-slate-200">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Open Positions</h2>
              </div>
              <span className="text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-full w-fit">
                {jobOpenings.length} Roles Available
              </span>
            </div>

            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="py-10 text-center text-sm font-medium text-slate-500">
                  Loading open positions...
                </div>
              ) : jobOpenings.length === 0 ? (
                <div className="py-10 text-center text-sm font-medium text-slate-500">
                  No open positions at the moment. Please check back later.
                </div>
              ) : (
                jobOpenings.map((job) => (
                  <div 
                    key={job._id} 
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-2xl border border-slate-200 p-6 transition-all hover:border-teal-300 hover:shadow-md bg-slate-50 hover:bg-white"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-600">{job.department}</span>
                        {job.type === "Internship" && job.promotionAfterInternship === "Yes" && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                            PPO Available (Performance Based)  
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">{job.title}</h3>
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><Briefcase size={16} className="text-slate-400" /> {job.type}</span>
                        <span className="flex items-center gap-1.5"><Clock size={16} className="text-slate-400" /> {job.experience} {job.experience === "1" ? "Year" : "Years"}</span>
                        
                        {job.type === "Internship" && job.duration && (
                          <span className="flex items-center gap-1.5">
                            <Calendar size={16} className="text-slate-400" /> {job.duration} ({job.internshipType})
                          </span>
                        )}

                        {(job.type !== "Internship" || job.internshipType === "Paid") && job.minSalary && job.maxSalary && (
                          <span className="flex items-center gap-1.5">
                            <Banknote size={16} className="text-slate-400" /> ₹{job.minSalary.toLocaleString('en-IN')} - ₹{job.maxSalary.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <a href={`mailto:careers@digitalservices.com?subject=Application for ${job.title}`} className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-white sm:bg-transparent border sm:border-0 border-slate-200 px-5 py-3 sm:p-0 text-sm font-semibold text-slate-700 sm:text-teal-600 transition group-hover:text-teal-700">
                      Apply Now <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24 bg-teal-900 text-center px-4 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">Don't see a matching role?</h2>
            <p className="text-teal-100 mb-8 text-lg">
              We are always looking for talented individuals. Drop your resume and we will contact you when a relevant position opens up.
            </p>
            <a href="mailto:careers@digitalservices.com" className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-sm font-bold text-teal-900 transition hover:bg-teal-50 shadow-lg">
              Submit Your Resume
            </a>
          </div>
        </section>
      </main>
    </>
  );
};

export default Careers;