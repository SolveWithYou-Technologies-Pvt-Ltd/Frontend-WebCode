import { Quote, Star } from "lucide-react";

const PortfolioTestimonial = () => {
  return (
    <section className="bg-teal-900 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="flex gap-1 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} size={20} fill="currentColor" />
            ))}
          </div>
          
          <Quote size={40} className="mt-8 text-teal-500/50" />
          
          <h2 className="mt-6 text-xl font-medium leading-relaxed text-white sm:text-2xl lg:text-3xl lg:leading-snug">
            "Finding a development partner who understands both the technical complexities of app publishing and business scalability is rare. SolveWithYou Pvt Ltd built our infrastructure from the ground up, ensuring every feature was pixel-perfect and deployment-ready."
          </h2>
          
          <div className="mt-10 flex flex-col items-center gap-2">
            <p className="text-base font-bold text-white">Platform Partner</p>
            <p className="text-sm font-medium text-teal-400">Early Adopter & Client</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioTestimonial;