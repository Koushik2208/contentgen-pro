import { useState, useEffect } from 'react'
import { DatabaseService } from '../lib/database'
import { useAuth } from '../contexts/AuthContext'

export const useUserProfile = () => {
  const [profile, setProfile] = useState<any>(null)
  const [preferences, setPreferences] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  // Load user profile and preferences
  const loadProfile = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      const [profileData, preferencesData] = await Promise.all([
        DatabaseService.getUserProfile(user.id),
        DatabaseService.getUserPreferences(user.id)
      ])

      setProfile(profileData)
      setPreferences(preferencesData)
    } catch (err) {
      setError('Failed to load profile')
      console.error('Error loading profile:', err)
    } finally {
      setLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (profileData: {
    name?: string
    industry?: string
    target_audience?: string
    avatar_url?: string
  }) => {
    if (!user) return null

    try {
      const updatedProfile = await DatabaseService.upsertUserProfile({
        id: user.id,
        email: user.email || '',
        name: user.user_metadata?.name || '',
        ...profileData
      })

      if (updatedProfile) {
        setProfile(updatedProfile)
        return updatedProfile
      }
      return null
    } catch (err) {
      setError('Failed to update profile')
      console.error('Error updating profile:', err)
      return null
    }
  }

  // Update user preferences
  const updatePreferences = async (preferencesData: {
    profession?: string
    custom_profession?: string
    content_goals?: string[]
    preferred_tone?: string
    content_pillars?: string[]
    email_notifications?: any
  }) => {
    if (!user) return null

    try {
      const updatedPreferences = await DatabaseService.upsertUserPreferences({
        user_id: user.id,
        ...preferencesData
      })

      if (updatedPreferences) {
        setPreferences(updatedPreferences)
        return updatedPreferences
      }
      return null
    } catch (err) {
      setError('Failed to update preferences')
      console.error('Error updating preferences:', err)
      return null
    }
  }

  // Load profile on mount and when user changes
  useEffect(() => {
    if (user) {
      loadProfile()
    } else {
      setProfile(null)
      setPreferences(null)
      setLoading(false)
    }
  }, [user])

  return {
    profile,
    preferences,
    loading,
    error,
    loadProfile,
    updateProfile,
    updatePreferences
  }
}
