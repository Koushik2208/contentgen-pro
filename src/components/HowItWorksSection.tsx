import React, { useState } from 'react';
import { User, Sparkles, Download, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: "01",
    icon: User,
    title: "Personalize Your Profile",
    description: "Tell us about your industry, target audience, and content goals. Our AI learns your unique voice and brand positioning.",
    details: "Set up takes less than 2 minutes. Choose from 50+ industries and define your ideal client persona."
  },
  {
    number: "02", 
    icon: Sparkles,
    title: "AI Generates Content",
    description: "Watch as our advanced AI creates engaging posts, captions, and carousels tailored to your brand and audience preferences.",
    details: "Get 10+ content variations per request. Each post is optimized for maximum engagement on your chosen platform."
  },
  {
    number: "03",
    icon: Download,
    title: "Download & Publish",
    description: "Copy your captions, download carousel images, and publish across all your social media platforms with one click.",
    details: "Export in multiple formats. Schedule directly to LinkedIn, Instagram, Twitter, and more with our integrations."
  }
];

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="how-it-works" className="py-20 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bebas text-white mb-6">
            From Blank Page to
            <span className="bg-gradient-to-r from-electric-blue to-magenta bg-clip-text text-transparent">
              {' '}Viral Content
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our simple 3-step process gets you from idea to published content in under 5 minutes. 
            No design skills or writing experience required.
          </p>
        </div>

        {/* Steps Navigation */}
        <div className="flex justify-center mb-12">
          <div className="flex space-x-4 bg-medium-gray rounded-full p-2">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setActiveStep(index)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeStep === index
                    ? 'bg-gradient-to-r from-electric-blue to-magenta text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Step {step.number}
              </button>
            ))}
          </div>
        </div>

        {/* Active Step Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-6 animate-fade-in-up">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-electric-blue to-magenta p-4 rounded-2xl">
                {React.createElement(steps[activeStep].icon, { className: "w-8 h-8 text-white" })}
              </div>
              <div className="text-6xl font-bebas text-gray-700">
                {steps[activeStep].number}
              </div>
            </div>
            
            <h3 className="text-3xl font-bebas text-white">
              {steps[activeStep].title}
            </h3>
            
            <p className="text-xl text-gray-300 leading-relaxed">
              {steps[activeStep].description}
            </p>
            
            <p className="text-gray-400 leading-relaxed">
              {steps[activeStep].details}
            </p>

            <div className="flex items-center space-x-4 pt-4">
              {activeStep < steps.length - 1 && (
                <button
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="flex items-center space-x-2 text-electric-blue hover:text-magenta transition-colors"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
              {activeStep === steps.length - 1 && (
                <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300">
                  Get Started Now
                </button>
              )}
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative animate-fade-in">
            <div className="bg-gradient-to-br from-dark-gray to-medium-gray rounded-2xl p-8 shadow-2xl border border-gray-700">
              {/* Mock Interface based on active step */}
              {activeStep === 0 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Profile Setup</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Industry</label>
                      <div className="bg-charcoal rounded-lg p-3 border border-gray-600">
                        <span className="text-electric-blue">Marketing & Sales</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Target Audience</label>
                      <div className="bg-charcoal rounded-lg p-3 border border-gray-600">
                        <span className="text-white">B2B Decision Makers</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Content Goals</label>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-electric-blue/20 text-electric-blue px-3 py-1 rounded-full text-sm">Lead Generation</span>
                        <span className="bg-magenta/20 text-magenta px-3 py-1 rounded-full text-sm">Thought Leadership</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeStep === 1 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-white mb-4">AI Content Generation</h4>
                  <div className="space-y-4">
                    <div className="bg-charcoal rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400">Generated Post #1</span>
                        <span className="text-xs bg-electric-blue/20 text-electric-blue px-2 py-1 rounded">High Engagement</span>
                      </div>
                      <p className="text-white text-sm leading-relaxed">
                        "The biggest mistake B2B marketers make? Focusing on features instead of outcomes. 
                        Here's how to shift your messaging..."
                      </p>
                    </div>
                    <div className="bg-charcoal rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-400">Generated Post #2</span>
                        <span className="text-xs bg-magenta/20 text-magenta px-2 py-1 rounded">Trending Topic</span>
                      </div>
                      <p className="text-white text-sm leading-relaxed">
                        "Just analyzed 1,000+ LinkedIn posts. The ones with the highest engagement all had this in common..."
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {activeStep === 2 && (
                <div className="space-y-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Export & Publish</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-charcoal rounded-lg border border-gray-600">
                      <span className="text-white">LinkedIn Post</span>
                      <button className="bg-electric-blue text-white px-4 py-2 rounded-lg text-sm">Copy Caption</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-charcoal rounded-lg border border-gray-600">
                      <span className="text-white">Instagram Carousel</span>
                      <button className="bg-magenta text-white px-4 py-2 rounded-lg text-sm">Download Images</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-charcoal rounded-lg border border-gray-600">
                      <span className="text-white">Twitter Thread</span>
                      <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-4 py-2 rounded-lg text-sm">Schedule Post</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Process Timeline */}
        <div className="mt-16 animate-fade-in-up">
          <div className="flex justify-center items-center space-x-8 overflow-x-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  activeStep === index 
                    ? 'bg-gradient-to-r from-electric-blue to-magenta text-white' 
                    : 'bg-medium-gray text-gray-400'
                }`}>
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    activeStep > index ? 'bg-gradient-to-r from-electric-blue to-magenta' : 'bg-gray-600'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;