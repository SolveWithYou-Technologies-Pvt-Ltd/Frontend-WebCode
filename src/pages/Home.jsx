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