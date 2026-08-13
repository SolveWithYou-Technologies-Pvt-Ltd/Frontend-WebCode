import Seo from "../../src/Seo/Seo";
import ServicesHero from "../components/services/ServicesHero";
import ServicesGrid from "../components/services/ServicesGrid";
import ProjectCtaSection from "../components/home/ProjectCtaSection";

const Services = () => {
  return (
    <>
      <Seo 
        title="Premium IT & Software Services | App, Web & SaaS | SolveWithYou"
        description="Explore SolveWithYou's expert services: Custom App Development, SaaS & Software Solutions, Web Design, UI/UX Graphic Design, and Technical Maintenance Support."
        keywords="App Development, Flutter, React Native, SaaS Development, Custom CRM, Web Design, E-commerce, UI/UX Design, Figma, Technical Support, SolveWithYou services"
      />
      <main className="flex min-h-screen w-full flex-col">
        <ServicesHero />
        <ServicesGrid />
        <div className="bg-white pb-12 pt-16">
          <ProjectCtaSection />
        </div>
      </main>
    </>
  );
};

export default Services;