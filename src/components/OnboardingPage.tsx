import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Zap, User, Briefcase, Target } from 'lucide-react';

interface OnboardingPageProps {
  onBack: () => void;
  onComplete: () => void;
}

interface FormData {
  name: string;
  email: string;
  profession: string;
  customProfession: string;
  goals: string[];
  tone: string;
}

const professions = [
  'Marketing Professional',
  'Sales Manager',
  'Business Coach',
  'Consultant',
  'Entrepreneur',
  'Real Estate Agent',
  'Financial Advisor',
  'Healthcare Professional',
  'Technology Professional',
  'Creative Professional',
  'Other (specify)'
];

const goals = [
  { id: 'reach', label: 'Increase Reach & Visibility', description: 'Grow your audience and expand your network' },
  { id: 'authority', label: 'Build Thought Leadership', description: 'Establish yourself as an industry expert' },
  { id: 'clients', label: 'Generate Leads & Clients', description: 'Attract potential customers and business opportunities' },
  { id: 'network', label: 'Professional Networking', description: 'Connect with peers and industry leaders' }
];

const tones = [
  { id: 'professional', label: 'Professional', description: 'Formal, authoritative, business-focused' },
  { id: 'casual', label: 'Conversational', description: 'Friendly, approachable, relatable' },
  { id: 'storytelling', label: 'Storytelling', description: 'Narrative-driven, engaging, personal' },
  { id: 'educational', label: 'Educational', description: 'Informative, helpful, teaching-focused' }
];

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onBack, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    profession: '',
    customProfession: '',
    goals: [],
    tone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    }

    if (step === 2) {
      if (!formData.profession) newErrors.profession = 'Please select your profession';
      if (formData.profession === 'Other (specify)' && !formData.customProfession.trim()) {
        newErrors.customProfession = 'Please specify your profession';
      }
    }

    if (step === 3) {
      if (formData.goals.length === 0) newErrors.goals = 'Please select at least one goal';
      if (!formData.tone) newErrors.tone = 'Please select your preferred tone';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = () => {
    console.log('Onboarding completed:', formData);
    onComplete();
  };

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return User;
      case 2: return Briefcase;
      case 3: return Target;
      default: return User;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Personal Information';
      case 2: return 'Your Profession';
      case 3: return 'Goals & Style';
      default: return '';
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Let\'s start with the basics';
      case 2: return 'Tell us about your professional background';
      case 3: return 'Define your content goals and preferred tone';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-charcoal text-white font-manrope">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-electric-blue/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-magenta/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-medium-gray">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-electric-blue to-magenta p-2 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bebas text-white">
                  ContentGen Pro
                </span>
              </div>
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center space-x-8 mb-12">
            {[1, 2, 3].map((step) => {
              const StepIcon = getStepIcon(step);
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              
              return (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-electric-blue to-magenta border-transparent' 
                      : isActive 
                        ? 'border-electric-blue bg-electric-blue/10' 
                        : 'border-gray-600 bg-medium-gray'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <StepIcon className={`w-6 h-6 ${isActive ? 'text-electric-blue' : 'text-gray-400'}`} />
                    )}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                      step < currentStep ? 'bg-gradient-to-r from-electric-blue to-magenta' : 'bg-gray-600'
                    }`}></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Main Content */}
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bebas text-white mb-4">
                {getStepTitle(currentStep)}
              </h1>
              <p className="text-xl text-gray-300">
                {getStepDescription(currentStep)}
              </p>
            </div>

            <div className="bg-medium-gray rounded-2xl p-8 border border-gray-700">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                        errors.email ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                      }`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
              )}

              {/* Step 2: Profession */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      What best describes your profession? *
                    </label>
                    <select
                      value={formData.profession}
                      onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                      className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                        errors.profession ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                      }`}
                    >
                      <option value="">Select your profession</option>
                      {professions.map((profession) => (
                        <option key={profession} value={profession}>
                          {profession}
                        </option>
                      ))}
                    </select>
                    {errors.profession && <p className="text-red-400 text-sm mt-1">{errors.profession}</p>}
                  </div>

                  {formData.profession === 'Other (specify)' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Please specify your profession *
                      </label>
                      <input
                        type="text"
                        value={formData.customProfession}
                        onChange={(e) => setFormData(prev => ({ ...prev, customProfession: e.target.value }))}
                        className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                          errors.customProfession ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                        }`}
                        placeholder="Enter your profession"
                      />
                      {errors.customProfession && <p className="text-red-400 text-sm mt-1">{errors.customProfession}</p>}
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Goals & Tone */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      What are your main content goals? (Select all that apply) *
                    </label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {goals.map((goal) => (
                        <button
                          key={goal.id}
                          onClick={() => handleGoalToggle(goal.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                            formData.goals.includes(goal.id)
                              ? 'border-electric-blue bg-electric-blue/10'
                              : 'border-gray-600 bg-charcoal hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                              formData.goals.includes(goal.id)
                                ? 'border-electric-blue bg-electric-blue'
                                : 'border-gray-500'
                            }`}>
                              {formData.goals.includes(goal.id) && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white mb-1">{goal.label}</h4>
                              <p className="text-sm text-gray-400">{goal.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.goals && <p className="text-red-400 text-sm mt-2">{errors.goals}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-4">
                      What's your preferred content tone? *
                    </label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {tones.map((tone) => (
                        <button
                          key={tone.id}
                          onClick={() => setFormData(prev => ({ ...prev, tone: tone.id }))}
                          className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                            formData.tone === tone.id
                              ? 'border-magenta bg-magenta/10'
                              : 'border-gray-600 bg-charcoal hover:border-gray-500'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                              formData.tone === tone.id
                                ? 'border-magenta bg-magenta'
                                : 'border-gray-500'
                            }`}>
                              {formData.tone === tone.id && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white mb-1">{tone.label}</h4>
                              <p className="text-sm text-gray-400">{tone.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.tone && <p className="text-red-400 text-sm mt-2">{errors.tone}</p>}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-600">
                <button
                  onClick={handleBack}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
                >
                  <span>
                    {currentStep === 3 ? 'Generate My First Ideas' : 'Continue'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress Text */}
            <div className="text-center mt-6">
              <p className="text-gray-400">
                Step {currentStep} of 3 • Takes less than 2 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;