import AboutHeroSection from "../components/about/AboutHeroSection";
import StatsSection from "../components/about/StatsSection";
import OurStorySection from "../components/about/OurStorySection";
import TechStackSection from "../components/about/TechStackSection";
import CoreValuesSection from "../components/about/CoreValuesSection";
import TeamSection from "../components/about/TeamSection";
import ProjectCtaSection from "../components/home/ProjectCtaSection";

const AboutUs = () => {
  return (
    <main className="flex min-h-screen w-full flex-col">
      {/* 1. Hero Introduction */}
      <AboutHeroSection />
      
      {/* 2. Company Numbers/Stats */}
      <StatsSection />
      
      {/* 3. The Company Story */}
      <OurStorySection />
      
      {/* 4. Core Values */}
      <CoreValuesSection />
      
      {/* 5. Technologies Used (Dark Theme section) */}
      <TechStackSection />
      
      {/* 6. Meet The Team */}
      <TeamSection />
      
      {/* 7. Call To Action Footer */}
      <div className="bg-slate-50 pb-12 pt-16">
        <ProjectCtaSection />
      </div>
    </main>
  );
};

export default AboutUs;