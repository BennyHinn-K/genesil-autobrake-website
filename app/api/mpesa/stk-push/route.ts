import { type NextRequest, NextResponse } from "next/server"
import { mpesaService } from "@/lib/mpesa"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, amount, orderReference } = body

    if (!phoneNumber || !amount || !orderReference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const stkPushResponse = await mpesaService.initiateSTKPush({
      phoneNumber,
      amount,
      accountReference: orderReference,
      transactionDesc: `Genesil Autospares - Order ${orderReference}`,
    })

    return NextResponse.json(stkPushResponse)
  } catch (error) {
    console.error("STK Push error:", error)
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 })
  }
}
