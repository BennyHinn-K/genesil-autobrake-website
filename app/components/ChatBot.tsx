"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, X, Send, User, Bot, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Genesil Auto Brake & Accessories assistant. I can help you with product information, prices, location, and any questions about our services. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Check if mobile and initialize position
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        const mobile = window.innerWidth < 768
        setIsMobile(mobile)

        if (mobile) {
          // Mobile: position at bottom center
          setPosition({
            x: (window.innerWidth - 350) / 2,
            y: window.innerHeight - 500,
          })
        } else {
          // Desktop: position at bottom right
          setPosition({
            x: window.innerWidth - 420,
            y: window.innerHeight - 550,
          })
        }
      }

      checkMobile()
      window.addEventListener("resize", checkMobile)
      return () => window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!chatRef.current || isMobile) return

    const rect = chatRef.current.getBoundingClientRect()
    setIsDragging(true)
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || typeof window === "undefined" || isMobile) return

    const newX = e.clientX - dragOffset.x
    const newY = e.clientY - dragOffset.y

    const chatWidth = isMobile ? 350 : 400
    const chatHeight = isMinimized ? 60 : isMobile ? 480 : 520

    const maxX = window.innerWidth - chatWidth
    const maxY = window.innerHeight - chatHeight

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging && !isMobile) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, dragOffset, isMobile])

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(inputText),
        isBot: true,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Location and contact info
    if (input.includes("location") || input.includes("address") || input.includes("where") || input.includes("find")) {
      return "📍 We're located at Genesil Autobrake & Accessories in Nairobi, Kenya. You can find us on Google Maps or contact us at 0722683434 for directions. We're easily accessible and have ample parking space for our customers."
    }

    // Payment and contact
    if (
      input.includes("payment") ||
      input.includes("pay") ||
      input.includes("mpesa") ||
      input.includes("phone") ||
      input.includes("contact")
    ) {
      return "💳 For payments, please use our M-Pesa number: 0722683434. We accept M-Pesa payments for all orders. You can also call us on the same number for any inquiries or to place orders over the phone."
    }

    // Pricing and quotes
    if (input.includes("price") || input.includes("cost") || input.includes("quote") || input.includes("how much")) {
      return "💰 Our prices are competitive and vary by product category. Brake pads start from KES 2,500, brake discs from KES 4,500, and complete brake systems from KES 15,000. For specific quotes, please browse our catalogue or call 0722683434 for personalized pricing."
    }

    // Products and services
    if (
      input.includes("product") ||
      input.includes("brake") ||
      input.includes("service") ||
      input.includes("what do you")
    ) {
      return "🔧 We specialize in brake systems and auto accessories including: Brake Pads, Brake Discs, Brake Calipers, Brake Fluids, Brake Lines, Complete Brake Kits, Suspension Parts, and Auto Accessories. We serve all major car brands including Toyota, Honda, Nissan, BMW, Mercedes, and many more."
    }

    // Installation and technical
    if (
      input.includes("install") ||
      input.includes("technical") ||
      input.includes("support") ||
      input.includes("help")
    ) {
      return "🔧 We provide professional installation services for all our products. Our certified technicians can install brake systems, suspension components, and other auto parts. Installation costs vary by complexity. Call 0722683434 to book an installation appointment."
    }

    // Warranty
    if (input.includes("warranty") || input.includes("guarantee")) {
      return "✅ All our products come with manufacturer warranties. Brake pads: 6-12 months, Brake discs: 12-24 months, Complete systems: 12-36 months depending on brand. We also provide installation warranty for our services."
    }

    // Delivery and shipping
    if (input.includes("deliver") || input.includes("shipping") || input.includes("transport")) {
      return "🚚 We offer delivery services within Nairobi and surrounding areas. Delivery fee is KES 500 within Nairobi, KES 800-1500 for outer areas. Free delivery for orders above KES 20,000. Delivery takes 1-3 business days."
    }

    // Business hours
    if (input.includes("open") || input.includes("hours") || input.includes("time") || input.includes("when")) {
      return "🕒 We're open Monday to Saturday: 8:00 AM - 6:00 PM, Sunday: 9:00 AM - 4:00 PM. For urgent brake repairs, call 0722683434 - we may accommodate emergency services outside regular hours."
    }

    // Car compatibility
    if (input.includes("car") || input.includes("vehicle") || input.includes("compatible") || input.includes("fit")) {
      return "🚗 We stock parts for most vehicle makes and models including Toyota, Honda, Nissan, Mazda, Mitsubishi, Subaru, BMW, Mercedes, Audi, VW, and many more. Provide your car's year, make, and model for specific compatibility confirmation."
    }

    // Quality and brands
    if (
      input.includes("quality") ||
      input.includes("brand") ||
      input.includes("original") ||
      input.includes("genuine")
    ) {
      return "⭐ We stock both genuine OEM parts and high-quality aftermarket brands including Brembo, Bosch, ATE, TRW, Ferodo, Pagid, and other trusted manufacturers. All parts meet or exceed OEM specifications."
    }

    // Emergency services
    if (
      input.includes("emergency") ||
      input.includes("urgent") ||
      input.includes("brake fail") ||
      input.includes("problem")
    ) {
      return "🚨 For brake emergencies, call 0722683434 immediately! We provide emergency brake repair services. If your brakes are failing, stop driving immediately and call us. We can arrange emergency roadside assistance or towing if needed."
    }

    // Default response for any other question
    return "Thank you for your question! I'm here to help with information about our brake systems, auto parts, pricing, location, and services. For specific technical questions or immediate assistance, please call us at 0722683434. Our expert team is ready to help you with all your automotive brake and accessory needs. What specific information can I provide for you?"
  }

  const quickReplies = [
    "Show me brake pad prices",
    "Where are you located?",
    "Installation services",
    "Payment methods",
    "Delivery options",
    "Emergency brake repair",
  ]

  const handleQuickReply = (reply: string) => {
    setInputText(reply)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const chatWidth = isMobile ? "w-[350px]" : "w-[400px]"
  const chatHeight = isMinimized ? "h-16" : isMobile ? "h-[480px]" : "h-[520px]"

  return (
    <>
      {/* Chat Button - Responsive positioning */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed ${isMobile ? "bottom-4 right-4 w-12 h-12" : "bottom-6 right-6 w-14 h-14"} rounded-full bg-black hover:bg-gray-800 shadow-lg z-50 ${
          isOpen ? "hidden" : "flex"
        } items-center justify-center border-2 border-yellow-500 transition-all duration-300 hover:scale-110`}
      >
        <MessageCircle className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-yellow-500`} />
      </Button>

      {/* Chat Window - Fully Responsive */}
      {isOpen && (
        <div
          ref={chatRef}
          className={`fixed z-50 transition-all duration-300 ${chatWidth} ${chatHeight} shadow-2xl ${
            isMobile ? "bottom-4 left-1/2 transform -translate-x-1/2" : ""
          }`}
          style={
            !isMobile
              ? {
                  left: position.x,
                  top: position.y,
                  cursor: isDragging ? "grabbing" : "default",
                }
              : {}
          }
        >
          <Card className="h-full flex flex-col bg-black border-2 border-yellow-500 overflow-hidden">
            <CardHeader
              className={`bg-gradient-to-r from-black to-gray-900 text-white rounded-t-lg border-b border-yellow-500 ${
                !isMobile ? "cursor-grab active:cursor-grabbing" : ""
              } ${isMobile ? "py-3" : "py-4"}`}
              onMouseDown={handleMouseDown}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} bg-yellow-500 rounded-full flex items-center justify-center`}
                  >
                    <Bot className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} text-black`} />
                  </div>
                  <div>
                    <CardTitle className={`${isMobile ? "text-base" : "text-lg"} text-white`}>
                      Genesil Assistant
                    </CardTitle>
                    {!isMinimized && (
                      <p className={`text-yellow-400 ${isMobile ? "text-xs" : "text-sm"}`}>Auto Brake Specialist</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMinimized(!isMinimized)}
                    className={`text-white hover:bg-gray-800 ${isMobile ? "h-6 w-6" : "h-8 w-8"} p-0`}
                  >
                    {isMinimized ? (
                      <Maximize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                    ) : (
                      <Minimize2 className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className={`text-white hover:bg-gray-800 ${isMobile ? "h-6 w-6" : "h-8 w-8"} p-0`}
                  >
                    <X className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {!isMinimized && (
              <CardContent className="flex-1 flex flex-col p-0 bg-black">
                {/* Messages - Responsive height */}
                <div
                  className={`flex-1 overflow-y-auto ${isMobile ? "p-3" : "p-4"} space-y-3 ${isMobile ? "max-h-64" : "max-h-72"}`}
                >
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`flex items-start space-x-2 max-w-[85%] ${
                          message.isBot ? "flex-row" : "flex-row-reverse space-x-reverse"
                        }`}
                      >
                        <div
                          className={`${isMobile ? "w-6 h-6" : "w-8 h-8"} rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.isBot ? "bg-yellow-500" : "bg-gray-700"
                          }`}
                        >
                          {message.isBot ? (
                            <Bot className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} text-black`} />
                          ) : (
                            <User className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} text-white`} />
                          )}
                        </div>
                        <div
                          className={`${isMobile ? "px-3 py-2" : "px-4 py-3"} rounded-lg shadow-sm ${
                            message.isBot ? "bg-gray-800 text-white border border-gray-700" : "bg-yellow-500 text-black"
                          }`}
                        >
                          <p className={`${isMobile ? "text-xs" : "text-sm"} leading-relaxed`}>{message.text}</p>
                          <p className={`${isMobile ? "text-xs" : "text-xs"} opacity-70 mt-1`}>
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Replies - Responsive */}
                <div className={`${isMobile ? "p-3" : "p-4"} border-t border-gray-700 bg-gray-900`}>
                  <p className={`${isMobile ? "text-xs" : "text-xs"} text-gray-400 mb-2`}>Quick questions:</p>
                  <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-2 mb-3`}>
                    {quickReplies.slice(0, isMobile ? 4 : 6).map((reply, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply(reply)}
                        className={`${isMobile ? "text-xs h-7" : "text-xs h-8"} border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black transition-colors`}
                      >
                        {reply}
                      </Button>
                    ))}
                  </div>

                  {/* Input - Responsive */}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your question here..."
                      autoFocus
                      className={`flex-1 ${isMobile ? "px-3 py-2 text-sm" : "px-4 py-3 text-sm"} border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-gray-800 text-white placeholder-gray-400 transition-all duration-200`}
                    />
                    <Button
                      onClick={handleSendMessage}
                      size="sm"
                      className={`bg-yellow-500 hover:bg-yellow-600 text-black ${isMobile ? "px-3 py-2" : "px-4 py-3"} font-medium transition-all duration-200`}
                      disabled={!inputText.trim()}
                    >
                      <Send className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </>
  )
}
