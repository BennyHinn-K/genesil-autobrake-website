import { NextResponse } from "next/server"
import { validateMpesaSetup, getMpesaConfig } from "@/lib/mpesa-config"

export async function GET() {
  try {
    const validation = validateMpesaSetup()

    if (validation.isValid) {
      const config = getMpesaConfig()
      return NextResponse.json({
        isValid: true,
        message: "M-Pesa configuration is valid",
        config: {
          environment: config.environment,
          businessShortCode: config.businessShortCode,
          callbackUrl: config.callbackUrl,
          hasConsumerKey: !!config.consumerKey,
          hasConsumerSecret: !!config.consumerSecret,
          hasPasskey: !!config.passkey,
        },
      })
    } else {
      return NextResponse.json({
        isValid: false,
        message: "M-Pesa configuration has issues",
        errors: validation.errors,
      })
    }
  } catch (error) {
    return NextResponse.json({
      isValid: false,
      message: "Failed to validate M-Pesa configuration",
      errors: [String(error)],
    })
  }
}
