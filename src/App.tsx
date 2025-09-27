import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import OnboardingPage from './components/OnboardingPage';

function App() {
  const [currentPage, setCurrentPage] = useState<'landing' | 'onboarding' | 'dashboard'>('landing');

  const handleGetStarted = () => {
    setCurrentPage('onboarding');
  };

  const handleBackToLanding = () => {
    setCurrentPage('landing');
  };

  const handleOnboardingComplete = () => {
    setCurrentPage('dashboard');
  };

  if (currentPage === 'onboarding') {
    return <OnboardingPage onBack={handleBackToLanding} onComplete={handleOnboardingComplete} />;
  }

  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-charcoal text-white font-manrope flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bebas text-white mb-4">Dashboard Coming Soon</h1>
          <p className="text-gray-300 mb-6">Your content generation dashboard is being prepared...</p>
          <button 
            onClick={() => setCurrentPage('landing')}
            className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
          >
            Back to Landing
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-charcoal text-white font-manrope">
      <Header onGetStarted={handleGetStarted} />
      <main>
        <HeroSection onGetStarted={handleGetStarted} />
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