import ServicesHero from "../components/services/ServicesHero";
import ServicesGrid from "../components/services/ServicesGrid";
import ProjectCtaSection from "../components/home/ProjectCtaSection";

const Services = () => {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <ServicesHero />
      <ServicesGrid />
      <div className="bg-white pb-12 pt-16">
        <ProjectCtaSection />
      </div>
    </main>
  );
};

export default Services;