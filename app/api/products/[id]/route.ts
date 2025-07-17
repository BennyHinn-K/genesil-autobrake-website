import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import type { Product } from "@/types"

// Helper to map Supabase row to Product type
function mapProduct(item: any): Product {
  return {
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
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "CRITICAL: Server database connection is not configured." }, { status: 500 })
  }
  try {
    const { data, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .eq("id", params.id)
      .single()
    if (error || !data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(mapProduct(data))
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "CRITICAL: Server database connection is not configured." }, { status: 500 })
  }
  try {
    const updates = await request.json()
    // Map frontend fields to DB fields
    const updateData = {
      sku: updates.sku,
      name: updates.name,
      description: updates.description || null,
      price: updates.price,
      original_price: updates.originalPrice || null,
      category: updates.category,
      brand: updates.brand || null,
      image: updates.image || null,
      images: updates.images || null,
      stock_quantity: updates.stockQuantity ?? updates.stock ?? 0,
      rating: updates.rating || 0,
      review_count: updates.reviewCount || updates.reviews || 0,
      features: updates.features || null,
      specifications: updates.specifications || null,
      tags: updates.tags || null,
      car_models: updates.carModels || null,
      in_stock: updates.inStock ?? true,
      featured: true, // Always featured
      updated_at: new Date().toISOString(),
    }
    const { data, error } = await supabaseAdmin
      .from("products")
      .update(updateData)
      .eq("id", params.id)
      .select("*")
      .single()
    if (error || !data) {
      console.error("Supabase error updating product:", error)
      return NextResponse.json({ error: "Product not found or failed to update", details: error?.message }, { status: 404 })
    }
    return NextResponse.json(mapProduct(data))
  } catch (error) {
    console.error("API Error (PUT /api/products/[id]):", error)
    return NextResponse.json({ error: "Failed to update product", details: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "CRITICAL: Server database connection is not configured." }, { status: 500 })
  }
  try {
    const { error } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("id", params.id)
    if (error) {
      return NextResponse.json({ error: "Product not found or failed to delete" }, { status: 404 })
    }
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
