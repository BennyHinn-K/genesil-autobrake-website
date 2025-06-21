"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, ExternalLink, Download, Database, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export default function SetupPage() {
  const [mpesaStatus, setMpesaStatus] = useState<any>(null)
  const [isTestingSync, setIsTestingSync] = useState(false)
  const [syncTestResult, setSyncTestResult] = useState<any>(null)
  const { toast } = useToast()

  const checkMpesaStatus = async () => {
    try {
      const response = await fetch("/api/mpesa/validate")
      const data = await response.json()
      setMpesaStatus(data)
    } catch (error) {
      console.error("Failed to check M-Pesa status:", error)
    }
  }

  const testSyncFunctionality = async () => {
    setIsTestingSync(true)
    try {
      const response = await fetch("/api/test-sync", { method: "POST" })
      const data = await response.json()
      setSyncTestResult(data)

      if (data.success) {
        toast({
          title: "Sync Test Successful!",
          description: "Product synchronization is working correctly.",
        })
      } else {
        toast({
          title: "Sync Test Failed",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Test Error",
        description: "Failed to test sync functionality.",
        variant: "destructive",
      })
    } finally {
      setIsTestingSync(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    })
  }

  const downloadEnvTemplate = () => {
    const envTemplate = `# M-Pesa Configuration
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_BUSINESS_SHORT_CODE=174379
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback
MPESA_ENVIRONMENT=sandbox

# For production, change to:
# MPESA_ENVIRONMENT=production
# MPESA_CALLBACK_URL=https://your-production-domain.com/api/mpesa/callback
`

    const blob = new Blob([envTemplate], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = ".env.local"
    link.click()

    toast({
      title: "Template Downloaded",
      description: "Environment variables template downloaded as .env.local",
    })
  }

  useEffect(() => {
    checkMpesaStatus()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-4">Setup Guide</h1>
            <p className="text-xl text-gray-600">
              Complete setup for Genesil Autospares M-Pesa integration and product synchronization
            </p>
          </div>

          {/* M-Pesa Setup */}
          <Card className="mb-8 border-l-4 border-green-400">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Smartphone className="h-5 w-5 mr-2" />
                M-Pesa Integration Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-black">Current Status</h4>
                  <p className="text-gray-600 text-sm">M-Pesa configuration validation</p>
                </div>
                <div className="flex items-center gap-2">
                  {mpesaStatus ? (
                    <Badge className={mpesaStatus.isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {mpesaStatus.isValid ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Configured
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Needs Setup
                        </>
                      )}
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Checking...</Badge>
                  )}
                  <Button onClick={checkMpesaStatus} variant="outline" size="sm">
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-black mb-2">Step 1: Get Safaricom Developer Account</h5>
                  <p className="text-gray-600 text-sm mb-3">
                    Create an account on Safaricom Developer Portal to get your API credentials.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open("https://developer.safaricom.co.ke/", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open Developer Portal
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-black mb-2">Step 2: Create New App</h5>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p>• App Name: Genesil Autospares Payment</p>
                    <p>• Select API: Lipa Na M-Pesa Online (STK Push)</p>
                    <p>• Get your Consumer Key, Consumer Secret, and Passkey</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-black mb-2">Step 3: Set Environment Variables</h5>
                  <div className="bg-gray-100 rounded p-3 mb-3">
                    <code className="text-sm">
                      MPESA_CONSUMER_KEY=your_consumer_key
                      <br />
                      MPESA_CONSUMER_SECRET=your_consumer_secret
                      <br />
                      MPESA_BUSINESS_SHORT_CODE=174379
                      <br />
                      MPESA_PASSKEY=your_passkey
                      <br />
                      MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback
                      <br />
                      MPESA_ENVIRONMENT=sandbox
                    </code>
                  </div>
                  <Button onClick={downloadEnvTemplate} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download .env Template
                  </Button>
                </div>
              </div>

              {mpesaStatus && !mpesaStatus.isValid && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="font-semibold text-red-800 mb-2">Configuration Issues:</h5>
                  <ul className="text-sm text-red-700 space-y-1">
                    {mpesaStatus.errors.map((error: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Sync Setup */}
          <Card className="mb-8 border-l-4 border-blue-400">
            <CardHeader>
              <CardTitle className="flex items-center text-black">
                <Database className="h-5 w-5 mr-2" />
                Product Synchronization Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-black">Test Sync Functionality</h4>
                  <p className="text-gray-600 text-sm">Verify that product sync is working correctly</p>
                </div>
                <Button
                  onClick={testSyncFunctionality}
                  disabled={isTestingSync}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isTestingSync ? "Testing..." : "Test Sync"}
                </Button>
              </div>

              {syncTestResult && (
                <div
                  className={`p-4 rounded-lg border ${
                    syncTestResult.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {syncTestResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                    )}
                    <span className="font-semibold">
                      {syncTestResult.success ? "Sync Test Passed" : "Sync Test Failed"}
                    </span>
                  </div>
                  <p className="text-sm">{syncTestResult.message}</p>
                </div>
              )}

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-black mb-2">Supported File Formats</h5>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      • <strong>JSON:</strong> Upload JSON files with product arrays
                    </p>
                    <p>
                      • <strong>CSV:</strong> Upload CSV files with product data
                    </p>
                    <p>
                      • <strong>Required fields:</strong> sku, name, price, category, brand
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-semibold text-black mb-2">Sample Data Files</h5>
                  <p className="text-gray-600 text-sm mb-3">
                    Download sample files to test the synchronization functionality.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = "/scripts/sample-sync-data.json"
                        link.download = "sample-products.json"
                        link.click()
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      JSON Sample
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const link = document.createElement("a")
                        link.href = "/scripts/sample-sync-data.csv"
                        link.download = "sample-products.csv"
                        link.click()
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      CSV Sample
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card className="border-l-4 border-yellow-400">
            <CardHeader>
              <CardTitle className="text-black">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center"
                  onClick={() => (window.location.href = "/admin")}
                >
                  <Database className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Admin Panel</span>
                  <span className="text-xs text-gray-600">Manage products & sync</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center"
                  onClick={() => (window.location.href = "/catalogue")}
                >
                  <ExternalLink className="h-6 w-6 mb-2" />
                  <span className="font-semibold">Product Catalog</span>
                  <span className="text-xs text-gray-600">View all products</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center"
                  onClick={() => window.open("https://developer.safaricom.co.ke/docs", "_blank")}
                >
                  <ExternalLink className="h-6 w-6 mb-2" />
                  <span className="font-semibold">M-Pesa Docs</span>
                  <span className="text-xs text-gray-600">API documentation</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
