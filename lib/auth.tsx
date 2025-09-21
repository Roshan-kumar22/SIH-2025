"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

const AuthContext = createContext<any>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        fetchProfile(data.session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      listener?.subscription.unsubscribe()
    }
    // eslint-disable-next-line
  }, [])

  const fetchProfile = async (userObj: any) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userObj.id)
      .single()
    if (data) setUser({ ...userObj, ...data })
    setLoading(false)
  }

  // Tourist signup
  const signup = async (
    email: string,
    password: string,
    profile: {
      first_name: string,
      last_name: string,
      dob: string,
      id_type: string,
      id_number: string,
      sex: string,
      phone: string,
      role: string
    }
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) return { error }
    // Insert profile
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        ...profile
      }
    ])
    if (profileError) return { error: profileError }
    await fetchProfile(data.user)
    return { error: null }
  }

  // Admin creates other roles
  const adminCreateUser = async (
    email: string,
    password: string,
    profile: {
      first_name: string,
      last_name: string,
      role: string
    }
  ) => {
    // Only admin should call this
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })
    if (error) return { error }
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        ...profile
      }
    ])
    if (profileError) return { error: profileError }
    return { error: null }
  }

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) return { error }
    await fetchProfile(data.user)
    return { error: null }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, adminCreateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}