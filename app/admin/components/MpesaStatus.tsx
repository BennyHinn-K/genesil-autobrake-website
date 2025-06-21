"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Smartphone, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function MpesaStatus() {
  const [status, setStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isTesting, setIsTesting] = useState(false)
  const { toast } = useToast()

  const checkStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/mpesa/validate")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Failed to check M-Pesa status:", error)
      toast({
        title: "Error",
        description: "Failed to check M-Pesa status",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testPayment = async () => {
    setIsTesting(true)
    try {
      const response = await fetch("/api/mpesa/test", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Test Payment Initiated",
          description: "Check your test phone for M-Pesa prompt",
        })
      } else {
        toast({
          title: "Test Failed",
          description: data.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Test Error",
        description: "Failed to initiate test payment",
        variant: "destructive",
      })
    } finally {
      setIsTesting(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <Card className="border-l-4 border-green-400">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-black">
          <div className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2" />
            M-Pesa Integration Status
          </div>
          <Button onClick={checkStatus} disabled={isLoading} variant="outline" size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status ? (
          <>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-black">Configuration Status</h4>
                <p className="text-gray-600 text-sm">M-Pesa API credentials validation</p>
              </div>
              <Badge className={status.isValid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {status.isValid ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Valid
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Invalid
                  </>
                )}
              </Badge>
            </div>

            {status.isValid && status.config && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800">Environment</h5>
                  <p className="text-blue-600 text-sm capitalize">{status.config.environment}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800">Short Code</h5>
                  <p className="text-blue-600 text-sm">{status.config.businessShortCode}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg col-span-2">
                  <h5 className="font-semibold text-blue-800">Callback URL</h5>
                  <p className="text-blue-600 text-sm break-all">{status.config.callbackUrl}</p>
                </div>
              </div>
            )}

            {status.isValid && (
              <div className="flex gap-2">
                <Button
                  onClick={testPayment}
                  disabled={isTesting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isTesting ? "Testing..." : "Test Payment (1 KES)"}
                </Button>
              </div>
            )}

            {!status.isValid && status.errors && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h5 className="font-semibold text-red-800 mb-2">Configuration Issues:</h5>
                <ul className="text-sm text-red-700 space-y-1">
                  {status.errors.map((error: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-600 mt-2">Checking M-Pesa status...</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
