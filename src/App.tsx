import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-charcoal text-white font-manrope">
      <Header />
      <main>
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;