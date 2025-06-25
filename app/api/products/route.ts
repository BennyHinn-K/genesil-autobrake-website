import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"
import { supabaseAdmin } from "@/lib/supabase"
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

  if (!supabaseAdmin) {
    // This is a critical error. It means the service role key is missing on the server.
    return NextResponse.json(
      { 
        success: false, 
        error: "CRITICAL: Server database connection is not configured. The SUPABASE_SERVICE_ROLE_KEY environment variable is missing." 
      }, 
      { status: 500 }
    );
  }

  try {
    let query = supabaseAdmin.from("products").select("*")

    if (isFeatured) {
      query = query.eq("featured", true)
    }

    const { data, error, status } = await query
      .order("created_at", { ascending: false })
      .limit(isFeatured ? 8 : 50) // Limit featured products

    if (error) {
      console.error("Supabase admin error:", error)
      return NextResponse.json({ 
        success: false, 
        error: "A database error occurred.", 
        details: `DATABASE ERROR: ${error.message} (Code: ${error.code})`,
        hint: error.hint
      }, { status: 500 });
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
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "CRITICAL: Server database connection is not configured." }, { status: 500 })
  }
  try {
    const productData = await request.json()
    if (!productData.name || !productData.price) {
      return NextResponse.json({ error: "Product name and price are required" }, { status: 400 })
    }

    // Prepare insert object for Supabase
    const insertData = {
      sku: productData.sku,
      name: productData.name,
      description: productData.description || null,
      price: productData.price,
      original_price: productData.originalPrice || null,
      category: productData.category,
      brand: productData.brand || null,
      image: productData.image || null,
      images: productData.images || null,
      stock_quantity: productData.stockQuantity ?? productData.stock ?? 0,
      rating: productData.rating || 0,
      review_count: productData.reviewCount || productData.reviews || 0,
      features: productData.features || null,
      specifications: productData.specifications || null,
      tags: productData.tags || null,
      car_models: productData.carModels || null,
      in_stock: productData.inStock ?? true,
      featured: productData.featured ?? false,
    }

    const { data, error } = await supabaseAdmin
      .from("products")
      .insert([insertData])
      .select("*")
      .single()

    if (error || !data) {
      console.error("Supabase error creating product:", error)
      return NextResponse.json({ error: "Failed to create product", details: error?.message }, { status: 500 })
    }

    // Map to Product type
    const newProduct: Product = {
      id: data.id,
      name: data.name,
      description: data.description,
      price: data.price,
      originalPrice: data.original_price,
      category: data.category,
      brand: data.brand,
      stock: data.stock_quantity,
      stockQuantity: data.stock_quantity,
      image: data.image,
      images: data.images,
      rating: data.rating,
      reviews: data.review_count,
      reviewCount: data.review_count,
      featured: data.featured,
      sku: data.sku,
      inStock: data.in_stock,
      features: data.features,
      tags: data.tags,
      carModels: data.car_models,
      specifications: data.specifications,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json(newProduct)
  } catch (error) {
    console.error("API Error (POST /api/products):", error)
    return NextResponse.json({ error: "Failed to add product", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}
