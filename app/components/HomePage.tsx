"use client"

import Navbar from "./Navbar"
import Hero from "./Hero"
import FeaturedProducts from "./FeaturedProducts"
import Services from "./Services"
import Footer from "./Footer"
import ChatBot from "./ChatBot"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Services />
      <Footer />
      <ChatBot />
    </div>
  )
}
