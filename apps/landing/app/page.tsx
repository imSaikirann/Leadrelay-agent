"use client";

import Footer from "@/components/landing/Footer";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/Step";

import SocialProof from "@/components/landing/SocialProof";
import FAQ from "@/components/landing/FAQ";
import Waitlist from "@/components/landing/Waitlist";


export default function LandingPage() {
  return (
    <main className="bg-[#FAF9F6] text-[#1A1714] antialiased">
     <Hero />
    
      <SocialProof />    
      <HowItWorks />
      <Features />
      <FAQ />             
      {/* <Waitlist/> */}
      <Footer />
    </main>
  );
}