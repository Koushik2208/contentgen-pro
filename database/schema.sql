-- =====================================================
-- ContentGen Pro Database Schema
-- =====================================================
-- This file contains all the SQL scripts needed to set up
-- the database for the ContentGen Pro application

-- =====================================================
-- 1. USER PROFILES TABLE
-- =====================================================
-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  industry TEXT,
  target_audience TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. USER PREFERENCES TABLE
-- =====================================================
-- User preferences and onboarding data
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  profession TEXT,
  custom_profession TEXT,
  content_goals TEXT[] DEFAULT '{}',
  preferred_tone TEXT CHECK (preferred_tone IN ('Professional', 'Casual', 'Educational', 'Storytelling')),
  content_pillars TEXT[] DEFAULT '{}',
  email_notifications JSONB DEFAULT '{
    "content_ready": true,
    "weekly_digest": true,
    "product_updates": true,
    "tips": true
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- 3. CONTENT TABLE
-- =====================================================
-- Content generated for users
CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('post', 'carousel', 'thread')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tone TEXT NOT NULL CHECK (tone IN ('Professional', 'Casual', 'Educational', 'Storytelling')),
  pillar TEXT NOT NULL CHECK (pillar IN ('Thought Leadership', 'Tips & Advice', 'Personal Story', 'Business Growth', 'Behind the Scenes')),
  platforms TEXT[] DEFAULT '{}',
  is_favorited BOOLEAN DEFAULT FALSE,
  engagement_likes INTEGER DEFAULT 0,
  engagement_comments INTEGER DEFAULT 0,
  engagement_shares INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Create policies for content
CREATE POLICY "Users can view own content" ON content
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own content" ON content
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own content" ON content
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own content" ON content
  FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- 4. CAROUSEL SLIDES TABLE
-- =====================================================
-- Carousel slides for carousel content
CREATE TABLE IF NOT EXISTS carousel_slides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  slide_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  background_color TEXT DEFAULT 'from-electric-blue to-magenta',
  text_color TEXT DEFAULT 'text-white',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

-- Create policies for carousel_slides
CREATE POLICY "Users can view slides for own content" ON carousel_slides
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM content 
      WHERE content.id = carousel_slides.content_id 
      AND content.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage slides for own content" ON carousel_slides
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM content 
      WHERE content.id = carousel_slides.content_id 
      AND content.user_id = auth.uid()
    )
  );

-- =====================================================
-- 5. CONTENT ANALYTICS TABLE
-- =====================================================
-- Track content performance and analytics
CREATE TABLE IF NOT EXISTS content_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES content(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0.00,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for content_analytics
CREATE POLICY "Users can view analytics for own content" ON content_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM content 
      WHERE content.id = content_analytics.content_id 
      AND content.user_id = auth.uid()
    )
  );

-- =====================================================
-- 6. CONTENT TEMPLATES TABLE
-- =====================================================
-- Pre-defined content templates
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('post', 'carousel', 'thread')),
  tone TEXT NOT NULL CHECK (tone IN ('Professional', 'Casual', 'Educational', 'Storytelling')),
  pillar TEXT NOT NULL CHECK (pillar IN ('Thought Leadership', 'Tips & Advice', 'Personal Story', 'Business Growth', 'Behind the Scenes')),
  template_content TEXT NOT NULL,
  platforms TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;

-- Create policies for content_templates (templates are public)
CREATE POLICY "Anyone can view active templates" ON content_templates
  FOR SELECT USING (is_active = TRUE);

-- =====================================================
-- 7. USER SESSIONS TABLE
-- =====================================================
-- Track user sessions and activity
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- 8. HELPER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to calculate total engagement
CREATE OR REPLACE FUNCTION calculate_total_engagement(content_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COALESCE(engagement_likes, 0) + 
               COALESCE(engagement_comments, 0) + 
               COALESCE(engagement_shares, 0)
        FROM content 
        WHERE id = content_id
    );
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. TRIGGERS
-- =====================================================

-- Apply update triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at 
    BEFORE UPDATE ON content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 10. USEFUL VIEWS
-- =====================================================

-- View for user dashboard content summary
CREATE OR REPLACE VIEW user_content_summary AS
SELECT 
    c.user_id,
    COUNT(*) as total_content,
    COUNT(CASE WHEN c.is_favorited = TRUE THEN 1 END) as favorited_content,
    SUM(COALESCE(c.engagement_likes, 0) + COALESCE(c.engagement_comments, 0) + COALESCE(c.engagement_shares, 0)) as total_engagement,
    COUNT(CASE WHEN c.type = 'post' THEN 1 END) as posts_count,
    COUNT(CASE WHEN c.type = 'carousel' THEN 1 END) as carousels_count,
    COUNT(CASE WHEN c.type = 'thread' THEN 1 END) as threads_count
FROM content c
GROUP BY c.user_id;

-- View for content performance analytics
CREATE OR REPLACE VIEW content_performance AS
SELECT 
    c.id,
    c.user_id,
    c.title,
    c.type,
    c.tone,
    c.pillar,
    c.is_favorited,
    c.engagement_likes,
    c.engagement_comments,
    c.engagement_shares,
    (c.engagement_likes + c.engagement_comments + c.engagement_shares) as total_engagement,
    c.created_at,
    p.name as user_name
FROM content c
JOIN profiles p ON c.user_id = p.id;

-- =====================================================
-- 11. INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_content_user_id ON content(user_id);
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(created_at);
CREATE INDEX IF NOT EXISTS idx_content_is_favorited ON content(is_favorited);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_content_id ON carousel_slides(content_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_id ON content_analytics(content_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_platform ON content_analytics(platform);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- =====================================================
-- 12. SAMPLE DATA
-- =====================================================

-- Insert sample content templates
INSERT INTO content_templates (name, description, type, tone, pillar, template_content, platforms) VALUES
('Professional Tip', 'Share industry insights professionally', 'post', 'Professional', 'Tips & Advice', 'Here''s a key insight I''ve learned: [INSERT TIP]. This approach has helped me [INSERT BENEFIT]. What strategies work best for you?', ARRAY['LinkedIn', 'Twitter']),
('Personal Story', 'Share a personal experience', 'post', 'Storytelling', 'Personal Story', 'I remember when [INSERT STORY]. This taught me [INSERT LESSON]. Have you had a similar experience?', ARRAY['LinkedIn', 'Instagram']),
('Educational Thread', 'Share knowledge in a thread format', 'thread', 'Educational', 'Thought Leadership', '🧵 Thread: [TOPIC]

1/ [POINT 1]
2/ [POINT 2]
3/ [POINT 3]

What would you add?', ARRAY['Twitter']),
('Business Growth Carousel', 'Share business insights in carousel format', 'carousel', 'Professional', 'Business Growth', 'Slide 1: [TITLE]
Slide 2: [POINT 1]
Slide 3: [POINT 2]
Slide 4: [POINT 3]
Slide 5: [CALL TO ACTION]', ARRAY['LinkedIn', 'Instagram']),
('Behind the Scenes', 'Share personal work insights', 'post', 'Casual', 'Behind the Scenes', 'Behind the scenes: [INSERT INSIGHT]. This is what really happens when [INSERT SITUATION]. Anyone else relate?', ARRAY['LinkedIn', 'Instagram']),
('Thought Leadership', 'Share industry expertise', 'post', 'Professional', 'Thought Leadership', 'The future of [INDUSTRY] is [PREDICTION]. Here''s why I believe [REASONING]. What are your thoughts on this trend?', ARRAY['LinkedIn', 'Twitter']);

-- =====================================================
-- 13. USEFUL QUERIES
-- =====================================================

-- Example: Get user's content with engagement metrics
-- SELECT 
--     c.*,
--     calculate_total_engagement(c.id) as total_engagement
-- FROM content c 
-- WHERE c.user_id = auth.uid() 
-- ORDER BY c.created_at DESC;

-- Example: Get user's favorited content
-- SELECT * FROM content 
-- WHERE user_id = auth.uid() 
-- AND is_favorited = TRUE 
-- ORDER BY created_at DESC;

-- Example: Get content performance summary
-- SELECT * FROM user_content_summary 
-- WHERE user_id = auth.uid();

-- Example: Get content by type and tone
-- SELECT * FROM content 
-- WHERE user_id = auth.uid() 
-- AND type = 'post' 
-- AND tone = 'Professional'
-- ORDER BY created_at DESC;

-- =====================================================
-- END OF SCHEMA
-- =====================================================
