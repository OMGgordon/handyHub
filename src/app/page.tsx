'use client'

import { Navbar } from "../components/Navbar";
import { HeroSection } from "../components/HeroSection";
import { ServiceCategories } from "../components/ServicesCategories";
import { PopularProjects } from "../components/PopularProjects";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <ServiceCategories />
      <PopularProjects />
      <Footer />
    </div>
  );
}
