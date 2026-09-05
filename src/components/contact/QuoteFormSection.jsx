import { useState, useEffect } from "react";
import { Send, CheckCircle2, Phone, Mail, X } from "lucide-react";

const facilitiesOptions = [
  "Deployment & Cloud Hosting",
  "Email Notifications",
  "WhatsApp Alerts API",
  "SMS & OTP Verification",
  "Payment Gateway Integration",
  "Admin Dashboard / CMS",
  "Analytics & Tracking",
  "Social Media Login",
  "SEO Optimization",
  "Multi-language Support",
  "Push Notifications",
  "Third-party API Integrations"
];

const QuoteFormSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [servicesList, setServicesList] = useState([]);
  const [quoteId, setQuoteId] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    service: "",
    currency: "INR",
    budget: "",
    timeline: "",
    projectTitle: "",
    projectDescription: "",
    referenceLinks: "",
    facilities: []
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("https://backendapi.solvewithyou.in/api/services/public");
        const data = await res.json();
        if (data.success) {
          setServicesList(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFacilityChange = (facility) => {
    setFormData((prev) => {
      const currentFacilities = [...prev.facilities];
      if (currentFacilities.includes(facility)) {
        return {
          ...prev,
          facilities: currentFacilities.filter((f) => f !== facility)
        };
      } else {
        return {
          ...prev,
          facilities: [...currentFacilities, facility]
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("https://backendapi.solvewithyou.in/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setQuoteId(data.quoteId);
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setQuoteId("");
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      service: "",
      currency: "INR",
      budget: "",
      timeline: "",
      projectTitle: "",
      projectDescription: "",
      referenceLinks: "",
      facilities: []
    });
  };

  return (
    <>
      <section className="relative flex min-h-[80vh] items-center justify-center bg-slate-50 py-12 sm:py-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] rounded-full bg-teal-500/5 blur-3xl"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-white p-6 sm:p-12 shadow-sm border border-slate-200">
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                Request a Free Quote
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Aditya"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="aditya@example.com"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                    maxLength={10}
                    minLength={10}
                    pattern="[0-9]{10}"
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, "");
                    }}
                    placeholder="0000000000"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Select Service *</label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  >
                    <option value="">Choose a service</option>
                    {servicesList.map((srv) => (
                      <option key={srv._id} value={srv._id}>
                        {srv.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Budget</label>
                  <div className="flex gap-2">
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-24 px-3 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all cursor-pointer"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                    </select>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      placeholder={formData.currency === "INR" ? "e.g. 5,00,000" : "e.g. 5,000"}
                      className="w-full flex-1 px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all cursor-pointer"
                  >
                    <option value="">Select an estimated timeline</option>
                    <option value="Less than 1 month">Less than 1 month</option>
                    <option value="1 to 3 months">1 to 3 months</option>
                    <option value="3 to 6 months">3 to 6 months</option>
                    <option value="6+ months">6+ months</option>
                    <option value="Not sure yet">Not sure yet</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Project Title *</label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. E-commerce Mobile App"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Reference Links (Optional)</label>
                  <input
                    type="text"
                    name="referenceLinks"
                    value={formData.referenceLinks}
                    onChange={handleInputChange}
                    placeholder="URLs of competitors or inspiration"
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">Additional Facilities & Features Needed</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {facilitiesOptions.map((facility) => (
                    <label
                      key={facility}
                      className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-colors ${formData.facilities.includes(facility)
                        ? "border-teal-600 bg-teal-50/50"
                        : "border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(facility)}
                        onChange={() => handleFacilityChange(facility)}
                        className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-600 cursor-pointer"
                      />
                      <span className="text-[13px] font-medium text-slate-700">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Project Description *</label>
                <textarea
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  placeholder="Tell us about your project goals, core features needed, target audience..."
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-600 transition-all resize-none"
                />
              </div>

              <div className="flex justify-center mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-teal-600 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 shadow-sm disabled:opacity-70"
                >
                  <Send size={18} />
                  {loading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={handleReset}></div>
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[95vh] animate-in fade-in zoom-in duration-300">
            <button
              onClick={handleReset}
              className="absolute right-5 top-5 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600 mb-5">
                <CheckCircle2 size={32} />
              </div>

              <h3 className="text-xl font-bold text-slate-900">Request Submitted!</h3>

              <div className="mt-5 w-full rounded-xl bg-slate-50 p-4 border border-slate-200">
                <p className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">Request ID</p>
                <p className="text-2xl font-bold text-teal-600 mt-1">{quoteId}</p>
              </div>

              <p className="mt-4 text-sm font-medium text-slate-600">
                Our team will contact you within <span className="font-bold text-slate-900">24 Hours</span>.
              </p>

              <div className="mt-6 w-full rounded-xl bg-slate-700 p-5 text-white text-center">
                <h4 className="text-[11px] font-bold tracking-wider text-teal-400 uppercase mb-4">Contact Us</h4>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white">
                      <Phone size={14} />
                    </div>
                    <span className="font-semibold">+91 6306567512</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-white/10 text-white">
                      <Mail size={14} />
                    </div>
                    <span className="font-semibold">solvewithyou@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuoteFormSection;