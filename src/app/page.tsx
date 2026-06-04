import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroBanner from "@/components/sections/HeroBanner";
import BrandPromise from "@/components/sections/BrandPromise";
import ServicePillars from "@/components/sections/ServicePillars";
import FeaturedWorkCarousel from "@/components/sections/FeaturedWorkCarousel";
import ConsultationSection from "@/components/sections/ConsultationSection";
import ProcessSection from "@/components/sections/ProcessSection";
import AboutPreview from "@/components/sections/AboutPreview";
import FAQSection from "@/components/sections/FAQSection";
import FinalCTA from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroBanner />
        <BrandPromise />
        <ServicePillars />
        <FeaturedWorkCarousel />
        <ConsultationSection />
        <ProcessSection />
        <AboutPreview />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
