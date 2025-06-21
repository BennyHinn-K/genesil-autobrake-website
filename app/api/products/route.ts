import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { supabase } from "@/lib/supabase"
import type { Product } from "@/types"

const DATA_FILE = path.join(process.cwd(), "data", "products.json")

async function readProducts() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeProducts(products: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf-8")
}

// GET products with filtering for featured products
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const isFeatured = searchParams.get("featured") === "true"

  if (!supabase) {
    return NextResponse.json({ success: false, error: "Database not configured" }, { status: 500 });
  }

  try {
    let query = supabase.from("products").select("*")

    if (isFeatured) {
      query = query.eq("featured", true)
    }

    const { data, error, status } = await query
      .order("created_at", { ascending: false })
      .limit(isFeatured ? 8 : 50) // Limit featured products

    if (error) {
      console.error("Supabase error:", error.message)
      throw new Error(`Supabase error: ${error.message} (status: ${status})`)
    }

    if (!data) {
      return NextResponse.json({ success: false, products: [], message: "No products found" }, { status: 404 })
    }

    // Map Supabase data to your application's Product type
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

    return NextResponse.json({ success: true, products })
  } catch (err) {
    console.error("API Error:", err)
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
    return NextResponse.json({ success: false, error: "Failed to fetch products", details: errorMessage }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    if (!productData.name || !productData.price) {
      return NextResponse.json({ error: "Product name and price are required" }, { status: 400 })
    }
    const products = await readProducts()
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    products.unshift(newProduct)
    await writeProducts(products)
    return NextResponse.json(newProduct)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
  }
}
