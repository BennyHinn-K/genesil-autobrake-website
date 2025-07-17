import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Prevent build-time errors if env vars are missing
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Supabase environment variables are missing. Please set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY in your Vercel project settings.");
}

const sampleProducts = [
  {
    sku: "GEN-BP-001",
    name: "Premium Brake Pads Set",
    description:
      "High-performance ceramic brake pads for superior stopping power and durability. Compatible with most vehicle models.",
    price: 4500,
    original_price: 5000,
    category: "Brake Systems",
    brand: "Genesil Pro",
    image: "/placeholder.svg?height=300&width=300",
    stock_quantity: 25,
    rating: 4.8,
    review_count: 124,
    featured: true,
    in_stock: true,
    features: ["Ceramic compound", "Low dust", "Quiet operation"],
    tags: ["brake", "pads", "ceramic"],
    car_models: ["Toyota Corolla", "Honda Civic", "Nissan Sentra"],
    specifications: { Material: "Ceramic", Warranty: "2 years" },
  },
  {
    sku: "GEN-OF-001",
    name: "Oil Filter - Universal",
    description: "Premium oil filter for engine protection and optimal performance. Fits most car models.",
    price: 850,
    category: "Engine Parts",
    brand: "FilterMax",
    image: "/placeholder.svg?height=300&width=300",
    stock_quantity: 50,
    rating: 4.6,
    review_count: 89,
    featured: true,
    in_stock: true,
    features: ["High filtration", "Long lasting", "Universal fit"],
    tags: ["oil", "filter", "engine"],
    car_models: ["Toyota Camry", "Honda Accord", "Nissan Altima"],
    specifications: { Type: "Spin-on", Thread: "3/4-16 UNF" },
  },
  {
    sku: "GEN-AF-001",
    name: "Air Filter - High Performance",
    description: "Premium air filter for improved engine performance and fuel efficiency.",
    price: 1200,
    category: "Engine Parts",
    brand: "AirMax Pro",
    image: "/placeholder.svg?height=300&width=300",
    stock_quantity: 30,
    rating: 4.7,
    review_count: 67,
    featured: true,
    in_stock: true,
    features: ["High flow", "Washable", "Long lasting"],
    tags: ["air", "filter", "performance"],
    car_models: ["Toyota Camry", "Honda Civic", "Nissan Altima"],
    specifications: { Type: "Panel", Material: "Cotton gauze" },
  },
  {
    sku: "GEN-SP-001",
    name: "Spark Plugs Set",
    description: "High-quality spark plugs for optimal engine performance and fuel efficiency.",
    price: 2800,
    category: "Engine Parts",
    brand: "IgniteMax",
    image: "/placeholder.svg?height=300&width=300",
    stock_quantity: 40,
    rating: 4.9,
    review_count: 156,
    featured: true,
    in_stock: true,
    features: ["Iridium tip", "Long life", "Better ignition"],
    tags: ["spark", "plugs", "ignition"],
    car_models: ["Toyota Corolla", "Honda Civic", "Nissan Sentra"],
    specifications: { Gap: "0.8mm", Thread: "14mm" },
  },
  {
    sku: "GEN-BR-001",
    name: "Brake Rotors - Front Set",
    description: "High-quality brake rotors for improved braking performance and safety.",
    price: 8500,
    original_price: 9500,
    category: "Brake Systems",
    brand: "Genesil Pro",
    image: "/placeholder.svg?height=300&width=300",
    stock_quantity: 15,
    rating: 4.7,
    review_count: 78,
    featured: false,
    in_stock: true,
    features: ["Vented design", "Heat resistant", "Long lasting"],
    tags: ["brake", "rotors", "front"],
    car_models: ["Toyota Camry", "Honda Accord", "Nissan Altima"],
    specifications: { Diameter: "320mm", Thickness: "28mm" },
  },
  {
    sku: "GEN-SH-001",
    name: "Shock Absorbers - Rear Pair",
    description: "Premium shock absorbers for smooth ride and improved handling.",
    price: 12000,
    category: "Suspension",
    brand: "RideMax",
    image: "/placeholder.svg?height=300&width=300",
    stock_quantity: 20,
    rating: 4.6,
    review_count: 92,
    featured: false,
    in_stock: true,
    features: ["Gas filled", "Adjustable", "Corrosion resistant"],
    tags: ["shock", "absorbers", "suspension"],
    car_models: ["Toyota Corolla", "Honda Civic", "Nissan Sentra"],
    specifications: { Type: "Twin-tube", Length: "350mm" },
  },
]

export async function POST() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin client not configured" }, { status: 500 })
    }

    // Insert sample products
    const { data, error } = await supabaseAdmin.from("products").upsert(sampleProducts, { onConflict: "sku" }).select()

    if (error) {
      console.error("Error seeding database:", error)
      return NextResponse.json({ error: "Failed to seed database", details: error.message }, { status: 500 })
    }

    // Add a sync log entry
    await supabaseAdmin.from("sync_logs").insert([
      {
        action: "seed",
        status: "success",
        message: `Database seeded with ${sampleProducts.length} sample products`,
        details: { productCount: data?.length || 0 },
      },
    ])

    return NextResponse.json({
      success: true,
      message: `Successfully seeded database with ${data?.length || 0} products`,
      products: data?.length || 0,
    })
  } catch (error) {
    console.error("Database seed error:", error)
    return NextResponse.json(
      {
        error: "Database seeding failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
