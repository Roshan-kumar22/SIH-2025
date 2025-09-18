"use client"

import type React from "react"

import { useAuth, type User } from "@/lib/auth"
import { LoginForm } from "./login-form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: User["role"][]
  requireAuth?: boolean
}

export function ProtectedRoute({ children, allowedRoles = [], requireAuth = true }: ProtectedRouteProps) {
  const { user, loading } = useAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Show login form if authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <LoginForm />
  }

  // Check role-based access if roles are specified
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <div className="space-y-2">
              <h4 className="font-medium">Access Denied</h4>
              <p>You don't have permission to access this page.</p>
              <p className="text-sm">
                Required roles: {allowedRoles.join(", ")}
                <br />
                Your role: {user.role}
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // User is authenticated and has proper role access
  return <>{children}</>
}
