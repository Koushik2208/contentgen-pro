import React, { useState } from 'react';
import OnboardingPage from './components/OnboardingPage';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-charcoal text-white font-manrope">
      <Header />
      <main>
        <OnboardingPage />
      </main>
    </div>
  );
}

export default App;