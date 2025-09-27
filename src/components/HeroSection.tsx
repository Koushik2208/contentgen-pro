import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Users, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-charcoal via-dark-gray to-charcoal">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-electric-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-magenta/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Social Proof Pills */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-2 bg-medium-gray/50 px-4 py-2 rounded-full">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-300">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2 bg-medium-gray/50 px-4 py-2 rounded-full">
                <Users className="w-4 h-4 text-electric-blue" />
                <span className="text-sm text-gray-300">10K+ Users</span>
              </div>
              <div className="flex items-center space-x-2 bg-medium-gray/50 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4 text-magenta" />
                <span className="text-sm text-gray-300">500% ROI</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bebas leading-tight">
              <span className="text-white">Transform Your</span>
              <br />
              <span className="bg-gradient-to-r from-electric-blue to-magenta bg-clip-text text-transparent">
                Personal Brand
              </span>
              <br />
              <span className="text-white">In Minutes</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
              Generate high-converting social media content and captions that build authority, 
              attract your ideal audience, and grow your professional network. Save 10+ hours 
              weekly with AI-powered content creation.
            </p>

            {/* Key Benefits */}
            <div className="grid sm:grid-cols-3 gap-4 py-6">
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-electric-blue mb-1">10+</div>
                <div className="text-sm text-gray-400">Hours Saved Weekly</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-magenta mb-1">500+</div>
                <div className="text-sm text-gray-400">Content Templates</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-3xl font-bold text-yellow-400 mb-1">3x</div>
                <div className="text-sm text-gray-400">Engagement Growth</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-electric-blue to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300 animate-pulse-glow"
              >
                Start Creating Content
              </button>
              <button className="flex items-center justify-center space-x-2 border border-gray-600 text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-electric-blue hover:text-electric-blue transition-colors">
                <Play className="w-5 h-5" />
                <span>Watch Demo (2 min)</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 pt-6 text-sm text-gray-400">
              <span>✓ No Credit Card Required</span>
              <span>✓ 7-Day Free Trial</span>
              <span>✓ Cancel Anytime</span>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative animate-fade-in">
            <div className="relative bg-gradient-to-br from-dark-gray to-medium-gray rounded-2xl p-8 shadow-2xl border border-gray-700">
              {/* Mock Dashboard Screenshot */}
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-electric-blue to-magenta rounded-lg"></div>
                    <span className="font-semibold">Content Dashboard</span>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                {/* Content Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-charcoal rounded-lg p-4 border border-gray-600">
                    <div className="w-full h-24 bg-gradient-to-br from-electric-blue/20 to-transparent rounded mb-3"></div>
                    <div className="h-3 bg-gray-600 rounded mb-2"></div>
                    <div className="h-2 bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div className="bg-charcoal rounded-lg p-4 border border-gray-600">
                    <div className="w-full h-24 bg-gradient-to-br from-magenta/20 to-transparent rounded mb-3"></div>
                    <div className="h-3 bg-gray-600 rounded mb-2"></div>
                    <div className="h-2 bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-600">
                  <span className="text-sm text-gray-400">Generated Today</span>
                  <span className="text-electric-blue font-semibold">24 Posts</span>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-electric-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                AI Powered
              </div>
              <div className="absolute -bottom-4 -left-4 bg-magenta text-white px-3 py-1 rounded-full text-sm font-semibold">
                Real-time
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;