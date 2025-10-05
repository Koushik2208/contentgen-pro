import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { DatabaseService } from '../lib/database'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  hasCompletedOnboarding: boolean
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  refreshOnboardingStatus: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false)
  
  // Track ongoing onboarding check to prevent race conditions
  const onboardingCheckRef = useRef<Promise<void> | null>(null)
  const lastCheckedUserIdRef = useRef<string | null>(null)

  // Memoized onboarding check with deduplication
  const checkOnboardingStatus = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setHasCompletedOnboarding(false)
      lastCheckedUserIdRef.current = null
      return
    }

    // Skip if already checking for the same user
    if (lastCheckedUserIdRef.current === currentUser.id && onboardingCheckRef.current) {
      return onboardingCheckRef.current
    }

    lastCheckedUserIdRef.current = currentUser.id

    const checkPromise = (async () => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const preferences = await DatabaseService.getUserPreferences(currentUser.id)
        clearTimeout(timeoutId)
        
        setHasCompletedOnboarding(!!preferences)
      } catch (error) {
        console.error('Error checking onboarding status:', error)
        // Default to true to prevent blocking users on errors
        setHasCompletedOnboarding(true)
      }
    })()

    onboardingCheckRef.current = checkPromise
    await checkPromise
    onboardingCheckRef.current = null
  }, [])

  useEffect(() => {
    let mounted = true

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        
        if (!mounted) return

        setSession(initialSession)
        setUser(initialSession?.user ?? null)
        await checkOnboardingStatus(initialSession?.user ?? null)
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return

      // Only update if session actually changed
      setSession(prevSession => {
        if (prevSession?.user?.id !== newSession?.user?.id) {
          setUser(newSession?.user ?? null)
          checkOnboardingStatus(newSession?.user ?? null)
          return newSession
        }
        return prevSession
      })

      // Handle sign out explicitly
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setHasCompletedOnboarding(false)
        lastCheckedUserIdRef.current = null
      }

      if (mounted && loading) setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [checkOnboardingStatus, loading])

  const signUp = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      setHasCompletedOnboarding(false)
      lastCheckedUserIdRef.current = null
    }
    return { error }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }, [])

  const refreshOnboardingStatus = useCallback(async () => {
    await checkOnboardingStatus(user)
  }, [user, checkOnboardingStatus])

  const value = {
    user,
    session,
    loading,
    hasCompletedOnboarding,
    signUp,
    signIn,
    signOut,
    resetPassword,
    refreshOnboardingStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}