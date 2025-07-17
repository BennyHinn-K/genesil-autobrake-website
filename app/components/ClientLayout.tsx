"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ThemeProvider } from "../context/ThemeContext"
import { AuthProvider } from "../context/AuthContext"
import { CartProvider } from "../context/CartContext"
import { Toaster } from "@/components/ui/toaster"
import SplashScreen from "./SplashScreen"
import BackButton from "./BackButton";
import { usePathname } from "next/navigation";

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
              {/* Back button for all pages except home */}
              {(() => {
                const pathname = usePathname();
                if (pathname !== "/") {
                  return (
                    <div className="fixed top-6 left-6 z-40 md:top-8 md:left-8">
                      <BackButton className="shadow-lg" />
                    </div>
                  );
                }
                return null;
              })()}
              {/* Add margin-top to content if BackButton is visible */}
              <div className={(() => {
                const pathname = usePathname();
                return pathname !== "/" ? "mt-20 md:mt-24" : "";
              })()}>
                {children}
              </div>
              <Toaster />
            </div>
          )}
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
