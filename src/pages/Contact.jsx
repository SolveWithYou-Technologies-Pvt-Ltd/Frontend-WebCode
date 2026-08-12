import QuoteHero from "../components/contact/QuoteHero";
import QuoteFormSection from "../components/contact/QuoteFormSection";

const Contact = () => {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <QuoteHero />
      <QuoteFormSection />
    </main>
  );
};

export default Contact;