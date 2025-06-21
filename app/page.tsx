"use client"

import { useEffect, useState } from "react"
import SplashScreen from "./components/SplashScreen"
import HomePage from "./components/HomePage"

export default function Page() {
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

  return <HomePage />
}
