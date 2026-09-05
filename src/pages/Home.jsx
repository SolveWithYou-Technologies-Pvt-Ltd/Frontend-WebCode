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
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SolveWithYou",
    "legalName": "SolveWithYou Pvt Ltd",
    "alternateName": "SWY",
    "url": "https://www.solvewithyou.in/",
    "logo": "https://www.solvewithyou.in/logo.png",
    "image": "https://www.solvewithyou.in/logo.png",
    "description": "We Can Create Solutions Together. SolveWithYou offers robust software solutions, custom web platforms, mobile application development, and maintenance services.",
    "telephone": "+91 6306567512",
    "email": "solvewithyou@gmail.com",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91 6306567512",
      "contactType": "customer support",
      "email": "solvewithyou@gmail.com",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://www.facebook.com/solvewithyou",
      "https://www.linkedin.com/company/solvewithyou"
    ]
  };

  return (
    <>
      <Seo
        title="SolveWithYou | Custom Web, Mobile App & Cloud Solutions"
        description="Accelerate your business with SolveWithYou. We design, develop, and deploy scalable custom web platforms, mobile apps, and secure cloud infrastructure with real-time project tracking."
        keywords="Custom web applications, mobile app development, iOS and Android apps, cloud infrastructure, digital transformation, React, Node.js, Agile development, enterprise software, SolveWithYou"
        url="https://www.solvewithyou.in/"
        schemaMarkup={schemaMarkup}
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