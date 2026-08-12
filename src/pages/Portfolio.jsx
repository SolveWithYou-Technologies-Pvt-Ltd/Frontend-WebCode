import PortfolioHero from "../components/portfolio/PortfolioHero";
import IndustriesSection from "../components/portfolio/IndustriesSection";
import ProjectGrid from "../components/portfolio/ProjectGrid";
import PortfolioTestimonial from "../components/portfolio/PortfolioTestimonial";
import ProjectCtaSection from "../components/home/ProjectCtaSection";

const Portfolio = () => {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <PortfolioHero />
      <IndustriesSection />
      <ProjectGrid />
      <PortfolioTestimonial />
      <div className="bg-slate-50 pb-12 pt-16">
        <ProjectCtaSection />
      </div>
    </main>
  );
};

export default Portfolio;