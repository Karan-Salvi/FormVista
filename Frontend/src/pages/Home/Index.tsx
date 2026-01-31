import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Blocks,
  Zap,
  Palette,
  BarChart3,
  Check,
} from "lucide-react";
import "@/App.css";
import { TestimonialsSection } from "@/components/Home/TestimonialsSection";
import Navbar from "@/components/Home/Navbar";
import Hero from "@/components/Home/Hero";
import HomeFooter from "@/components/Home/Footer";
import HomeLayout from "@/pages/Home/HomeLayout";
import FAQSection from "@/components/ui/faq-sections";
import CTA from "@/components/Home/CTA";
import Pricing from "@/components/Home/Pricing";
import SecondaryCTA from "@/components/Home/SecondaryCTA";
import HowItWorks from "@/components/Home/HowItWorks";
import Features from "@/components/Home/Features";
import BlockSection from "@/components/Home/BlockSection";

const Index: React.FC = () => {
  return (
    <>
      <Navbar />
      <HomeLayout>
        <Hero />
        <HowItWorks />
        <TestimonialsSection />
        <Features />
        <BlockSection />
        <SecondaryCTA />
        <Pricing />
        <FAQSection />
        <CTA />
      </HomeLayout>
      <HomeFooter />
    </>
  );
};

export default Index;
