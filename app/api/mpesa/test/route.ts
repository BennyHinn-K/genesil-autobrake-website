import { type NextRequest, NextResponse } from "next/server"
import { mpesaService } from "@/lib/mpesa"
import { getTestPaymentData } from "@/lib/mpesa-config"

export async function POST(request: NextRequest) {
  try {
    const testData = getTestPaymentData()

    console.log("Testing M-Pesa with data:", testData)

    const stkPushResponse = await mpesaService.initiateSTKPush({
      phoneNumber: testData.phoneNumber,
      amount: testData.amount,
      accountReference: testData.orderReference,
      transactionDesc: testData.description,
    })

    return NextResponse.json({
      success: true,
      message: "M-Pesa test payment initiated successfully",
      data: stkPushResponse,
      testData,
    })
  } catch (error) {
    console.error("M-Pesa test error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "M-Pesa test failed",
        error: String(error),
      },
      { status: 500 },
    )
  }
}
