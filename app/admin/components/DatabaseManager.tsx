"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, RefreshCw, CheckCircle, XCircle, AlertTriangle, Package, TrendingUp, Activity } from "lucide-react"

interface DatabaseStats {
  configured: boolean
  tables?: {
    products: { exists: boolean; count: number; error?: string }
    orders: { exists: boolean; count: number; error?: string }
    sync_logs: { exists: boolean; count: number; error?: string }
  }
  error?: string
}

interface ProductStats {
  totalProducts: number
  totalValue: number
  lowStockProducts: number
  outOfStockProducts: number
  featuredProducts: number
  categoryCounts: Record<string, number>
}

export default function DatabaseManager() {
  const [stats, setStats] = useState<DatabaseStats | null>(null)
  const [productStats, setProductStats] = useState<ProductStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [seeding, setSeeding] = useState(false)
  const [testing, setTesting] = useState(false)

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/database/setup")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error fetching database stats:", error)
      setStats({ configured: false, error: "Failed to fetch stats" })
    } finally {
      setLoading(false)
    }
  }

  const fetchProductStats = async () => {
    try {
      const response = await fetch("/api/products/stats")
      if (response.ok) {
        const data = await response.json()
        setProductStats(data)
      }
    } catch (error) {
      console.error("Error fetching product stats:", error)
    }
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      const response = await fetch("/api/database/setup", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        alert("Database connection successful!")
      } else {
        alert(`Connection failed: ${data.error}`)
      }
    } catch (error) {
      alert("Connection test failed")
    } finally {
      setTesting(false)
    }
  }

  const seedDatabase = async () => {
    setSeeding(true)
    try {
      const response = await fetch("/api/database/seed", { method: "POST" })
      const data = await response.json()

      if (data.success) {
        alert(`Database seeded successfully! Added ${data.products} products.`)
        fetchStats()
        fetchProductStats()
      } else {
        alert(`Seeding failed: ${data.error}`)
      }
    } catch (error) {
      alert("Database seeding failed")
    } finally {
      setSeeding(false)
    }
  }

  useEffect(() => {
    fetchStats()
    fetchProductStats()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Loading database information...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Database Management</h2>
          <p className="text-muted-foreground">Monitor and manage your Supabase database</p>
        </div>
        <Button onClick={fetchStats} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database Status</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {stats?.configured ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-600">Not Connected</span>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.tables?.products?.count || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.tables?.orders?.count || 0}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sync Logs</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.tables?.sync_logs?.count || 0}</div>
              </CardContent>
            </Card>
          </div>

          {!stats?.configured && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Supabase is not configured. Please set up your environment variables:
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>SUPABASE_SERVICE_ROLE_KEY</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          {/* Placeholder for tables content */}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {/* Placeholder for analytics content */}
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          {/* Placeholder for actions content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
