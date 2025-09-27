import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import OnboardingPage from './components/OnboardingPage';
import DashboardPage from './components/DashboardPage';

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
      <DashboardPage onBackToLanding={() => setCurrentPage('landing')} />
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