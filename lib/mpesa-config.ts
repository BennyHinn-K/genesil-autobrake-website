export interface MpesaConfig {
  environment: "sandbox" | "production"
  consumerKey: string
  consumerSecret: string
  businessShortCode: string
  passkey: string
  callbackUrl: string
  baseUrl: string
}

export function getMpesaConfig(): MpesaConfig {
  const environment = (process.env.MPESA_ENVIRONMENT as "sandbox" | "production") || "sandbox"

  const consumerKey = process.env.MPESA_CONSUMER_KEY || ""
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET || ""
  const businessShortCode = process.env.MPESA_BUSINESS_SHORT_CODE || ""
  const passkey = process.env.MPESA_PASSKEY || ""
  const callbackUrl = process.env.MPESA_CALLBACK_URL || ""

  // Throw clear errors if any required variable is missing
  if (!consumerKey) throw new Error("MPESA_CONSUMER_KEY is required but not set. Please add it to your Vercel project settings.")
  if (!consumerSecret) throw new Error("MPESA_CONSUMER_SECRET is required but not set. Please add it to your Vercel project settings.")
  if (!businessShortCode) throw new Error("MPESA_BUSINESS_SHORT_CODE is required but not set. Please add it to your Vercel project settings.")
  if (!passkey) throw new Error("MPESA_PASSKEY is required but not set. Please add it to your Vercel project settings.")
  if (!callbackUrl) throw new Error("MPESA_CALLBACK_URL is required but not set. Please add it to your Vercel project settings.")

  return {
    environment,
    consumerKey,
    consumerSecret,
    businessShortCode,
    passkey,
    callbackUrl,
    baseUrl: environment === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke",
  }
}

export function validateMpesaSetup(): { isValid: boolean; errors: string[] } {
  const config = getMpesaConfig()
  const errors: string[] = []

  if (!config.consumerKey) errors.push("MPESA_CONSUMER_KEY is required")
  if (!config.consumerSecret) errors.push("MPESA_CONSUMER_SECRET is required")
  if (!config.businessShortCode) errors.push("MPESA_BUSINESS_SHORT_CODE is required")
  if (!config.passkey) errors.push("MPESA_PASSKEY is required")
  if (!config.callbackUrl) errors.push("MPESA_CALLBACK_URL is required")

  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function getSecurityCredential(): string {
  return (
    process.env.MPESA_SECURITY_CREDENTIAL ||
    "KeR49eLD1qvDEl/t3nWTPZqv0B7nx3yYfdHj+3CJok/Uvm33exZCvXqg7Q/jvMf9likdurT9tBjF4tuHQuZwhL+Elm63Z+W60uW/C7lSEnpkyTEtc1sov3mM1ubFonDNm/T6C7X+RXI2GKH3UDaKvDDXV0W/HBiQaMtwFCgUc8RzJQuZU43Mj9wULT7YDxT8c4hE/oniK+qnG8ATbhaESdkBtzigrNkgHmMlmS+KwGN8MkTYfIIZKExImlskJ8aoag5TsWWECIBUIOcqtAUfPtfm5nssOAEoS2uIXGtdw4lZ2ccOP3Ms4hmr7Vuhva9uSssyDfzu4VbtuYznErryWw=="
  )
}

export function getTestPaymentData() {
  return {
    phoneNumber: "254708374149",
    amount: 1,
    orderReference: `TEST-${Date.now()}`,
    description: "Genesil Autobrake - Test Payment",
  }
}
