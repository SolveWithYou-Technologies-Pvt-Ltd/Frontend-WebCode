import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Smartphone, Cloud, Code, Palette, Wrench, ArrowRight, CheckCircle2, 
  Briefcase, Globe, Database, Shield, Zap, Layout 
} from "lucide-react";
import axios from "axios";
const API_URL = "https://backendapi.solvewithyou.in/api/services";

const iconMap = {
  Smartphone, Cloud, Code, Palette, Wrench, Briefcase, Globe, Database, Shield, Zap, Layout
};

const ServicesGrid = () => {
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await axios.get(`${API_URL}/public`);;
        setServicesData(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, []);

  if (loading) {
    return (
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium text-slate-500">Loading services...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Our Core Services
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            End-to-end digital solutions engineered to scale your business and accelerate growth.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {servicesData.map((service) => {
            const Icon = iconMap[service.icon] || Code;
            return (
              <div
                key={service._id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:border-teal-300 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div>
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                    <Icon size={28} />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-950">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-base leading-7 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-6 grid gap-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 size={18} className="text-teal-600 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 transition hover:text-teal-700"
                  >
                    Get a quote for this service
                    <ArrowRight size={16} />
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

export default ServicesGrid;