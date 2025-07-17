import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ShoppingCart, Star, AlertCircle } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/types"
import { supabase } from "@/lib/supabase"
import { AddToCartButton, AddToCartIconButton } from "./AddToCartButton"


// Fetch featured products from the database
async function getFeaturedProducts(): Promise<{ products: Product[] | null, error: string | null }> {
  if (!supabase) {
    const errorMessage = "Database connection is not configured correctly."
    console.error(`CRITICAL: ${errorMessage}`)
    return { products: null, error: errorMessage }
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(8)

    if (error) {
      console.error("Supabase error fetching featured products:", error)
      return { products: null, error: `Database error: ${error.message}` }
    }

    const products: Product[] = data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      originalPrice: item.original_price,
      category: item.category,
      brand: item.brand,
      stock: item.stock_quantity,
      stockQuantity: item.stock_quantity,
      image: item.image,
      images: item.images,
      rating: item.rating,
      reviews: item.review_count,
      reviewCount: item.review_count,
      featured: item.featured,
      sku: item.sku,
      inStock: item.in_stock,
      features: item.features,
      tags: item.tags,
      carModels: item.car_models,
      specifications: item.specifications,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }))

    return { products, error: null }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "An unknown server error occurred."
    console.error("Error in getFeaturedProducts:", errorMessage)
    return { products: null, error: errorMessage }
  }
}

export default async function FeaturedProducts() {
  const { products: featuredProducts, error } = await getFeaturedProducts();

  if (error) {
    return (
       <section className="py-12 bg-red-50 dark:bg-red-900/10">
        <div className="container px-4 md:px-6">
          <div className="text-center py-8 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200">Failed to Load Products</h3>
            <p className="text-red-600 dark:text-red-300 max-w-md mx-auto">We couldn't retrieve the featured products from the database.</p>
            <p className="text-xs text-red-500 mt-2 font-mono bg-red-50 dark:bg-red-900/30 p-2 rounded">{error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
          </div>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No featured products have been configured yet.</p>
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
          </div>
          <Link href="/catalogue">
            <Button variant="link" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card">
              <div className="relative overflow-hidden">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800">
                  <img
                    src={product.image || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.featured && <Badge className="bg-yellow-500 text-black text-xs">Featured</Badge>}
                  {!product.inStock && <Badge variant="destructive" className="text-xs">Out of Stock</Badge>}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <Badge variant="secondary" className="text-xs">
                      Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" className="h-8 w-8 p-0"><Star className="h-4 w-4" /></Button>
                  <AddToCartIconButton product={product} />
                </div>
              </div>
              <CardContent className="p-4 space-y-3">
                {product.brand && <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.brand}</div>}
                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-yellow-600 transition-colors">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                
                {product.rating && product.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount || product.reviews || 0})</span>
                  </div>
                )}
                
                {product.carModels && product.carModels.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.carModels.slice(0, 2).map((model) => (
                      <Badge key={model} variant="outline" className="text-xs">{model}</Badge>
                    ))}
                    {product.carModels.length > 2 && <Badge variant="outline" className="text-xs">+{product.carModels.length - 2} more</Badge>}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(product.price)}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      {new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 0 }).format(product.originalPrice)}
                    </span>
                  )}
                </div>

                <div className="text-sm">
                  {product.inStock ? (
                    <span className="text-green-600 dark:text-green-400">✓ In Stock {product.stockQuantity && `(${product.stockQuantity} available)`}</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">✗ Out of Stock</span>
                  )}
                </div>

                <AddToCartButton product={product} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
