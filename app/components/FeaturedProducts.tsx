"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ShoppingCart, Star, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"
import { useCart } from "../context/CartContext"

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Add cache busting and timeout
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(`/api/products?featured=true&_=${Date.now()}`, {
          signal: controller.signal,
          headers: {
            "Cache-Control": "no-cache",
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success === false && data.fallback) {
          setIsFallback(true)
          toast({
            title: "Using Cached Data",
            description: "Database temporarily unavailable, showing cached products",
            variant: "default",
          })
        }

        setFeaturedProducts(Array.isArray(data.products) ? data.products : [])
      } catch (error) {
        console.error("Error fetching featured products:", error)
        setError(error instanceof Error ? error.message : "Failed to load products")

        // Set fallback products directly if API fails completely
        const fallbackProducts = [
          {
            id: "1",
            name: "Premium Brake Pads Set",
            description: "High-performance ceramic brake pads for superior stopping power and durability.",
            price: 4500,
            originalPrice: 5000,
            category: "Brake Systems",
            brand: "Genesil Pro",
            stock: 25,
            stockQuantity: 25,
            image: "/placeholder.svg?height=300&width=300",
            rating: 4.8,
            reviews: 124,
            reviewCount: 124,
            featured: true,
            sku: "GEN-BP-001",
            inStock: true,
            features: ["Ceramic compound", "Low dust", "Quiet operation"],
            tags: ["brake", "pads", "ceramic"],
            carModels: ["Toyota Corolla", "Honda Civic", "Nissan Sentra"],
            specifications: { Material: "Ceramic", Warranty: "2 years" },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: "2",
            name: "Oil Filter - Universal",
            description: "Premium oil filter for engine protection and optimal performance.",
            price: 850,
            category: "Engine Parts",
            brand: "FilterMax",
            stock: 50,
            stockQuantity: 50,
            image: "/placeholder.svg?height=300&width=300",
            rating: 4.6,
            reviews: 89,
            reviewCount: 89,
            featured: true,
            sku: "GEN-OF-001",
            inStock: true,
            features: ["High filtration", "Long lasting", "Universal fit"],
            tags: ["oil", "filter", "engine"],
            carModels: ["Toyota Camry", "Honda Accord", "Nissan Altima"],
            specifications: { Type: "Spin-on", Thread: "3/4-16 UNF" },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]

        setFeaturedProducts(fallbackProducts)
        setIsFallback(true)

        toast({
          title: "Connection Error",
          description: "Showing sample products. Please check your connection.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProducts()

    // Set up polling to check for product updates every 30 seconds
    const intervalId = setInterval(fetchFeaturedProducts, 30000)

    return () => clearInterval(intervalId)
  }, [toast])

  const handleAddToCart = (product: Product) => {
    addToCart(product)
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    })
  }

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-6 bg-muted rounded w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (featuredProducts.length === 0 && !loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
          </div>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No featured products available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Featured Products</h2>
            {isFallback && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Showing cached data
              </p>
            )}
          </div>
          <Link href="/catalogue">
            <Button variant="link" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg">
              <CardContent className="p-0">
                <Link href={`/catalogue/${product.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg?height=300&width=300"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg?height=300&width=300"
                      }}
                    />
                    {product.featured && (
                      <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">Featured</Badge>
                    )}
                  </div>
                </Link>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{product.category}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm ml-1">{product.rating || 4.5}</span>
                    </div>
                  </div>
                  <Link href={`/catalogue/${product.id}`}>
                    <h3 className="font-semibold text-lg hover:text-yellow-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="font-bold">KES {product.price.toLocaleString()}</div>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    >
                      <ShoppingCart className="h-4 w-4 mr-1" />
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
