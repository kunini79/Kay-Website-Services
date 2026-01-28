"use client";

import { useState } from "react";
import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Work from "@/components/Work";
import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <main className="relative w-full">
      <Loader onFinish={() => setLoadingComplete(true)} />

      {/* Main Content - could hide or allow scroll behind loader, but reference implies a wait */}
      {/* We can let it render but maybe disable pointer events or scroll until loaded */}
      <div className={`transition-opacity duration-1000 ${loadingComplete ? 'opacity-100 animations-started' : 'opacity-0 h-screen overflow-hidden'}`}>
        <Hero />
        <Services />
        <Process />
        <Work />
        <Footer />
        <Navigation />
      </div>
    </main>
  );
}
