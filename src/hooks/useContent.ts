import { useState, useEffect } from 'react'
import { ContentCard } from '../types'
import { DatabaseService } from '../lib/database'
import { useAuth } from '../contexts/AuthContext'

export const useContent = () => {
  const [content, setContent] = useState<ContentCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Load user content
  const loadContent = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      console.log('Loading content for user:', user.id)
      const userContent = await DatabaseService.getUserContent(user.id)
      console.log('Loaded content:', userContent)
      setContent(userContent)
    } catch (err) {
      setError('Failed to load content')
      console.error('Error loading content:', err)
      // Set empty content array on error to prevent infinite loading
      setContent([])
    } finally {
      setLoading(false)
    }
  }

  // Create new content
  const createContent = async (contentData: {
    type: ContentCard['type']
    title: string
    content: string
    tone: ContentCard['tone']
    pillar: ContentCard['pillar']
    platforms: ContentCard['platform']
  }) => {
    if (!user) return null

    try {
      const newContent = await DatabaseService.createContent({
        ...contentData,
        userId: user.id
      })

      if (newContent) {
        setContent(prev => [newContent, ...prev])
        return newContent
      }
      return null
    } catch (err) {
      setError('Failed to create content')
      console.error('Error creating content:', err)
      return null
    }
  }

  // Update content
  const updateContent = async (contentId: string, updates: Partial<ContentCard>) => {
    try {
      const updatedContent = await DatabaseService.updateContent(contentId, updates)
      
      if (updatedContent) {
        setContent(prev => prev.map(item => 
          item.id === contentId ? updatedContent : item
        ))
        return updatedContent
      }
      return null
    } catch (err) {
      setError('Failed to update content')
      console.error('Error updating content:', err)
      return null
    }
  }

  // Toggle favorite
  const toggleFavorite = async (contentId: string, isFavorited: boolean) => {
    try {
      const success = await DatabaseService.toggleFavorite(contentId, isFavorited)
      
      if (success) {
        setContent(prev => prev.map(item => 
          item.id === contentId ? { ...item, isFavorited } : item
        ))
        return true
      }
      return false
    } catch (err) {
      setError('Failed to toggle favorite')
      console.error('Error toggling favorite:', err)
      return false
    }
  }

  // Delete content
  const deleteContent = async (contentId: string) => {
    try {
      const success = await DatabaseService.deleteContent(contentId)
      
      if (success) {
        setContent(prev => prev.filter(item => item.id !== contentId))
        return true
      }
      return false
    } catch (err) {
      setError('Failed to delete content')
      console.error('Error deleting content:', err)
      return false
    }
  }

  // Load content on mount and when user changes
  useEffect(() => {
    if (user) {
      // Add a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        if (loading) {
          console.warn('Content loading timeout - database might not be accessible')
          setError('Database connection timeout. Please check your database setup.')
          setLoading(false)
        }
      }, 10000) // 10 second timeout

      loadContent().finally(() => {
        clearTimeout(timeout)
      })
    } else {
      setContent([])
      setLoading(false)
    }
  }, [user])

  return {
    content,
    loading,
    error,
    loadContent,
    createContent,
    updateContent,
    toggleFavorite,
    deleteContent
  }
}
