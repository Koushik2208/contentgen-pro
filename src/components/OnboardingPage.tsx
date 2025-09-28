import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Zap, User, Briefcase, Target, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  mode: 'signin' | 'signup';
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

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0 = auth, 1 = profile, 2 = profession, 3 = goals
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    error: null,
    mode: 'signup'
  });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    profession: '',
    customProfession: '',
    goals: [],
    tone: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    setAuthState({ isLoading: true, error: null, mode: 'signin' });
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      setAuthState({ 
        isLoading: false, 
        error: error.message || 'Failed to sign in with Google', 
        mode: 'signin' 
      });
    }
  };

  const handleEmailAuth = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Please enter a valid email';
    
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    if (authState.mode === 'signup' && !formData.name.trim()) {
      newErrors.name = 'Name is required for sign up';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      if (authState.mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name
            }
          }
        });

        if (error) throw error;

        if (data.user) {
          // Create profile record
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: formData.email,
              name: formData.name,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }

          // Move to next step for profile completion
          setCurrentStep(1);
          setAuthState({ isLoading: false, error: null, mode: 'signup' });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (error) throw error;

        if (data.user) {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      let errorMessage = 'Authentication failed';
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message.includes('User already registered')) {
        errorMessage = 'Account already exists. Try signing in instead.';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'Please check your email and confirm your account';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setAuthState({ 
        isLoading: false, 
        error: errorMessage, 
        mode: authState.mode 
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
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

  const handleNext = async () => {
    if (currentStep === 0) {
      // Auth step handled by separate functions
      return;
    }

    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        await handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Update profile with onboarding data
        const { error } = await supabase
          .from('profiles')
          .update({
            profession: formData.profession,
            custom_profession: formData.profession === 'Other (specify)' ? formData.customProfession : null,
            goals: formData.goals,
            tone: formData.tone,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) {
          console.error('Profile update error:', error);
        }
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Submit error:', error);
      navigate('/dashboard'); // Navigate anyway
    }
  };

  const handleBackToHome = () => {
    navigate('/');
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
      case 0: return User;
      case 1: return User;
      case 2: return Briefcase;
      case 3: return Target;
      default: return User;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 0: return 'Welcome to ContentGen Pro';
      case 1: return 'Personal Information';
      case 2: return 'Your Profession';
      case 3: return 'Goals & Style';
      default: return '';
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 0: return 'Sign in to start creating amazing content';
      case 1: return 'Let\'s complete your profile';
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
                onClick={handleBackToHome}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </header>

        {/* Progress Bar - Only show after auth */}
        {currentStep > 0 && (
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
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bebas text-white mb-4">
              {getStepTitle(currentStep)}
            </h1>
            <p className="text-xl text-gray-300">
              {getStepDescription(currentStep)}
            </p>
          </div>

          <div className="bg-medium-gray rounded-2xl p-8 border border-gray-700">
            {/* Step 0: Authentication */}
            {currentStep === 0 && (
              <div className="space-y-8">
                {/* Google Sign In - Primary CTA */}
                <div className="text-center">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={authState.isLoading}
                    className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:shadow-xl hover:shadow-white/10 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {authState.isLoading && authState.mode === 'signin' ? (
                      <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    <span>Continue with Google</span>
                  </button>
                  <p className="text-gray-400 text-sm mt-3">
                    Quick and secure sign in with your Google account
                  </p>
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-medium-gray text-gray-400">or</span>
                  </div>
                </div>

                {/* Email/Password Toggle */}
                <div className="text-center">
                  <button
                    onClick={() => setShowAuthForm(!showAuthForm)}
                    className="text-electric-blue hover:text-magenta transition-colors font-medium"
                  >
                    {showAuthForm ? 'Hide email sign in' : 'Sign in with email instead'}
                  </button>
                </div>

                {/* Email/Password Form */}
                {showAuthForm && (
                  <div className="space-y-6 pt-4 border-t border-gray-600">
                    {/* Auth Mode Toggle */}
                    <div className="flex bg-charcoal rounded-lg p-1">
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

                    {/* Name Field (Sign Up Only) */}
                    {authState.mode === 'signup' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className={`w-full pl-10 pr-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                              errors.name ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                            }`}
                            placeholder="Enter your full name"
                          />
                        </div>
                        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                      </div>
                    )}

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          className={`w-full pl-10 pr-4 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                            errors.email ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                          }`}
                          placeholder="Enter your email address"
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                          className={`w-full pl-10 pr-12 py-3 bg-charcoal border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-electric-blue transition-colors ${
                            errors.password ? 'border-red-500' : 'border-gray-600 focus:border-electric-blue'
                          }`}
                          placeholder={authState.mode === 'signup' ? 'Create a password (min 6 characters)' : 'Enter your password'}
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

                    {/* Error Message */}
                    {authState.error && (
                      <div className="flex items-center space-x-2 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{authState.error}</p>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleEmailAuth}
                      disabled={authState.isLoading}
                      className="w-full bg-gradient-to-r from-electric-blue to-magenta text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {authState.isLoading && authState.mode !== 'signin' ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : null}
                      <span>
                        {authState.mode === 'signup' ? 'Create Account' : 'Sign In'}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}

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

            {/* Navigation Buttons - Only show after auth */}
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
                  className="flex items-center space-x-2 bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
                >
                  <span>
                    {currentStep === 3 ? 'Complete Setup' : 'Continue'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Progress Text - Only show after auth */}
            {currentStep > 0 && (
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Step {currentStep} of 3 • Takes less than 2 minutes
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;