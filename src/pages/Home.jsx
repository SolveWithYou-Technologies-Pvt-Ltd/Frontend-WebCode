import Seo from "../../src/Seo/Seo";
import ProjectCtaSection from "../components/home/ProjectCtaSection";
import DevelopmentJourneySection from "../components/home/DevelopmentJourneySection";
import ServiceFeaturesSection from "../components/home/ServiceFeaturesSection";
import TechHighlightsSection from "../components/home/TechHighlightsSection";
import HeroSection from "../components/home/HeroSection";
import PostLaunchSupportSection from "../components/home/PostLaunchSupportSection";
import ClientTestimonialSection from "../components/home/ClientTestimonialSection";
import ProjectTrackingSection from "../components/home/ProjectTrackingSection";

const Home = () => {
  return (
    <>
      <Seo 
        title="SolveWithYou | Custom Web, Mobile App & Cloud Solutions"
        description="Accelerate your business with SolveWithYou. We design, develop, and deploy scalable custom web platforms, mobile apps, and secure cloud infrastructure with real-time project tracking."
        keywords="Custom web applications, mobile app development, iOS and Android apps, cloud infrastructure, digital transformation, React, Node.js, Agile development, enterprise software, SolveWithYou"
      />
      <HeroSection />
      <TechHighlightsSection />
      <ServiceFeaturesSection />
      <ProjectTrackingSection />
      <ClientTestimonialSection />
      <PostLaunchSupportSection />
      <DevelopmentJourneySection />
      <ProjectCtaSection />
    </>
  );
};

export default Home;