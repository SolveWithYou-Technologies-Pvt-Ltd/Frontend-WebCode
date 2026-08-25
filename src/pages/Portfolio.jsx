import Seo from "../../src/Seo/Seo";
import PortfolioHero from "../components/portfolio/PortfolioHero";
import IndustriesSection from "../components/portfolio/IndustriesSection";
import ProjectGrid from "../components/portfolio/ProjectGrid";
import PortfolioTestimonial from "../components/portfolio/PortfolioTestimonial";
import ProjectCtaSection from "../components/home/ProjectCtaSection";

const Portfolio = () => {
  return (
    <>
      <Seo
        title="Our Portfolio & Projects | SolveWithYou | Digital Reality"
        description="Explore our latest projects transforming ideas into digital reality. We build scalable web platforms, custom SaaS, and mobile apps like BookMyGlow and Doctor Management Systems."
        keywords="SolveWithYou portfolio, SaaS platforms, web development, mobile applications, BookMyGlow App, Healthcare apps, EdTech platforms, Salon management software, Doctor scheduling system"
        url="https://www.solvewithyou.in/portfolio"
      />
      <main className="flex min-h-screen w-full flex-col">
        <PortfolioHero />
        <IndustriesSection />
        <ProjectGrid />
        <PortfolioTestimonial />
        <div className="bg-slate-50 pb-12 pt-16">
          <ProjectCtaSection />
        </div>
      </main>
    </>
  );
};

export default Portfolio;