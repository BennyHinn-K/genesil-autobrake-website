"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, RefreshCw, ShoppingCart } from "lucide-react"
import ProductCard from "@/app/components/ProductCard"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products?_=${Date.now()}`)
      if (!response.ok) throw new Error("Failed to fetch products")

      const data = await response.json()
      const productList = (data.products || []) as Product[]

      setProducts(productList)
      setFilteredProducts(productList)

      const uniqueCategories = Array.from(new Set(productList.map((p) => p.category)))
      setCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
    // Removed setInterval to prevent constant refreshing
  }, [])

  useEffect(() => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.tags && product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))),
      )
    }

    if (activeCategory !== "all") {
      filtered = filtered.filter((product) => product.category === activeCategory)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, activeCategory])

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Product Catalogue</h1>
          <p className="text-muted-foreground mt-1">Browse our selection of quality auto parts and accessories</p>
        </div>
        <Button onClick={fetchProducts} variant="outline" className="flex items-center gap-2">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="bg-muted/30 p-4 rounded-lg mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products, brands, or parts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          onClick={() => setActiveCategory("all")}
          size="sm"
        >
          All Products ({products.length})
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            onClick={() => setActiveCategory(category)}
            size="sm"
          >
            {category} ({products.filter((p) => p.category === category).length})
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner />
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              {searchTerm
                ? "Try adjusting your search or browse all products"
                : "There are no products in this category yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
