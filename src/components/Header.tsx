import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X, Zap, User, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/onboarding");
    }
  };

  const handleSignIn = () => {
    navigate("/onboarding");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

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
            <a
              href="#benefits"
              className="text-gray-300 hover:text-electric-blue transition-colors"
            >
              Benefits
            </a>
            <a
              href="#how-it-works"
              className="text-gray-300 hover:text-electric-blue transition-colors"
            >
              How It Works
            </a>
            <a
              href="#testimonials"
              className="text-gray-300 hover:text-electric-blue transition-colors"
            >
              Reviews
            </a>
            <a
              href="#faq"
              className="text-gray-300 hover:text-electric-blue transition-colors"
            >
              FAQ
            </a>

            {user ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDashboard}
                  className="flex items-center space-x-2 text-gray-300 hover:text-electric-blue transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
              >
                Get Started
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-medium-gray">
            <nav className="flex flex-col space-y-4">
              <a
                href="#benefits"
                className="text-gray-300 hover:text-electric-blue transition-colors"
              >
                Benefits
              </a>
              <a
                href="#how-it-works"
                className="text-gray-300 hover:text-electric-blue transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-300 hover:text-electric-blue transition-colors"
              >
                Reviews
              </a>
              <a
                href="#faq"
                className="text-gray-300 hover:text-electric-blue transition-colors"
              >
                FAQ
              </a>

              {user ? (
                <>
                  <button
                    onClick={handleDashboard}
                    className="flex items-center space-x-2 text-gray-300 hover:text-electric-blue transition-colors"
                  >
                    <User className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSignIn}
                    className="text-gray-300 hover:text-electric-blue transition-colors text-left"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300 w-full"
                  >
                    Get Started
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
