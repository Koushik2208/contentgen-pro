import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, User, Briefcase, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService } from '../lib/database';

interface FormData {
  name: string;
  email: string;
  password: string;
  profession: string;
  customProfession: string;
  goals: string[];
  tone: string;
}

interface AuthState {
  isLoading: boolean;
  error: string | null;
  mode: 'signup' | 'signin';
}

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = auth, 1 = profile, 2 = profession, 3 = goals
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { signUp, signIn, user } = useAuth();

  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    mode: "signup",
  });

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    profession: "",
    customProfession: "",
    goals: [],
    tone: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Simple redirect logic - if user is authenticated, go to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleEmailAuth = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      if (authState.mode === "signup") {
        const { error } = await signUp(formData.email, formData.password);
        if (error) {
          setAuthState((prev) => ({
            ...prev,
            error: error.message,
            isLoading: false,
          }));
          return;
        }
        setAuthState((prev) => ({
          ...prev,
          error:
            "Please check your email and click the verification link to continue.",
          isLoading: false,
        }));
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          setAuthState((prev) => ({
            ...prev,
            error: error.message,
            isLoading: false,
          }));
          return;
        }
        setCurrentStep(1);
        setAuthState((prev) => ({ ...prev, isLoading: false, error: null }));
      }
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: "An unexpected error occurred. Please try again.",
        isLoading: false,
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
    } else if (step === 2) {
      if (!formData.profession.trim()) newErrors.profession = "Profession is required";
      if (formData.profession === "Other (specify)" && !formData.customProfession.trim()) {
        newErrors.customProfession = "Please specify your profession";
      }
    } else if (step === 3) {
      if (formData.goals.length === 0) newErrors.goals = "Please select at least one goal";
      if (!formData.tone.trim()) newErrors.tone = "Please select a tone";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 0) {
      handleEmailAuth();
      return;
    }
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      // Save user profile
      await DatabaseService.upsertUserProfile({
        id: user.id,
        email: user.email || '',
        name: formData.name,
        industry: formData.profession !== 'Other (specify)' ? formData.profession : formData.customProfession,
        target_audience: formData.goals.join(', ')
      });

      // Save user preferences
      await DatabaseService.upsertUserPreferences({
        user_id: user.id,
        profession: formData.profession,
        custom_profession: formData.customProfession,
        content_goals: formData.goals,
        preferred_tone: formData.tone,
        content_pillars: [],
        email_notifications: {
          contentReady: true,
          weeklyDigest: true,
          productUpdates: true,
          tips: true
        }
      });

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      setAuthState((prev) => ({
        ...prev,
        error: 'Failed to save your preferences. Please try again.',
        isLoading: false,
      }));
    }
  };

  const handleGoalToggle = (goalId: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.includes(goalId)
        ? prev.goals.filter(g => g !== goalId)
        : [...prev.goals, goalId]
    }));
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  const steps = [
    { id: 0, title: 'Create Account', icon: User },
    { id: 1, title: 'Your Profile', icon: User },
    { id: 2, title: 'Your Profession', icon: Briefcase },
    { id: 3, title: 'Your Goals', icon: Target },
  ];

  const goals = [
    { id: 'reach', label: 'Increase Reach & Visibility' },
    { id: 'authority', label: 'Build Thought Leadership' },
    { id: 'clients', label: 'Generate Leads & Clients' },
    { id: 'network', label: 'Professional Networking' }
  ];

  const tones = [
    { id: 'Professional', label: 'Professional' },
    { id: 'Conversational', label: 'Conversational' },
    { id: 'Storytelling', label: 'Storytelling' },
    { id: 'Educational', label: 'Educational' }
  ];

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
                  <User className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bebas text-white">
                  ContentGen Pro
                </span>
              </div>
              <button
                onClick={handleBackToLanding}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                    isActive 
                      ? 'border-electric-blue bg-electric-blue text-white' 
                      : isCompleted 
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-gray-600 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      isActive ? 'text-electric-blue' : isCompleted ? 'text-green-400' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="bg-medium-gray rounded-2xl p-8 border border-gray-700">
            {/* Step 0: Authentication */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bebas text-white mb-4">
                    Welcome to ContentGen Pro
                  </h2>
                  <p className="text-gray-300">
                    Create your account to start generating amazing content
                  </p>
                </div>

                {/* Auth Mode Toggle */}
                <div className="flex bg-charcoal rounded-lg p-1 mb-6">
                  <button
                    onClick={() => setAuthState(prev => ({ ...prev, mode: 'signup', error: null }))}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authState.mode === 'signup'
                        ? 'bg-electric-blue text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => setAuthState(prev => ({ ...prev, mode: 'signin', error: null }))}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                      authState.mode === 'signin'
                        ? 'bg-electric-blue text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Sign In
                  </button>
                </div>

                {/* Auth Form */}
                <div className="space-y-4">
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

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors pr-12 ${
                          errors.password ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                        }`}
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
                  </div>
                </div>

                {/* Error Message */}
                {authState.error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400 text-sm">{authState.error}</p>
                  </div>
                )}

                {/* Continue Button */}
                <button
                  onClick={handleNext}
                  disabled={authState.isLoading}
                  className="w-full bg-gradient-to-r from-electric-blue to-magenta text-white py-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authState.isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            )}

            {/* Step 1: Profile */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bebas text-white mb-4">
                    Tell us about yourself
                  </h2>
                  <p className="text-gray-300">
                    Help us personalize your content experience
                  </p>
                </div>

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
              </div>
            )}

            {/* Step 2: Profession */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bebas text-white mb-4">
                    What's your profession?
                  </h2>
                  <p className="text-gray-300">
                    This helps us tailor content to your industry
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Profession *
                  </label>
                  <select
                    value={formData.profession}
                    onChange={(e) => setFormData(prev => ({ ...prev, profession: e.target.value }))}
                    className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors ${
                      errors.profession ? 'border-red-500' : 'border-gray-600'
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
                      Specify Your Profession *
                    </label>
                    <input
                      type="text"
                      value={formData.customProfession}
                      onChange={(e) => setFormData(prev => ({ ...prev, customProfession: e.target.value }))}
                      className={`w-full px-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors ${
                        errors.customProfession ? 'border-red-500' : 'border-gray-600'
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
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bebas text-white mb-4">
                    What are your goals?
                  </h2>
                  <p className="text-gray-300">
                    Select your content goals and preferred tone
                  </p>
                </div>

                {/* Goals */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Content Goals (Select all that apply) *
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
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            formData.goals.includes(goal.id)
                              ? 'border-electric-blue bg-electric-blue'
                              : 'border-gray-500'
                          }`}>
                            {formData.goals.includes(goal.id) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="font-semibold text-white">{goal.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.goals && <p className="text-red-400 text-sm mt-2">{errors.goals}</p>}
                </div>

                {/* Tone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Preferred Content Tone *
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
                        <div className="flex items-center space-x-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            formData.tone === tone.id
                              ? 'border-magenta bg-magenta'
                              : 'border-gray-500'
                          }`}>
                            {formData.tone === tone.id && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <span className="font-semibold text-white">{tone.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                  {errors.tone && <p className="text-red-400 text-sm mt-2">{errors.tone}</p>}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep > 0 && (
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
                  disabled={authState.isLoading}
                  className="flex items-center space-x-2 bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {authState.isLoading && currentStep === 3 ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : null}
                  <span>
                    {currentStep === 3 ? 'Complete Setup' : 'Continue'}
                  </span>
                  {!authState.isLoading && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;