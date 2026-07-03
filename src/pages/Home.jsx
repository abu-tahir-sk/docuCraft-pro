import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
// Import other components here as you build them out
import Companies from '../components/Companies';
import DashboardPreview from '../components/DashboardPreview';
import HowItWorks from '../components/HowItWorks';
import Statistics from '../components/Statistics';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-inter selection:bg-[#2563EB] selection:text-white">
      <Navbar />
      
      <main>
        <Hero />
        <Companies />
        <Features />
        <DashboardPreview />
        <HowItWorks />
        <Statistics /> 
         <Pricing />
      </main>

      <Footer />
    </div>
  );
}