import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json()

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: "Invalid products data" }, { status: 400 })
    }

    const db = getDatabase()

    // Log sync start
    await db.addSyncLog({
      action: "sync",
      status: "success",
      message: `Starting sync of ${products.length} products`,
    })

    const result = await db.bulkUpsert(products)

    // Log sync completion
    await db.addSyncLog({
      action: "sync",
      status: "success",
      message: `Sync completed: ${result.created} created, ${result.updated} updated`,
      details: result,
    })

    return NextResponse.json({
      success: true,
      message: `Sync completed successfully`,
      ...result,
    })
  } catch (error) {
    console.error("Sync error:", error)

    const db = getDatabase()
    await db.addSyncLog({
      action: "sync",
      status: "error",
      message: `Sync failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      details: { error: error instanceof Error ? error.message : error },
    })

    return NextResponse.json(
      { error: "Sync failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const db = getDatabase()
    const logs = await db.getSyncLogs()

    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Error fetching sync logs:", error)
    return NextResponse.json({ error: "Failed to fetch sync logs" }, { status: 500 })
  }
}
