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
