"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, ExternalLink, Copy } from "lucide-react"

export default function MpesaSetupGuide() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const currentStatus = {
    consumerKey: true,
    consumerSecret: true,
    shortcode: false, // User's shortcode is N/A
    securityCredential: true,
  }

  const nextSteps = [
    {
      step: 1,
      title: "Apply for M-Pesa Business Shortcode",
      description: "Contact Safaricom to get your business shortcode",
      status: "pending",
      action: "Visit Safaricom Business Portal",
    },
    {
      step: 2,
      title: "Complete Business Verification",
      description: "Submit required business documents",
      status: "pending",
      action: "Prepare business documents",
    },
    {
      step: 3,
      title: "Get Production Credentials",
      description: "Receive your production shortcode and passkey",
      status: "pending",
      action: "Wait for approval",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            M-Pesa Integration Status
          </CardTitle>
          <CardDescription>Current setup status and next steps for full M-Pesa integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Consumer Key</span>
                {currentStatus.consumerKey ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge variant="destructive">Missing</Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span>Consumer Secret</span>
                {currentStatus.consumerSecret ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge variant="destructive">Missing</Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span>Business Shortcode</span>
                {currentStatus.shortcode ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span>Security Credential</span>
                {currentStatus.securityCredential ? (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                ) : (
                  <Badge variant="destructive">Missing</Badge>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Current Mode:</strong> Development/Testing
                  <br />
                  <strong>Status:</strong> Using sandbox environment with test shortcode
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Next Steps for Production</CardTitle>
          <CardDescription>Follow these steps to complete your M-Pesa integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nextSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-semibold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {step.action}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>Your current M-Pesa credentials (development mode)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm">Consumer Key:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard("P21E0cyHMVbTtCuQuOabYiaPGq3H23vsyphkoQFgUQ0ipsTC")}
              >
                <Copy className="h-3 w-3" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <code className="text-xs break-all">P21E0cyHMVbTtCuQuOabYiaPGq3H23vsyphkoQFgUQ0ipsTC</code>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Currently using test shortcode (600000) for development. Replace with your
              actual business shortcode when approved by Safaricom.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Get help with M-Pesa integration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-semibold">Safaricom Business Support</p>
              <p className="text-sm text-gray-600">For shortcode applications and technical support</p>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3 w-3 mr-1" />
              Contact
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-semibold">Developer Portal</p>
              <p className="text-sm text-gray-600">Access documentation and test your integration</p>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3 w-3 mr-1" />
              Visit Portal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
