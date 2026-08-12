import requirementImage from "../../assets/home/step-requirement.svg";
import proposalImage from "../../assets/home/step-proposal.svg";
import designImage from "../../assets/home/step-design.svg";
import developmentImage from "../../assets/home/step-development.svg";
import launchImage from "../../assets/home/step-launch.svg";

const steps = [
  {
    number: "01",
    title: "Share requirements",
    description: "Discuss your project goals, target audience, and required features.",
    image: requirementImage,
  },
  {
    number: "02",
    title: "Get a proposal",
    description: "Receive a detailed project roadmap, technology stack, and cost estimate.",
    image: proposalImage,
  },
  {
    number: "03",
    title: "UI/UX Design",
    description: "Review wireframes and approve the visual design of your application.",
    image: designImage,
  },
  {
    number: "04",
    title: "Development",
    description: "Our engineers build your software with regular progress updates.",
    image: developmentImage,
  },
  {
    number: "05",
    title: "Launch & Support",
    description: "Deploy your product live and get ongoing technical maintenance.",
    image: launchImage,
  },
];

const DevelopmentJourneySection = () => {
  return (
    <section className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600 sm:text-sm">
            Simple development journey
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            From initial idea to successful launch
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
            Each step is kept clear so clients always understand what happens next during the software lifecycle.
          </p>
        </div>
        <div className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-5">
          <div className="absolute left-[10%] right-[10%] top-16 hidden border-t border-dashed border-teal-200 lg:block" />
          {steps.map((step) => (
            <article
              key={step.number}
              className="relative rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:border-teal-200 hover:shadow-lg hover:shadow-teal-950/5"
            >
              <span className="absolute right-4 top-4 text-xs font-bold text-teal-500">
                {step.number}
              </span>
              <img
                src={step.image}
                alt=""
                className="mx-auto h-24 w-24 sm:h-28 sm:w-28"
              />
              <h3 className="mt-4 text-sm font-bold text-slate-950 sm:text-base">
                {step.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DevelopmentJourneySection;