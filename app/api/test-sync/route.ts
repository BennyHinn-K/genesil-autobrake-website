import { NextResponse } from "next/server"

// Mock database for testing
const testProducts: any[] = []

export async function POST() {
  try {
    // Simulate loading sample data
    const sampleData = {
      products: [
        {
          sku: "TEST-001",
          name: "Test Brake Disc",
          price: 25000,
          originalPrice: 30000,
          category: "Brake Discs",
          brand: "Genesil Test",
          description: "Test product for sync functionality",
          rating: 4.5,
          reviews: 10,
          inStock: true,
        },
        {
          sku: "TEST-002",
          name: "Test Brake Pads",
          price: 15000,
          originalPrice: 18000,
          category: "Brake Pads",
          brand: "Genesil Test",
          description: "Another test product",
          rating: 4.7,
          reviews: 25,
          inStock: true,
        },
      ],
    }

    // Simulate sync process
    const syncResults = {
      created: 0,
      updated: 0,
      deleted: 0,
      errors: [],
    }

    // Process each product
    for (const product of sampleData.products) {
      const existingIndex = testProducts.findIndex((p) => p.sku === product.sku)

      if (existingIndex >= 0) {
        // Update existing product
        testProducts[existingIndex] = { ...testProducts[existingIndex], ...product }
        syncResults.updated++
      } else {
        // Create new product
        testProducts.push({ ...product, id: Date.now() + Math.random() })
        syncResults.created++
      }
    }

    // Remove products not in source (for testing, we'll skip this)
    // In real implementation, this would remove products not in the uploaded file

    return NextResponse.json({
      success: true,
      message: `Sync test completed successfully. Created: ${syncResults.created}, Updated: ${syncResults.updated}`,
      results: syncResults,
      totalProducts: testProducts.length,
    })
  } catch (error) {
    console.error("Sync test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Sync test failed",
        error: String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    products: testProducts,
    count: testProducts.length,
  })
}
