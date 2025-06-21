import { supabase, supabaseAdmin } from "./supabase"

// Cleaned up: All Supabase and fallback logic removed. Only utility types remain.

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          sku: string
          name: string
          description: string | null
          price: number
          original_price: number | null
          category: string
          brand: string | null
          image: string | null
          images: string[] | null
          stock_quantity: number
          rating: number
          review_count: number
          features: string[] | null
          specifications: Record<string, any> | null
          tags: string[] | null
          car_models: string[] | null
          in_stock: boolean
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          sku: string
          name: string
          description?: string | null
          price: number
          original_price?: number | null
          category: string
          brand?: string | null
          image?: string | null
          images?: string[] | null
          stock_quantity?: number
          rating?: number
          review_count?: number
          features?: string[] | null
          specifications?: Record<string, any> | null
          tags?: string[] | null
          car_models?: string[] | null
          in_stock?: boolean
          featured?: boolean
        }
        Update: {
          id?: string
          sku?: string
          name?: string
          description?: string | null
          price?: number
          original_price?: number | null
          category?: string
          brand?: string | null
          image?: string | null
          images?: string[] | null
          stock_quantity?: number
          rating?: number
          review_count?: number
          features?: string[] | null
          specifications?: Record<string, any> | null
          tags?: string[] | null
          car_models?: string[] | null
          in_stock?: boolean
          featured?: boolean
        }
      }
    }
  }
}

// Product interface for the application
export interface Product {
  id: string
  sku: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  brand: string
  image: string
  images?: string[]
  stockQuantity: number
  rating: number
  reviews: number
  features?: string[]
  specifications?: Record<string, any>
  tags?: string[]
  carModels?: string[]
  inStock: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
  sourceFile?: string
}

// Database interface for sync operations
export interface DatabaseInterface {
  getAllProducts(): Promise<Product[]>
  getStats(): Promise<any>
  bulkUpsert(products: any[]): Promise<any>
  addSyncLog(log: any): Promise<void>
  getSyncLogs(): Promise<any[]>
}

// Mock database implementation for now
class MockDatabase implements DatabaseInterface {
  async getAllProducts(): Promise<Product[]> {
    return []
  }

  async getStats(): Promise<any> {
    return { total: 0, inStock: 0, featured: 0 }
  }

  async bulkUpsert(products: any[]): Promise<any> {
    return { created: 0, updated: 0 }
  }

  async addSyncLog(log: any): Promise<void> {
    console.log('Sync log:', log)
  }

  async getSyncLogs(): Promise<any[]> {
    return []
  }
}

// Export the database instance
export const productDB = new MockDatabase()
export const getDatabase = () => new MockDatabase()
