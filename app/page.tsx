"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ConceptSection from "@/components/ConceptSection";
import Process from "@/components/Process";
import Work from "@/components/Work";
import TrustedBy from "@/components/TrustedBy";
import CaseStudies from "@/components/CaseStudies";
import BlogSection from "@/components/BlogSection";
import Engagements from "@/components/Engagements";
import FaqSection from "@/components/FaqSection";
import FinalCTA from "@/components/FinalCTA";
import PreFooterStatements from "@/components/PreFooterStatements";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <main className="relative w-full">
      <Loader onFinish={() => setLoadingComplete(true)} />

      {/* Main Content */}
      <div className={`transition-opacity duration-1000 ${loadingComplete ? 'opacity-100 animations-started' : 'opacity-0 h-screen overflow-hidden'}`}>
        <Hero />
        <Services />
        <ConceptSection />
        <Process />
        <Work />
        <TrustedBy />
        <CaseStudies />
        <BlogSection />
        <Engagements />
        <FaqSection />
        <FinalCTA />
        <PreFooterStatements />
        <Footer />
        <Navigation />
      </div>
    </main>
  );
}
