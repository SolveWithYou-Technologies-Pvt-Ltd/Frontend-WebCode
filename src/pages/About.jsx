import Seo from "../../src/Seo/Seo";
import AboutHeroSection from "../components/about/AboutHeroSection";
import StatsSection from "../components/about/StatsSection";
import OurStorySection from "../components/about/OurStorySection";
import TechStackSection from "../components/about/TechStackSection";
import CoreValuesSection from "../components/about/CoreValuesSection";
import TeamSection from "../components/about/TeamSection";
import ProjectCtaSection from "../components/home/ProjectCtaSection";

const AboutUs = () => {
  return (
    <>
      <Seo 
        title="About SolveWithYou Pvt Ltd | Digital Transformation & Software Agency"
        description="Discover SolveWithYou Pvt Ltd. With 5+ years of excellence and 150+ successful projects, our expert software engineers build scalable web, cloud, and mobile applications."
        keywords="SolveWithYou Pvt Ltd, digital transformation agency, software engineering team, scalable web applications, mobile app development, React Native, AWS, Node.js"
      />
      <main className="flex min-h-screen w-full flex-col">
        <AboutHeroSection />
        <StatsSection />
        <OurStorySection />
        <CoreValuesSection />
        <TechStackSection />
        <TeamSection />
        <div className="bg-slate-50 pb-12 pt-16">
          <ProjectCtaSection />
        </div>
      </main>
    </>
  );
};

export default AboutUs;