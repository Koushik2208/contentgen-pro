import React, { useState } from 'react';
import { Menu, X, Zap } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-charcoal/95 backdrop-blur-sm border-b border-medium-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-electric-blue to-magenta p-2 rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bebas text-white">
              ContentGen Pro
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#benefits" className="text-gray-300 hover:text-electric-blue transition-colors">
              Benefits
            </a>
            <a href="#how-it-works" className="text-gray-300 hover:text-electric-blue transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-electric-blue transition-colors">
              Reviews
            </a>
            <a href="#faq" className="text-gray-300 hover:text-electric-blue transition-colors">
              FAQ
            </a>
            <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300">
              Get Started
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-medium-gray">
            <nav className="flex flex-col space-y-4">
              <a href="#benefits" className="text-gray-300 hover:text-electric-blue transition-colors">
                Benefits
              </a>
              <a href="#how-it-works" className="text-gray-300 hover:text-electric-blue transition-colors">
                How It Works
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-electric-blue transition-colors">
                Reviews
              </a>
              <a href="#faq" className="text-gray-300 hover:text-electric-blue transition-colors">
                FAQ
              </a>
              <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-2 rounded-full font-semibold w-full">
                Get Started
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;