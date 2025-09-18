"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // check if user is logged in
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user && data.user.email_confirmed_at) {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          firstName: data.user.user_metadata?.firstName,
          lastName: data.user.user_metadata?.lastName,
        })
      }
      setLoading(false)
    }
    getUser()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error || !data.user) return { success: false, error: error?.message || "Login failed" }

      if (!data.user.email_confirmed_at) {
        return { success: false, error: "Please confirm your email before logging in." }
      }

      setUser({
        id: data.user.id,
        email: data.user.email!,
        firstName: data.user.user_metadata?.firstName,
        lastName: data.user.user_metadata?.lastName,
      })

      return { success: true }
    } catch {
      return { success: false, error: "Unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`, // redirect after email confirmation
          data: { firstName, lastName }, // save names in user_metadata
        },
      })

      if (error || !data.user) return { success: false, error: error?.message || "Registration failed" }

      return { success: true }
    } catch {
      return { success: false, error: "Unexpected error occurred" }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/auth")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}