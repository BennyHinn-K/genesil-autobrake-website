"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ThemeProvider } from "../context/ThemeContext"
import { AuthProvider } from "../context/AuthContext"
import { CartProvider } from "../context/CartContext"
import { Toaster } from "@/components/ui/toaster"
import SplashScreen from "./SplashScreen"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    console.log("ClientLayout mounted. Starting splash screen timer.")
    const timer = setTimeout(() => {
      console.log("Splash screen timer finished. Setting isLoading to false.")
      setIsLoading(false)
    }, 2000) // Reduced to 2 seconds

    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          {isLoading ? (
            <SplashScreen />
          ) : (
            <div className="min-h-screen bg-background text-foreground">
              {children}
              <Toaster />
            </div>
          )}
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
