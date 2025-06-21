import { NextResponse } from "next/server"
import { productDB } from "@/lib/database"

// Force refresh of products (for real-time sync)
export async function POST() {
  try {
    const products = await productDB.getAllProducts()
    const stats = await productDB.getStats()

    return NextResponse.json({
      success: true,
      products,
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to sync products" }, { status: 500 })
  }
}
