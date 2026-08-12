import { ArrowRight, Quote, Star } from "lucide-react";
import { Link } from "react-router-dom";
import clientStoryImage from "../../assets/home/client-story.svg";

const ClientTestimonialSection = () => {
  return (
    <section className="overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 shadow-xl shadow-slate-950/10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-72 bg-gradient-to-br from-teal-100 to-teal-600 p-6 sm:min-h-96 sm:p-8">
            <img
              src={clientStoryImage}
              alt="Client collaborating with development team"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute bottom-5 left-5 rounded-xl bg-white/90 px-4 py-3 shadow-lg backdrop-blur sm:bottom-7 sm:left-7">
              <p className="text-xs font-semibold text-slate-500">
                Project Delivered
              </p>
              <p className="mt-1 text-sm font-bold text-slate-950">
                On-time and within budget
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={17} fill="currentColor" />
              ))}
            </div>
            <Quote className="mt-6 text-teal-400" size={34} />
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              A reliable partner for our digital transformation
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-300 sm:text-base">
              “The development process was seamless, communication was clear, and the final application exceeded our expectations in both design and performance.”
            </p>
            <div className="mt-5">
              <p className="text-sm font-bold text-white">Rahul Verma</p>
              <p className="mt-1 text-xs text-slate-400">
                CEO, Enterprise Solutions
              </p>
            </div>
            <Link
              to="/contact"
              className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-teal-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-400"
            >
              Start your project
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientTestimonialSection;