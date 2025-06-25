"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Trash2, ShoppingBag, Phone, Copy } from "lucide-react"
import { useCart } from "../context/CartContext"
import Link from "next/link"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { items, updateQuantity, removeItem, total } = useCart()
  const { toast } = useToast()

  const copyPhoneNumber = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard
        .writeText("+254722683434")
        .then(() => {
          toast({
            title: "Phone number copied!",
            description: "+254 722 683 434 has been copied to your clipboard",
          })
        })
        .catch(() => {
          toast({
            title: "Copy failed",
            description: "Please manually copy: +254 722 683 434",
            variant: "destructive",
          })
        })
    } else {
      toast({
        title: "Phone number",
        description: "+254 722 683 434 - Please copy manually",
      })
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background">
        <Navbar />
        <div className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link href="/catalogue">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const shipping = 500
  const tax = total * 0.16
  const finalTotal = total + shipping + tax

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      <Navbar />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="border-l-4 border-yellow-400">
                <CardHeader>
                  <CardTitle className="text-foreground">Cart Items ({items.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border border-border rounded-lg bg-card"
                    >
                      <img
                        src={item.image || "/placeholder.svg?height=80&width=80"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg?height=80&width=80"
                        }}
                      />

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.product?.category || "Auto Parts"}</p>
                        <p className="text-2xl font-bold text-yellow-600">KES {item.price.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="text-lg font-semibold w-8 text-center text-foreground">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          KES {(item.price * item.quantity).toLocaleString()}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              <Card className="border-l-4 border-yellow-400">
                <CardHeader>
                  <CardTitle className="text-foreground">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">KES {total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-semibold text-foreground">KES {shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VAT (16%)</span>
                    <span className="font-semibold text-foreground">KES {Math.round(tax).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-foreground">Total</span>
                      <span className="text-foreground">KES {Math.round(finalTotal).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="border-l-4 border-green-500">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-green-600" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 dark:text-green-400 mb-2">M-Pesa Payment</h4>
                    <p className="text-green-700 dark:text-green-300 text-sm mb-3">
                      Send payment to our M-Pesa number below:
                    </p>
                    <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border">
                      <div>
                        <p className="text-sm text-muted-foreground">Pay to:</p>
                        <p className="text-xl font-bold text-foreground">+254 722 683 434</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyPhoneNumber}
                        className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                      Amount: KES {Math.round(finalTotal).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      After payment, call or WhatsApp us at <strong>+254 722 683 434</strong> with:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                      <li>• M-Pesa confirmation message</li>
                      <li>• Your delivery address</li>
                      <li>• Preferred delivery time</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.open("tel:+254722683434")
                    }
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call +254 722 683 434 to Order
                </Button>
                <Link href="/catalogue">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
