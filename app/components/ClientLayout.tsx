"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ThemeProvider } from "../context/ThemeContext"
import { AuthProvider } from "../context/AuthContext"
import { CartProvider } from "../context/CartContext"
import { Toaster } from "@/components/ui/toaster"
import SplashScreen from "./SplashScreen"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-background text-foreground">
            {children}
            <Toaster />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
