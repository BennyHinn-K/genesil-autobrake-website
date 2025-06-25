"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import { useCart } from "@/app/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()

  const handleAddToCart = async () => {
    if (!product.inStock) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        sku: product.sku,
        product: product,
      })

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border bg-card">
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 dark:bg-gray-800">
          <img
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg?height=300&width=300"
            }}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.featured && <Badge className="bg-yellow-500 text-black text-xs">Featured</Badge>}
          {!product.inStock && (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <Badge variant="secondary" className="text-xs">
              Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Brand */}
        {product.brand && (
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{product.brand}</div>
        )}

        {/* Product Name */}
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-yellow-600 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex">{renderStars(product.rating)}</div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount || product.reviews || 0})
            </span>
          </div>
        )}

        {/* Compatible Models */}
        {product.carModels && product.carModels.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.carModels.slice(0, 2).map((model) => (
              <Badge key={model} variant="outline" className="text-xs">
                {model}
              </Badge>
            ))}
            {product.carModels.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{product.carModels.length - 2} more
              </Badge>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        {/* Stock Status */}
        <div className="text-sm">
          {product.inStock ? (
            <span className="text-green-600 dark:text-green-400">
              ✓ In Stock {product.stockQuantity && `(${product.stockQuantity} available)`}
            </span>
          ) : (
            <span className="text-red-600 dark:text-red-400">✗ Out of Stock</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isLoading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
        >
          {isLoading ? (
            <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
          ) : (
            <ShoppingCart className="h-4 w-4 mr-2" />
          )}
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </CardContent>
    </Card>
  )
}
