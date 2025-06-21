export interface Product {
  id: string
  sku: string
  name: string
  price: number
  originalPrice?: number
  category: string
  brand?: string
  description: string
  image?: string
  images?: string[]
  stockQuantity?: number
  rating?: number
  reviewCount?: number
  features?: string[]
  specifications?: Record<string, string>
  tags?: string[]
  carModels?: string[]
  inStock: boolean
  stock: number
  featured?: boolean
  reviews: number
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  name: string
  price: number
  sku: string
  image?: string
}

export interface User {
  id: string
  email: string
  name: string
  username?: string
  role: "admin" | "user"
  createdAt: string
}

export interface SyncLog {
  id: number
  timestamp: Date
  action: "sync" | "create" | "update" | "delete"
  status: "success" | "error"
  message: string
  details?: any
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  paymentMethod: "mpesa" | "cash"
  mpesaTransactionId?: string
  shippingAddress: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    county: string
    postalCode?: string
  }
  createdAt: string
  updatedAt: string
}

export interface MpesaPaymentRequest {
  phoneNumber: string
  amount: number
  orderReference: string
  description: string
}

export interface MpesaPaymentResponse {
  success: boolean
  message: string
  checkoutRequestId?: string
  transactionId?: string
}
