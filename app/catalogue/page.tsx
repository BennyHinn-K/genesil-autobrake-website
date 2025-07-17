"use server"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProductCard from "@/app/components/ProductCard"
import type { Product } from "@/types"
import { supabase } from "@/lib/supabase"

const PAGE_SIZE = 12;

async function getProducts(page: number): Promise<{ products: Product[]; total: number; error?: string }> {
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, error, count } = await supabase
    .from("products")
    .select("id, sku, name, description, price, original_price, category, brand, stock_quantity, image, rating, review_count, featured, in_stock, features, tags, car_models, specifications, created_at, updated_at", { count: "exact" })
    .order("id", { ascending: false })
    .range(from, to);
  if (error) {
      console.error("Error fetching products:", error)
    return { products: [], total: 0, error: error.message }
  }
  // Map DB fields to Product type
  const products: Product[] = (data || []).map((item: any) => ({
    ...item,
    inStock: item.in_stock,
    stock: item.stock_quantity,
    reviews: item.review_count,
    originalPrice: item.original_price,
    stockQuantity: item.stock_quantity,
    reviewCount: item.review_count,
  }));
  return { products, total: count || 0 }
}

export default async function CataloguePage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const { products, total, error } = await getProducts(page);
  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Product Catalogue</h1>
          <p className="text-muted-foreground mt-1">Browse our selection of quality auto parts and accessories</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant="default" size="sm">All Products ({total})</Button>
        {categories.length > 0 && categories.map((category) => (
          <Button key={category} variant="outline" size="sm">{category} ({products.filter((p) => p.category === category).length})</Button>
        ))}
      </div>
      {error ? (
        <div className="text-red-600 text-center py-8">Error loading products: {error}</div>
      ) : products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-64 bg-muted/30" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {/* Pagination Controls */}
      <div className="flex justify-center gap-4 mt-8">
        <form method="get" action="/catalogue">
          <input type="hidden" name="page" value={page - 1} />
          <Button type="submit" variant="outline" size="sm" disabled={page <= 1}>
            Previous
          </Button>
        </form>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <form method="get" action="/catalogue">
          <input type="hidden" name="page" value={page + 1} />
          <Button type="submit" variant="outline" size="sm" disabled={page >= totalPages}>
            Next
          </Button>
        </form>
      </div>
    </div>
  )
}
