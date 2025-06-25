"use client"

import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [fadeOut, setFadeOut] = useState(false)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    // Show text after logo loads
    const textTimer = setTimeout(() => {
      setShowText(true)
    }, 800)

    // Fade out after 3.5 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 3500)

    return () => {
      clearTimeout(textTimer)
      clearTimeout(fadeTimer)
    }
  }, [])

  if (fadeOut) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-1000 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)",
      }}
    >
      {/* Genesil Logo - Centered */}
      <div className="mb-8">
        <img src="/images/genesil-splash-logo.png" alt="Genesil Autospares" className="w-80 h-auto drop-shadow-2xl" width={320} height={128} />
      </div>

      {/* Loading Text - Just below logo */}
      <div className="text-center mb-12">
        <h2
          className={`text-gray-900 font-bold text-2xl tracking-wide drop-shadow-lg transition-all duration-1000 ${
            showText ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Loading to your automotive experience
        </h2>
      </div>

      {/* Loading Animation - Three Dots */}
      <div className="flex justify-center space-x-3">
        <div
          className="w-5 h-5 bg-gray-800 rounded-full animate-bounce shadow-lg"
          style={{ animationDelay: "0ms" }}
        ></div>
        <div
          className="w-5 h-5 bg-gray-800 rounded-full animate-bounce shadow-lg"
          style={{ animationDelay: "150ms" }}
        ></div>
        <div
          className="w-5 h-5 bg-gray-800 rounded-full animate-bounce shadow-lg"
          style={{ animationDelay: "300ms" }}
        ></div>
      </div>
    </div>
  )
}
