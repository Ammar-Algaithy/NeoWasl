import { useEffect } from "react";
import { motion } from "framer-motion";
import ContactUsSection from "./components/ContactUs";
import FooterSection from "./components/Footer";
import HeroSection from "./components/HeroSection";
import WhyChooseSection from "./components/WhyChooseUs";

export default function LandingPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  const sectionAnimation = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 }, // ✅ must be 0
    transition: { duration: 0.6, ease: "easeOut" as const },
    viewport: { once: true, amount: 0.2 },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow space-y-1">
        <motion.div {...sectionAnimation} style={{ width: "100%" }}>
          <HeroSection />
        </motion.div>

        <motion.div {...sectionAnimation}>
          <WhyChooseSection />
        </motion.div>

        <motion.div {...sectionAnimation}>
          <ContactUsSection />
        </motion.div>
      </main>

      <FooterSection />
    </div>
  );
}
