import { type NextRequest, NextResponse } from "next/server"
import { mpesaService } from "@/lib/mpesa"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { checkoutRequestId } = body

    if (!checkoutRequestId) {
      return NextResponse.json({ error: "CheckoutRequestID is required" }, { status: 400 })
    }

    const queryResponse = await mpesaService.querySTKPushStatus(checkoutRequestId)
    return NextResponse.json(queryResponse)
  } catch (error) {
    console.error("Query STK Push error:", error)
    return NextResponse.json({ error: "Failed to query payment status" }, { status: 500 })
  }
}
