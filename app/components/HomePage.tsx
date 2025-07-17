"use client"

import Navbar from "./Navbar"
import Hero from "./Hero"
import Services from "./Services"
import Footer from "./Footer"
import ChatBot from "./ChatBot"

export default function HomePage({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      {children}
      <Services />
      <Footer />
      <ChatBot />
    </div>
  )
}
