import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, User, Briefcase, Target } from 'lucide-react';

interface OnboardingData {
  name: string;
  email: string;
  profession: string;
  niche: string;
  goals: string[];
  tone: string;
}

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    name: '',
    email: '',
    profession: '',
    niche: '',
    goals: [],
    tone: ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const totalSteps = 3;

  const professionOptions = [
    'Marketing & Sales',
    'Business Development',
    'Consulting',
    'Finance & Accounting',
    'Technology & Software',
    'Healthcare',
    'Education',
    'Real Estate',
    'Legal Services',
    'Design & Creative',
    'HR & Recruitment',
    'Operations & Management',
    'Other'
  ];

  const goalOptions = [
    { id: 'reach', label: 'Increase Reach & Visibility', description: 'Grow your audience and expand your network' },
    { id: 'authority', label: 'Build Thought Leadership', description: 'Establish yourself as an industry expert' },
    { id: 'clients', label: 'Generate Leads & Clients', description: 'Attract potential customers and opportunities' },
    { id: 'networking', label: 'Professional Networking', description: 'Connect with peers and industry leaders' },
    { id: 'career', label: 'Career Advancement', description: 'Showcase skills for promotions or job opportunities' }
  ];

  const toneOptions = [
    { id: 'professional', label: 'Professional', description: 'Formal, authoritative, business-focused' },
    { id: 'casual', label: 'Casual & Approachable', description: 'Friendly, conversational, relatable' },
    { id: 'storytelling', label: 'Storytelling', description: 'Narrative-driven, engaging, personal' },
    { id: 'educational', label: 'Educational', description: 'Informative, helpful, teaching-focused' }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        break;
      case 2:
        if (!formData.profession) newErrors.profession = 'Please select your profession';
        if (!formData.niche.trim()) newErrors.niche = 'Please describe your niche or expertise area';
        break;
      case 3:
        if (formData.goals.length === 0) newErrors.goals = 'Please select at least one goal';
        if (!formData.tone) newErrors.tone = 'Please select your preferred tone';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    console.log('Onboarding completed:', formData);
    // Here you would typically send the data to your backend
    alert('Profile setup complete! Generating your first content ideas...');
  };

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleGoal = (goalId: string) => {
    const currentGoals = formData.goals;
    const newGoals = currentGoals.includes(goalId)
      ? currentGoals.filter(g => g !== goalId)
      : [...currentGoals, goalId];
    updateFormData('goals', newGoals);
  };

  const getStepIcon = (stepNumber: number) => {
    switch (stepNumber) {
      case 1: return User;
      case 2: return Briefcase;
      case 3: return Target;
      default: return User;
    }
  };

  const renderProgressBar = () => (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        {[1, 2, 3].map((step) => {
          const StepIcon = getStepIcon(step);
          return (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step <= currentStep
                  ? 'bg-gradient-to-r from-electric-blue to-magenta border-electric-blue text-white'
                  : 'border-gray-600 text-gray-400'
              }`}>
                {step < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
              </div>
              {step < 3 && (
                <div className={`w-16 sm:w-24 h-1 mx-2 rounded-full transition-all duration-300 ${
                  step < currentStep
                    ? 'bg-gradient-to-r from-electric-blue to-magenta'
                    : 'bg-gray-600'
                }`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="text-center text-gray-400 text-sm">
        Step {currentStep} of {totalSteps}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bebas text-white mb-4">Let's Get Started</h2>
        <p className="text-gray-300 text-lg">First, tell us a bit about yourself</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-white font-semibold mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Enter your full name"
            className={`w-full p-4 bg-medium-gray border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.name && <p className="text-red-400 text-sm mt-2">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            placeholder="Enter your email address"
            className={`w-full p-4 bg-medium-gray border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.email && <p className="text-red-400 text-sm mt-2">{errors.email}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bebas text-white mb-4">Your Professional Background</h2>
        <p className="text-gray-300 text-lg">Help us understand your industry and expertise</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-white font-semibold mb-2">
            Industry/Profession *
          </label>
          <select
            value={formData.profession}
            onChange={(e) => updateFormData('profession', e.target.value)}
            className={`w-full p-4 bg-medium-gray border rounded-xl text-white focus:outline-none focus:border-electric-blue transition-colors ${
              errors.profession ? 'border-red-500' : 'border-gray-600'
            }`}
          >
            <option value="">Select your industry</option>
            {professionOptions.map((option) => (
              <option key={option} value={option} className="bg-medium-gray">
                {option}
              </option>
            ))}
          </select>
          {errors.profession && <p className="text-red-400 text-sm mt-2">{errors.profession}</p>}
        </div>

        <div>
          <label className="block text-white font-semibold mb-2">
            Your Niche/Expertise Area *
          </label>
          <textarea
            value={formData.niche}
            onChange={(e) => updateFormData('niche', e.target.value)}
            placeholder="Describe your specific area of expertise, target audience, or unique positioning (e.g., 'B2B SaaS marketing for startups', 'Financial planning for young professionals')"
            rows={4}
            className={`w-full p-4 bg-medium-gray border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-electric-blue transition-colors resize-none ${
              errors.niche ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          {errors.niche && <p className="text-red-400 text-sm mt-2">{errors.niche}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8 animate-fade-in-up">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bebas text-white mb-4">Content Goals & Style</h2>
        <p className="text-gray-300 text-lg">Define your content strategy and preferred tone</p>
      </div>

      <div className="space-y-8">
        {/* Goals Section */}
        <div>
          <label className="block text-white font-semibold mb-4">
            What are your main goals? * <span className="text-gray-400 font-normal">(Select all that apply)</span>
          </label>
          <div className="grid gap-3">
            {goalOptions.map((goal) => (
              <div
                key={goal.id}
                onClick={() => toggleGoal(goal.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:border-electric-blue ${
                  formData.goals.includes(goal.id)
                    ? 'border-electric-blue bg-electric-blue/10'
                    : 'border-gray-600 bg-medium-gray hover:bg-medium-gray/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    formData.goals.includes(goal.id)
                      ? 'border-electric-blue bg-electric-blue'
                      : 'border-gray-400'
                  }`}>
                    {formData.goals.includes(goal.id) && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{goal.label}</div>
                    <div className="text-gray-400 text-sm">{goal.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.goals && <p className="text-red-400 text-sm mt-2">{errors.goals}</p>}
        </div>

        {/* Tone Section */}
        <div>
          <label className="block text-white font-semibold mb-4">
            Preferred Content Tone *
          </label>
          <div className="grid gap-3">
            {toneOptions.map((tone) => (
              <div
                key={tone.id}
                onClick={() => updateFormData('tone', tone.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 hover:border-magenta ${
                  formData.tone === tone.id
                    ? 'border-magenta bg-magenta/10'
                    : 'border-gray-600 bg-medium-gray hover:bg-medium-gray/80'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    formData.tone === tone.id
                      ? 'border-magenta bg-magenta'
                      : 'border-gray-400'
                  }`}>
                    {formData.tone === tone.id && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{tone.label}</div>
                    <div className="text-gray-400 text-sm">{tone.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.tone && <p className="text-red-400 text-sm mt-2">{errors.tone}</p>}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-charcoal py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {renderProgressBar()}

        <div className="bg-dark-gray rounded-2xl shadow-2xl p-8 border border-gray-700">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                currentStep === 1
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-gray-300 hover:text-white border border-gray-600 hover:border-electric-blue'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-gradient-to-r from-electric-blue to-magenta text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
            >
              <span>
                {currentStep === totalSteps ? 'Generate My First Ideas' : 'Continue'}
              </span>
              {currentStep < totalSteps && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ✓ Your data is secure and private  ✓ Takes less than 2 minutes  ✓ No spam, ever
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;