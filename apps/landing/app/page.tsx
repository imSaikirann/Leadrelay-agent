"use client";

import Footer from "@/components/landing/Footer";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/Step";
import Pricing from "@/components/landing/Pricing";
import WorkspaceDiagram from "@/components/landing/WorkspaceDiagram";

import SocialProof from "@/components/landing/SocialProof";
import FAQ from "@/components/landing/FAQ";
import Waitlist from "@/components/landing/Waitlist";


export default function LandingPage() {
  return (
    <main className="bg-[#FAF9F6] text-[#1A1714] antialiased dark:bg-[radial-gradient(circle_at_top_left,_rgba(212,98,42,0.12),_transparent_24%),linear-gradient(180deg,_#0b0b0b_0%,_#121212_100%)] dark:text-[#F5F1EB]">
     <Hero />
    
      <SocialProof />    
      <HowItWorks />
      <WorkspaceDiagram />
      <Features />
      <Pricing />
      <FAQ />             
      {/* <Waitlist/> */}
      <Footer />
    </main>
  );
}
