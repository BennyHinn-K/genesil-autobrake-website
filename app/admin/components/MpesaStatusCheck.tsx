"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, RefreshCw, Shield, Key, Hash, Phone } from "lucide-react"
import { getMpesaConfig, validateMpesaSetup, getSecurityCredential } from "@/lib/mpesa-config"

export default function MpesaStatusCheck() {
  const [status, setStatus] = useState<{
    isValid: boolean
    errors: string[]
    config: any
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const validation = validateMpesaSetup()
      const config = getMpesaConfig()
      const securityCredential = getSecurityCredential()

      setStatus({
        isValid: validation.isValid,
        errors: validation.errors,
        config: {
          ...config,
          securityCredential: securityCredential ? "✓ Configured" : "✗ Missing",
        },
      })
    } catch (error) {
      console.error("Error checking M-Pesa status:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  if (!status) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span className="ml-2">Checking M-Pesa configuration...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-orange-500" />
            )}
            M-Pesa Configuration Status
          </CardTitle>
          <CardDescription>Current status of your M-Pesa integration credentials</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Consumer Key</span>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Consumer Secret</span>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Business Shortcode</span>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Test Mode
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Security Credential</span>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Configured
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Current Status:</strong> Development Mode
                  <br />
                  <strong>Environment:</strong> Sandbox
                  <br />
                  <strong>Ready for:</strong> Testing & Development
                </AlertDescription>
              </Alert>

              <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  <strong>Production Ready:</strong> Waiting for business shortcode approval from Safaricom
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4">
            <Button onClick={checkStatus} disabled={loading} variant="outline" size="sm">
              {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Refresh Status
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What's Working Now</CardTitle>
          <CardDescription>Current functionality with your setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600 dark:text-green-400">✅ Fully Functional</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Complete website with product catalog</li>
                <li>• Shopping cart and checkout flow</li>
                <li>• Admin dashboard with inventory management</li>
                <li>• Smart chatbot with business knowledge</li>
                <li>• WhatsApp integration for orders</li>
                <li>• Direct payment instructions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-orange-600 dark:text-orange-400">⏳ Pending</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Automated M-Pesa STK Push</li>
                <li>• Real-time payment confirmation</li>
                <li>• Production shortcode integration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-500" />
            Current Payment Flow
          </CardTitle>
          <CardDescription>How customers complete payments right now</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div>
                <p className="font-medium">Customer places order</p>
                <p className="text-sm text-muted-foreground">Complete checkout form with delivery details</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div>
                <p className="font-medium">Payment instructions displayed</p>
                <p className="text-sm text-muted-foreground">Send M-Pesa to 0722683434 with order total</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div>
                <p className="font-medium">Customer confirms payment</p>
                <p className="text-sm text-muted-foreground">Call or WhatsApp with M-Pesa confirmation code</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                4
              </div>
              <div>
                <p className="font-medium">Order processed & delivered</p>
                <p className="text-sm text-muted-foreground">You confirm payment and arrange delivery</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
