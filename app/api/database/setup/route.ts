import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin client not configured" }, { status: 500 })
    }

    // Test connection
    const { data, error } = await supabaseAdmin.from("products").select("count", { count: "exact", head: true })

    if (error) {
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: error.message,
          setup: false,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      setup: true,
      productCount: data || 0,
    })
  } catch (error) {
    console.error("Database setup error:", error)
    return NextResponse.json(
      {
        error: "Database setup failed",
        details: error instanceof Error ? error.message : "Unknown error",
        setup: false,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({
        configured: false,
        message: "Supabase admin not configured",
      })
    }

    // Check if tables exist and get basic stats
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("count", { count: "exact", head: true })

    const { data: orders, error: ordersError } = await supabaseAdmin
      .from("orders")
      .select("count", { count: "exact", head: true })

    const { data: syncLogs, error: syncError } = await supabaseAdmin
      .from("sync_logs")
      .select("count", { count: "exact", head: true })

    return NextResponse.json({
      configured: true,
      tables: {
        products: {
          exists: !productsError,
          count: products || 0,
          error: productsError?.message,
        },
        orders: {
          exists: !ordersError,
          count: orders || 0,
          error: ordersError?.message,
        },
        sync_logs: {
          exists: !syncError,
          count: syncLogs || 0,
          error: syncError?.message,
        },
      },
    })
  } catch (error) {
    return NextResponse.json({
      configured: false,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
