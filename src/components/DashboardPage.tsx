import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useContent } from '../hooks/useContent';
import { 
  Zap, 
  Copy, 
  Download, 
  Heart, 
  Search, 
  Plus, 
  ArrowLeft,
  Calendar,
  TrendingUp,
  Eye,
  MoreHorizontal,
  Sparkles,
  Target
} from 'lucide-react';
import { CONTENT_PILLARS, TONE_FILTERS } from '../constants';
import '../styles/components.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { content, loading: contentLoading, error: contentError, toggleFavorite } = useContent();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('All');
  const [selectedTone, setSelectedTone] = useState('All');

  // Simple onboarding check - if user doesn't have preferences, redirect to onboarding
  useEffect(() => {
    if (user && !authLoading && !contentLoading && content.length === 0) {
      // Check if user has any content or preferences
      // If not, they might need to complete onboarding
      const hasContent = content && content.length > 0;
      if (!hasContent) {
        // For now, let's assume if they reach dashboard, they're onboarded
        // This prevents the infinite loop issue
        console.log('User is on dashboard - onboarding assumed complete');
      }
    }
  }, [user, authLoading, contentLoading, content]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if content loading failed
  if (contentError) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 mb-4">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Database Connection Error</h2>
            <p className="text-gray-300 mb-4">{contentError}</p>
            <div className="text-left text-sm text-gray-400">
              <p className="mb-2">To fix this issue:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Go to your Supabase Dashboard</li>
                <li>Run the SQL schema from database/schema.sql</li>
                <li>Check your environment variables</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-electric-blue text-white px-4 py-2 rounded-lg hover:bg-electric-blue/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPillar = selectedPillar === 'All' || item.pillar === selectedPillar;
    const matchesTone = selectedTone === 'All' || item.tone === selectedTone;
    return matchesSearch && matchesPillar && matchesTone;
  });

  const handleBackToLanding = () => {
    navigate('/');
  };

  const handleCreateContent = () => {
    // For now, just show a message
    alert('Content creation feature coming soon!');
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const handleDownloadContent = (title: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-electric-blue to-magenta p-2 rounded-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bebas text-white">
                  ContentGen Pro
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToLanding}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
                <button
                  onClick={() => navigate('/profile')}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Profile
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-bebas text-white mb-4">
              Your Content Dashboard
            </h1>
            <p className="text-xl text-gray-300">
              Generate, manage, and optimize your content strategy
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-medium-gray rounded-2xl p-6 border border-gray-700">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search content ideas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-medium-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors pl-10 pr-4"
                  />
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-4">
                  <select
                    value={selectedPillar}
                    onChange={(e) => setSelectedPillar(e.target.value)}
                    className="px-4 py-3 bg-medium-gray border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors"
                  >
                    {CONTENT_PILLARS.map(pillar => (
                      <option key={pillar} value={pillar}>{pillar}</option>
                    ))}
                  </select>

                  <select
                    value={selectedTone}
                    onChange={(e) => setSelectedTone(e.target.value)}
                    className="px-4 py-3 bg-medium-gray border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-electric-blue focus:border-electric-blue transition-colors"
                  >
                    {TONE_FILTERS.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={handleCreateContent}
                className="bg-gradient-to-r from-electric-blue to-magenta p-6 rounded-2xl border border-gray-700 hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Create New Content</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Generate fresh content ideas tailored to your goals
                </p>
              </button>

              <div className="bg-medium-gray p-6 rounded-2xl border border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-electric-blue/20 p-2 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-electric-blue" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Analytics</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Track your content performance and engagement
                </p>
              </div>

              <div className="bg-medium-gray p-6 rounded-2xl border border-gray-700">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="bg-magenta/20 p-2 rounded-lg">
                    <Target className="w-6 h-6 text-magenta" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Strategy</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Optimize your content strategy with AI insights
                </p>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bebas text-white">
                Your Content ({filteredContent.length})
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {contentLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
                <p className="text-gray-400">Loading your content...</p>
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-medium-gray rounded-2xl p-12 border border-gray-700">
                  <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No content yet</h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm || selectedPillar !== 'All' || selectedTone !== 'All'
                      ? 'No content matches your current filters'
                      : 'Start creating amazing content to see it here'
                    }
                  </p>
                  <button
                    onClick={handleCreateContent}
                    className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300"
                  >
                    Create Your First Content
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item, index) => (
                  <div
                    key={item.id}
                    className="bg-medium-gray rounded-2xl p-6 border border-gray-700 hover:border-electric-blue/50 transition-all duration-300 group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-electric-blue transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="bg-charcoal px-2 py-1 rounded-full">
                            {item.pillar}
                          </span>
                          <span className="bg-charcoal px-2 py-1 rounded-full">
                            {item.tone}
                          </span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {item.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => toggleFavorite(item.id, !item.isFavorited)}
                          className={`flex items-center space-x-1 transition-colors ${
                            item.isFavorited
                              ? 'text-red-400 hover:text-red-300'
                              : 'text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${item.isFavorited ? 'fill-current' : ''}`} />
                          <span className="text-xs">{item.isFavorited ? 'Saved' : 'Save'}</span>
                        </button>
                        <button
                          onClick={() => handleCopyContent(item.content)}
                          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          <span className="text-xs">Copy</span>
                        </button>
                        <button
                          onClick={() => handleDownloadContent(item.title, item.content)}
                          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span className="text-xs">Download</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        <span>{item.engagement.likes || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;