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
  Users,
  Eye,
  MoreHorizontal,
  Sparkles,
  Target,
  MessageCircle
} from 'lucide-react';
import { CONTENT_PILLARS, TONE_FILTERS, ANIMATION_DELAYS } from '../constants';
import '../styles/components.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { content, loading: contentLoading, error: contentError, toggleFavorite } = useContent();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPillar, setSelectedPillar] = useState('All Pillars');
  const [selectedTone, setSelectedTone] = useState('All Tones');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Redirect to onboarding if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/onboarding');
    }
  }, [user, authLoading, navigate]);

  // Show loading while checking authentication or loading content
  if (authLoading || contentLoading) {
    return (
      <div className="min-h-screen bg-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your content...</p>
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
    const matchesPillar = selectedPillar === CONTENT_PILLARS[0] || item.pillar === selectedPillar;
    const matchesTone = selectedTone === TONE_FILTERS[0] || item.tone === selectedTone;
    
    return matchesSearch && matchesPillar && matchesTone;
  });

  const handleCopyContent = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleFavorite = async (id: string, currentFavorite: boolean) => {
    await toggleFavorite(id, !currentFavorite);
  };

  const handleCarouselPreview = (carouselId: string) => {
    navigate(`/carousel/${carouselId}`);
  };

  const handleProfileSettings = () => {
    navigate('/profile');
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'carousel': return '🎠';
      case 'thread': return '🧵';
      default: return '📝';
    }
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'carousel': return 'Carousel';
      case 'thread': return 'Thread';
      default: return 'Post';
    }
  };

  const totalEngagement = content.reduce((sum, item) => 
    sum + item.engagement.likes + item.engagement.comments + item.engagement.shares, 0
  );

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
                  onClick={handleProfileSettings}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Users className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={handleBackToLanding}
                  className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Home</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-bebas text-white mb-4">
              Welcome Back, {user?.email?.split('@')[0] || 'User'}! 👋
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Your AI-generated content is ready. Choose what resonates with your brand and start building your authority.
            </p>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-medium-gray rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-electric-blue/20 p-2 rounded-lg">
                    <Sparkles className="w-5 h-5 text-electric-blue" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{content.length}</div>
                    <div className="text-sm text-gray-400">Content Ideas</div>
                  </div>
                </div>
              </div>
              <div className="bg-medium-gray rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-magenta/20 p-2 rounded-lg">
                    <Heart className="w-5 h-5 text-magenta" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">
                      {content.filter(item => item.isFavorited).length}
                    </div>
                    <div className="text-sm text-gray-400">Favorites</div>
                  </div>
                </div>
              </div>
              <div className="bg-medium-gray rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-yellow-400/20 p-2 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{totalEngagement}</div>
                    <div className="text-sm text-gray-400">Total Engagement</div>
                  </div>
                </div>
              </div>
              <div className="bg-medium-gray rounded-xl p-6 border border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-400/20 p-2 rounded-lg">
                    <Target className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">92%</div>
                    <div className="text-sm text-gray-400">Match Score</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: `${ANIMATION_DELAYS.FAST}ms` }}>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search content ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-base pl-10 pr-4"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4">
                <select
                  value={selectedPillar}
                  onChange={(e) => setSelectedPillar(e.target.value)}
                  className="select-base"
                >
                  {CONTENT_PILLARS.map(pillar => (
                    <option key={pillar} value={pillar}>{pillar}</option>
                  ))}
                </select>

                <select
                  value={selectedTone}
                  onChange={(e) => setSelectedTone(e.target.value)}
                  className="select-base"
                >
                  {TONE_FILTERS.map(tone => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>

                <button className="btn-primary-sm flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Generate More</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: `${ANIMATION_DELAYS.MEDIUM}ms` }}>
            {filteredContent.map((item, index) => (
              <div 
                key={item.id}
                className="bg-medium-gray rounded-2xl p-6 border border-gray-700 hover:border-electric-blue/50 transition-all duration-300 hover:shadow-xl hover:shadow-electric-blue/10 group"
                style={{ animationDelay: `${ANIMATION_DELAYS.SLOW + index * ANIMATION_DELAYS.STAGGER}ms` }}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getContentTypeIcon(item.type)}</span>
                    <div>
                      <div className="text-sm text-gray-400">{getContentTypeLabel(item.type)}</div>
                      <div className="text-xs text-gray-500">{item.pillar}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleFavorite(item.id, item.isFavorited)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.isFavorited 
                          ? 'bg-magenta/20 text-magenta' 
                          : 'bg-charcoal text-gray-400 hover:text-magenta'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${item.isFavorited ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-lg bg-charcoal text-gray-400 hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Title */}
                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-electric-blue transition-colors">
                  {item.title}
                </h3>

                {/* Content Preview */}
                <div className="bg-charcoal rounded-lg p-4 mb-4">
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                    {item.content.substring(0, 150)}...
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{item.engagement.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{item.engagement.comments}</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Platform Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.platform.map(platform => (
                    <span 
                      key={platform}
                      className="px-2 py-1 bg-electric-blue/20 text-electric-blue text-xs rounded-full"
                    >
                      {platform}
                    </span>
                  ))}
                  <span className="px-2 py-1 bg-gray-600 text-gray-300 text-xs rounded-full">
                    {item.tone}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyContent(item.id, item.content)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 ${
                      copiedId === item.id
                        ? 'bg-green-500 text-white'
                        : 'bg-charcoal text-gray-300 hover:bg-electric-blue hover:text-white'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copiedId === item.id ? 'Copied!' : 'Copy'}</span>
                  </button>
                  
                  {item.type === 'carousel' && (
                    <button 
                      onClick={() => handleCarouselPreview(item.id)}
                      className="flex items-center justify-center space-x-2 py-2 px-3 bg-magenta hover:bg-magenta/80 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredContent.length === 0 && (
            <div className="text-center py-16 animate-fade-in-up">
              <div className="bg-medium-gray rounded-2xl p-12 border border-gray-700 max-w-md mx-auto">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No content found</h3>
                <p className="text-gray-400 mb-6">
                  {content.length === 0 
                    ? "You haven't created any content yet. Generate your first content idea to get started!"
                    : "Try adjusting your search terms or filters to find more content ideas."
                  }
                </p>
                <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300">
                  {content.length === 0 ? 'Generate Your First Content' : 'Generate New Content'}
                </button>
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="mt-12 text-center animate-fade-in-up" style={{ animationDelay: `${ANIMATION_DELAYS.VERY_SLOW}ms` }}>
            <div className="bg-gradient-to-r from-dark-gray to-medium-gray rounded-2xl p-8 border border-gray-700">
              <h3 className="text-2xl font-bebas text-white mb-4">
                Ready for More Content Ideas?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Generate fresh content ideas tailored to your brand and audience. 
                Our AI learns from your preferences to create even better suggestions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-electric-blue to-magenta text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-electric-blue/25 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Generate More Ideas</span>
                </button>
                <button className="border border-gray-600 text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-electric-blue hover:text-electric-blue transition-colors flex items-center justify-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download All Content</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;