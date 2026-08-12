import { CheckCircle2 } from "lucide-react";

const storyPoints = [
  "Started with a vision to simplify complex business problems.",
  "Delivered 150+ successful projects across various industries.",
  "Expanded our team with top-tier developers and designers.",
  "Recognized for building scalable cloud and mobile solutions.",
];

const OurStorySection = () => {
  return (
    <section className="bg-slate-50 py-16 sm:py-24 lg:py-32">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="absolute -left-4 -top-4 h-72 w-72 rounded-full bg-teal-200/50 blur-3xl" />
          <div className="relative overflow-hidden rounded-2xl shadow-xl shadow-slate-200">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1470&auto=format&fit=crop"
              alt="Team discussing project architecture"
              className="w-full object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            The story behind SolveWithYou Pvt Ltd
          </h2>
          
          <p className="mt-6 text-base leading-7 text-slate-600">
            What started as a small group of passionate developers has now grown into a full-scale digital transformation agency. We realized early on that businesses don't just need software; they need reliable digital partners who understand their growth metrics.
          </p>
          
          <p className="mt-4 text-base leading-7 text-slate-600">
            Our mission is to bridge the gap between complex technology and business success by delivering intuitive, high-performance applications.
          </p>

          <div className="mt-8 grid gap-4">
            {storyPoints.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-teal-600" size={20} />
                <p className="text-sm font-medium text-slate-700 sm:text-base">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurStorySection;