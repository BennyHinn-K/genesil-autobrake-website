"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Download, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react"

interface SyncLog {
  id: number
  timestamp: string
  action: string
  status: "success" | "error"
  message: string
  details?: any
}

export default function SyncManager() {
  const [isUploading, setIsUploading] = useState(false)
  const [syncResult, setSyncResult] = useState<any>(null)
  const [logs, setLogs] = useState<SyncLog[]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setSyncResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/sync", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()
      setSyncResult(result)

      if (result.success) {
        await fetchLogs()
      }
    } catch (error) {
      setSyncResult({ error: "Upload failed", details: error })
    } finally {
      setIsUploading(false)
    }
  }

  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/sync")
      const data = await response.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    }
  }

  const downloadSampleFile = (type: "json" | "csv") => {
    const link = document.createElement("a")
    link.href = `/sample-products.${type}`
    link.download = `sample-products.${type}`
    link.click()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Product Synchronization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => downloadSampleFile("json")} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download JSON Sample
            </Button>
            <Button variant="outline" onClick={() => downloadSampleFile("csv")} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download CSV Sample
            </Button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                {isUploading ? (
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400" />
                )}
                <p className="text-sm text-gray-600">
                  {isUploading ? "Uploading..." : "Click to upload JSON or CSV file"}
                </p>
              </div>
            </label>
          </div>

          {syncResult && (
            <div
              className={`p-4 rounded-lg ${syncResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <div className="flex items-center gap-2">
                {syncResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <p className={syncResult.success ? "text-green-800" : "text-red-800"}>
                  {syncResult.message || syncResult.error}
                </p>
              </div>
              {syncResult.stats && (
                <div className="mt-2 text-sm text-gray-600">
                  Created: {syncResult.stats.created}, Updated: {syncResult.stats.updated}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Sync Activity
            <Button variant="outline" size="sm" onClick={fetchLogs} className="ml-auto">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No sync activity yet</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  {log.status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">{log.message}</span>
                  <span className="text-xs text-gray-500 ml-auto">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
