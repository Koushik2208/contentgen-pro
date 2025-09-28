import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import BenefitsSection from './components/BenefitsSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import FaqSection from './components/FaqSection';
import Footer from './components/Footer';
import OnboardingPage from './components/OnboardingPage';
import DashboardPage from './components/DashboardPage';
import CarouselPreviewPage from './components/CarouselPreviewPage';
import ProfileSettingsPage from './components/ProfileSettingsPage';

// Landing Page Component
const LandingPage = () => {
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
};

function App() {
  // Handle OAuth callback
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Check if user has a profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (!profile) {
            // Create profile for OAuth users
            await supabase
              .from('profiles')
              .insert({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Onboarding */}
      <Route path="/onboarding" element={<OnboardingPage />} />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />
      
      {/* Carousel Preview */}
      <Route path="/carousel/:carouselId" element={<CarouselPreviewPage />} />
      
      {/* Profile Settings */}
      <Route path="/profile" element={<ProfileSettingsPage />} />
      
      {/* Redirect any unknown routes to landing page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;