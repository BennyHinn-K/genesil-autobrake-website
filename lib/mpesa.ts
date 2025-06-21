import { getMpesaConfig } from "./mpesa-config"

export interface STKPushRequest {
  phoneNumber: string
  amount: number
  accountReference: string
  transactionDesc: string
}

export interface STKPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

class MpesaService {
  private config = getMpesaConfig()

  private async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.config.consumerKey}:${this.config.consumerSecret}`).toString("base64")

    const response = await fetch(`${this.config.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`)
    }

    const data = await response.json()
    return data.access_token
  }

  private generateTimestamp(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hour = String(now.getHours()).padStart(2, "0")
    const minute = String(now.getMinutes()).padStart(2, "0")
    const second = String(now.getSeconds()).padStart(2, "0")

    return `${year}${month}${day}${hour}${minute}${second}`
  }

  private generatePassword(): string {
    const timestamp = this.generateTimestamp()
    const password = Buffer.from(`${this.config.businessShortCode}${this.config.passkey}${timestamp}`).toString(
      "base64",
    )
    return password
  }

  async initiateSTKPush(request: STKPushRequest): Promise<STKPushResponse> {
    try {
      const accessToken = await this.getAccessToken()
      const timestamp = this.generateTimestamp()
      const password = this.generatePassword()

      // Format phone number (ensure it starts with 254)
      let phoneNumber = request.phoneNumber.replace(/^\+/, "")
      if (phoneNumber.startsWith("0")) {
        phoneNumber = "254" + phoneNumber.substring(1)
      }
      if (!phoneNumber.startsWith("254")) {
        phoneNumber = "254" + phoneNumber
      }

      const stkPushPayload = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: request.amount,
        PartyA: phoneNumber,
        PartyB: this.config.businessShortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: this.config.callbackUrl,
        AccountReference: request.accountReference,
        TransactionDesc: request.transactionDesc,
      }

      console.log("STK Push Payload:", JSON.stringify(stkPushPayload, null, 2))

      const response = await fetch(`${this.config.baseUrl}/mpesa/stkpush/v1/processrequest`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPushPayload),
      })

      const responseData = await response.json()
      console.log("STK Push Response:", JSON.stringify(responseData, null, 2))

      if (!response.ok) {
        throw new Error(`STK Push failed: ${responseData.errorMessage || response.statusText}`)
      }

      return responseData
    } catch (error) {
      console.error("STK Push Error:", error)
      throw error
    }
  }

  async querySTKPushStatus(checkoutRequestId: string): Promise<any> {
    try {
      const accessToken = await this.getAccessToken()
      const timestamp = this.generateTimestamp()
      const password = this.generatePassword()

      const queryPayload = {
        BusinessShortCode: this.config.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }

      const response = await fetch(`${this.config.baseUrl}/mpesa/stkpushquery/v1/query`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(queryPayload),
      })

      const responseData = await response.json()
      console.log("STK Query Response:", JSON.stringify(responseData, null, 2))

      return responseData
    } catch (error) {
      console.error("STK Query Error:", error)
      throw error
    }
  }
}

export const mpesaService = new MpesaService()
