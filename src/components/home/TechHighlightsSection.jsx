import webImage from "../../assets/home/feature-web.svg";
import mobileImage from "../../assets/home/feature-mobile.svg";
import cloudImage from "../../assets/home/feature-cloud.svg";
import supportImage from "../../assets/home/feature-support.svg";

const highlights = [
  {
    title: "Custom Web Applications",
    description: "Build robust, scalable, and secure web platforms tailored to your business needs.",
    image: webImage,
  },
  {
    title: "Mobile App Development",
    description: "Create engaging native and cross-platform applications for iOS and Android.",
    image: mobileImage,
  },
  {
    title: "Cloud Infrastructure",
    description: "Ensure high availability and security with modern cloud hosting and deployment.",
    image: cloudImage,
  },
  {
    title: "24/7 Technical Support",
    description: "Keep your digital products running smoothly with round-the-clock maintenance.",
    image: supportImage,
  },
];

const TechHighlightsSection = () => {
  return (
    <section className="border-y border-slate-100 bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-600 sm:text-sm">
            Designed for scaling businesses
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            Everything you need for successful digital transformation
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {highlights.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-950/5 sm:p-6"
            >
              <img
                src={item.image}
                alt=""
                className="mx-auto h-20 w-20 transition duration-300 group-hover:scale-105 sm:h-24 sm:w-24"
              />
              <h3 className="mt-5 text-base font-bold text-slate-950 sm:text-lg">
                {item.title}
              </h3>
              <p className="mt-2 text-xs leading-6 text-slate-600 sm:text-sm">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechHighlightsSection;