import { supabase } from './supabase'
import { ContentCard, ContentType, ContentTone, ContentPillar, SocialPlatform } from '../types'

// Database service for content operations
export class DatabaseService {
  // =====================================================
  // CONTENT OPERATIONS
  // =====================================================

  // Get all content for a user
  static async getUserContent(userId: string): Promise<ContentCard[]> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(this.transformContentData) || []
    } catch (error) {
      console.error('Error fetching user content:', error)
      return []
    }
  }

  // Get content by ID
  static async getContentById(contentId: string): Promise<ContentCard | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', contentId)
        .single()

      if (error) throw error

      return data ? this.transformContentData(data) : null
    } catch (error) {
      console.error('Error fetching content:', error)
      return null
    }
  }

  // Create new content
  static async createContent(contentData: {
    type: ContentType
    title: string
    content: string
    tone: ContentTone
    pillar: ContentPillar
    platforms: SocialPlatform[]
    userId: string
  }): Promise<ContentCard | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .insert({
          user_id: contentData.userId,
          type: contentData.type,
          title: contentData.title,
          content: contentData.content,
          tone: contentData.tone,
          pillar: contentData.pillar,
          platforms: contentData.platforms
        })
        .select()
        .single()

      if (error) throw error

      return data ? this.transformContentData(data) : null
    } catch (error) {
      console.error('Error creating content:', error)
      return null
    }
  }

  // Update content
  static async updateContent(contentId: string, updates: Partial<ContentCard>): Promise<ContentCard | null> {
    try {
      const { data, error } = await supabase
        .from('content')
        .update({
          title: updates.title,
          content: updates.content,
          tone: updates.tone,
          pillar: updates.pillar,
          platforms: updates.platform,
          is_favorited: updates.isFavorited,
          engagement_likes: updates.engagement?.likes,
          engagement_comments: updates.engagement?.comments,
          engagement_shares: updates.engagement?.shares
        })
        .eq('id', contentId)
        .select()
        .single()

      if (error) throw error

      return data ? this.transformContentData(data) : null
    } catch (error) {
      console.error('Error updating content:', error)
      return null
    }
  }

  // Toggle favorite status
  static async toggleFavorite(contentId: string, isFavorited: boolean): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content')
        .update({ is_favorited: isFavorited })
        .eq('id', contentId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error toggling favorite:', error)
      return false
    }
  }

  // Delete content
  static async deleteContent(contentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting content:', error)
      return false
    }
  }

  // =====================================================
  // USER PROFILE OPERATIONS
  // =====================================================

  // Get user profile
  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Create or update user profile
  static async upsertUserProfile(profileData: {
    id: string
    name: string
    email: string
    industry?: string
    target_audience?: string
    avatar_url?: string
  }) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error upserting user profile:', error)
      return null
    }
  }

  // =====================================================
  // USER PREFERENCES OPERATIONS
  // =====================================================

  // Get user preferences
  static async getUserPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user preferences:', error)
      return null
    }
  }

  // Create or update user preferences
  static async upsertUserPreferences(preferencesData: {
    user_id: string
    profession?: string
    custom_profession?: string
    content_goals?: string[]
    preferred_tone?: string
    content_pillars?: string[]
    email_notifications?: any
  }) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert(preferencesData)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error upserting user preferences:', error)
      return null
    }
  }

  // =====================================================
  // CAROUSEL SLIDES OPERATIONS
  // =====================================================

  // Get carousel slides
  static async getCarouselSlides(contentId: string) {
    try {
      const { data, error } = await supabase
        .from('carousel_slides')
        .select('*')
        .eq('content_id', contentId)
        .order('slide_number', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching carousel slides:', error)
      return []
    }
  }

  // Create carousel slides
  static async createCarouselSlides(contentId: string, slides: Array<{
    slide_number: number
    title: string
    content: string
    background_color?: string
    text_color?: string
  }>) {
    try {
      const slidesData = slides.map(slide => ({
        content_id: contentId,
        ...slide
      }))

      const { data, error } = await supabase
        .from('carousel_slides')
        .insert(slidesData)
        .select()

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error creating carousel slides:', error)
      return []
    }
  }

  // =====================================================
  // CONTENT TEMPLATES OPERATIONS
  // =====================================================

  // Get content templates
  static async getContentTemplates(filters?: {
    type?: ContentType
    tone?: ContentTone
    pillar?: ContentPillar
  }) {
    try {
      let query = supabase
        .from('content_templates')
        .select('*')
        .eq('is_active', true)

      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.tone) {
        query = query.eq('tone', filters.tone)
      }
      if (filters?.pillar) {
        query = query.eq('pillar', filters.pillar)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching content templates:', error)
      return []
    }
  }

  // =====================================================
  // ANALYTICS OPERATIONS
  // =====================================================

  // Get content analytics
  static async getContentAnalytics(contentId: string) {
    try {
      const { data, error } = await supabase
        .from('content_analytics')
        .select('*')
        .eq('content_id', contentId)
        .order('recorded_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching content analytics:', error)
      return []
    }
  }

  // Update content analytics
  static async updateContentAnalytics(contentId: string, analyticsData: {
    platform: string
    views?: number
    likes?: number
    comments?: number
    shares?: number
    clicks?: number
    engagement_rate?: number
  }) {
    try {
      const { data, error } = await supabase
        .from('content_analytics')
        .insert({
          content_id: contentId,
          ...analyticsData
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating content analytics:', error)
      return null
    }
  }

  // =====================================================
  // UTILITY FUNCTIONS
  // =====================================================

  // Transform database content to ContentCard format
  private static transformContentData(data: any): ContentCard {
    return {
      id: data.id,
      type: data.type as ContentType,
      title: data.title,
      content: data.content,
      tone: data.tone as ContentTone,
      pillar: data.pillar as ContentPillar,
      engagement: {
        likes: data.engagement_likes || 0,
        comments: data.engagement_comments || 0,
        shares: data.engagement_shares || 0
      },
      createdAt: data.created_at,
      isFavorited: data.is_favorited || false,
      platform: data.platforms || []
    }
  }

  // Get user content summary for dashboard
  static async getUserContentSummary(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_content_summary')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user content summary:', error)
      return null
    }
  }
}
