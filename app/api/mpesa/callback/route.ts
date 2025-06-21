import { type NextRequest, NextResponse } from "next/server"

// No React imports or hooks should be present in this API route.

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Log the callback for debugging
    console.log("M-Pesa Callback:", JSON.stringify(body, null, 2))

    // Extract payment details
    const { Body } = body
    const { stkCallback } = Body

    if (stkCallback) {
      const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc } = stkCallback

      if (ResultCode === 0) {
        // Payment successful
        const { CallbackMetadata } = stkCallback
        const metadata = CallbackMetadata?.Item || []

        const paymentDetails = {
          merchantRequestId: MerchantRequestID,
          checkoutRequestId: CheckoutRequestID,
          amount: metadata.find((item: any) => item.Name === "Amount")?.Value,
          mpesaReceiptNumber: metadata.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value,
          transactionDate: metadata.find((item: any) => item.Name === "TransactionDate")?.Value,
          phoneNumber: metadata.find((item: any) => item.Name === "PhoneNumber")?.Value,
        }

        console.log("Payment successful:", paymentDetails)
        // Here you would update your database with the payment status
      } else {
        console.log("Payment failed:", { MerchantRequestID, CheckoutRequestID, ResultDesc })
      }
    }

    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" })
  } catch (error) {
    console.error("Callback processing error:", error)
    return NextResponse.json({ ResultCode: 1, ResultDesc: "Error processing callback" })
  }
}
