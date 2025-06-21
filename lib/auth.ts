"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
  error: string | null
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("genesil_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null)
      // Check for admin credentials
      if (password === "K@ranJA") {
        const adminUser: User = {
          id: "admin",
          name: "Administrator",
          email: email,
          isAdmin: true,
        }
        setUser(adminUser)
        localStorage.setItem("genesil_user", JSON.stringify(adminUser))
        return true
      }

      // Regular user login (simplified for demo)
      const regularUser: User = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email: email,
        isAdmin: false,
      }
      setUser(regularUser)
      localStorage.setItem("genesil_user", JSON.stringify(regularUser))
      return true
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
      return false
    }
  }

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setError(null)
      // Check for admin credentials
      if (password === "K@ranJA") {
        const adminUser: User = {
          id: "admin",
          name: name,
          email: email,
          isAdmin: true,
        }
        setUser(adminUser)
        localStorage.setItem("genesil_user", JSON.stringify(adminUser))
        return true
      }

      // Regular user signup
      const newUser: User = {
        id: Date.now().toString(),
        name: name,
        email: email,
        isAdmin: false,
      }
      setUser(newUser)
      localStorage.setItem("genesil_user", JSON.stringify(newUser))
      return true
    } catch (error) {
      console.error("Signup error:", error)
      setError("Signup failed. Please try again.")
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("genesil_user")
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    isAdmin: user?.isAdmin || false,
    login,
    signup,
    logout,
    loading,
    error,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
