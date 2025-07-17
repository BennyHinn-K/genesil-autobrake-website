"use client"

/// <reference types="react" />

import * as React from "react"
import { useState } from "react"
import { Alert, AlertCircle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, MessageCircle, CheckCircle, Clock } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"

const paymentSchema = z.object({
  paymentMethod: z.enum(["mpesa", "card", "call"]),
  phoneNumber: z.string().optional(),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
})

const CheckoutPage = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "mpesa",
    },
  })

  const onSubmit = async (values: z.infer<typeof paymentSchema>) => {
    // console.log(values)

    if (values.paymentMethod === "call") {
      // Handle call order - direct phone call
      return
    }

    // Simulate payment processing for other methods
    setIsProcessing(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (values.paymentMethod === "mpesa") {
        // Simulate M-Pesa STK push
        // console.log("Initiating M-Pesa payment for:", values.phoneNumber)
      } else if (values.paymentMethod === "card") {
        // Simulate card payment
        // console.log("Processing card payment")
      }

      setPaymentSuccess(true)
    } catch (error) {
      // console.error("Payment failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWhatsAppOrder = () => {
    const message = "Hello, I would like to place an order for auto parts from Genesil Autospares. Please assist me."
    window.open(`https://wa.me/254722683434?text=${encodeURIComponent(message)}`, "_blank")
  }

  return (
    <div className="container py-10 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Image src="/images/genesil-logo.png" alt="Genesil Autospares" className="w-16 h-16 mx-auto mb-4" width={64} height={64} />
        <h1 className="text-3xl font-bold mb-2">Secure Checkout</h1>
        <p className="text-gray-600">
          Complete your order with Genesil Autospares - Kenya's trusted auto parts supplier
        </p>
      </div>

      {/* Customer Support Priority Section */}
      <Card className="mb-8 border-yellow-200 bg-gradient-to-r from-yellow-50 to-yellow-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Phone className="h-5 w-5" />
            Prefer Personal Service?
          </CardTitle>
          <CardDescription className="text-yellow-700">
            Get expert advice and personalized assistance from our auto parts specialists
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a href="tel:+254722683434"><Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3">
              <Phone className="h-4 w-4 mr-2" />
              Call: +254 722 683 434</Button></a>
            <Button
              onClick={handleWhatsAppOrder}
              variant="outline"
              className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 py-3"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp Order
            </Button>
          </div>

          <div className="bg-white/70 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-yellow-800 mb-2">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">Business Hours</span>
            </div>
            <p className="text-xs text-yellow-700">Mon-Fri: 8:00 AM - 6:00 PM | Sat: 8:00 AM - 4:00 PM | Sun: Closed</p>
          </div>

          {/* Emergency Support */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-red-800">Emergency Brake Parts?</p>
                <p className="text-xs text-red-600">Urgent safety-critical parts support</p>
              </div>
              <a href="tel:+254722683434" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4">
                Emergency</a>
            </div>
          </div>
        </CardContent>
      </Card>

      {paymentSuccess ? (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
                <p className="text-green-700 mb-4">Your order has been processed successfully.</p>
                <div className="bg-white/70 rounded-lg p-4 text-left">
                  <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• You'll receive an order confirmation shortly</li>
                    <li>• Our team will contact you for delivery details</li>
                    <li>• Track your order status via phone or WhatsApp</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <a href="tel:+254722683434" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4">
                  WhatsApp</a>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payment Options</CardTitle>
            <CardDescription>Choose your preferred payment method for secure checkout</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <label htmlFor="paymentMethod" className="text-gray-700">Payment Method</label>
                      <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <FormControl>
                            <RadioGroupItem value="mpesa" />
                          </FormControl>
                          <span className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">M</span>
                              </div>
                              <div>
                                <div className="font-medium">M-Pesa Mobile Payment</div>
                                <div className="text-sm text-gray-500">Secure mobile money payment</div>
                              </div>
                            </div>
                          </span>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                          <FormControl>
                            <RadioGroupItem value="card" />
                          </FormControl>
                          <span className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                <span className="text-white text-xs font-bold">💳</span>
                              </div>
                              <div>
                                <div className="font-medium">Credit/Debit Card</div>
                                <div className="text-sm text-gray-500">Visa, Mastercard accepted</div>
                              </div>
                            </div>
                          </span>
                        </FormItem>

                        <FormItem className="flex items-center space-x-3 space-y-0 p-4 border-2 border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors bg-yellow-25">
                          <FormControl>
                            <RadioGroupItem value="call" />
                          </FormControl>
                          <span className="flex-1 cursor-pointer">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center">
                                <Phone className="h-4 w-4 text-black" />
                              </div>
                              <div>
                                <div className="font-medium text-yellow-800">Call to Order (Recommended)</div>
                                <div className="text-sm text-yellow-600">Speak with our parts experts directly</div>
                              </div>
                            </div>
                          </span>
                        </FormItem>
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("paymentMethod") === "mpesa" && (
                  <div className="space-y-4">
                    <Separator />
                    <Alert className="border-green-200 bg-green-50">
                      <AlertCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        <strong>M-Pesa Payment:</strong> You will receive an STK push notification on your phone to
                        complete the payment securely.
                      </AlertDescription>
                    </Alert>
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <label htmlFor="phoneNumber" className="text-gray-700">M-Pesa Phone Number</label>
                          <FormControl>
                            <Input
                              placeholder="254XXXXXXXXX (e.g., 254722683434)"
                              {...field}
                              id="phoneNumber"
                              className="focus:border-green-500 focus:ring-green-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {form.watch("paymentMethod") === "card" && (
                  <div className="space-y-4">
                    <Separator />
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Secure Card Payment:</strong> Your card details are encrypted and processed securely.
                      </AlertDescription>
                    </Alert>
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <label htmlFor="cardNumber" className="text-gray-700">Card Number</label>
                            <FormControl>
                              <Input placeholder="1234 5678 9012 3456" {...field} id="cardNumber" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <label htmlFor="expiryDate" className="text-gray-700">Expiry Date</label>
                              <FormControl>
                                <Input placeholder="MM/YY" {...field} id="expiryDate" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <label htmlFor="cvv" className="text-gray-700">CVV</label>
                              <FormControl>
                                <Input placeholder="123" {...field} id="cvv" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {form.watch("paymentMethod") === "call" && (
                  <div className="space-y-4">
                    <Separator />
                    <Alert className="border-yellow-200 bg-yellow-50">
                      <Phone className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <strong>Call to Order:</strong> Our auto parts experts will help you complete your order, verify
                        compatibility, and arrange convenient payment and delivery options.
                      </AlertDescription>
                    </Alert>
                    <div className="bg-white rounded-lg p-4 border">
                      <h4 className="font-semibold mb-2">Why call us?</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Expert advice on part compatibility</li>
                        <li>• Flexible payment options</li>
                        <li>• Same-day delivery in Nairobi</li>
                        <li>• Warranty and installation guidance</li>
                      </ul>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Processing...
                    </>
                  ) : form.watch("paymentMethod") === "call" ? (
                    <>
                      <Phone className="h-5 w-5 mr-2" />
                      <a href="tel:+254722683434" className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4">Call Now: +254 722 683 434</a>
                    </>
                  ) : (
                    "Complete Secure Payment"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Trust Indicators */}
      <div className="mt-8 text-center">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Expert Support</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Fast Delivery</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
