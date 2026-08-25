import Seo from "../../src/Seo/Seo";
import QuoteHero from "../components/contact/QuoteHero";
import QuoteFormSection from "../components/contact/QuoteFormSection";

const Contact = () => {
  return (
    <>
      <Seo
        title="Contact Us & Get a Free Quote | SolveWithYou"
        description="Ready to build something amazing? Contact SolveWithYou for a free, tailored proposal on custom software, SaaS, web, and mobile app development."
        keywords="Contact SolveWithYou, IT agency contact, request a free quote, software development estimate, hire app developers, SaaS development quote, solvewithyou@gmail.com"
        url="https://www.solvewithyou.in/contact"
      />
      <main className="flex min-h-screen w-full flex-col">
        <QuoteHero />
        <QuoteFormSection />
      </main>
    </>
  );
};

export default Contact;