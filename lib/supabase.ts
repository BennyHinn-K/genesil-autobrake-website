import { createClient } from "@supabase/supabase-js"

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("Environment variable NEXT_PUBLIC_SUPABASE_URL is required but not set. Please add it to your Vercel project settings.")
}
if (!supabaseAnonKey) {
  throw new Error("Environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY is required but not set. Please add it to your Vercel project settings.")
}
// Service key is only required for admin operations, so warn but don't throw
if (typeof window === "undefined" && !supabaseServiceKey) {
  // Only warn on the server
  // eslint-disable-next-line no-console
  console.warn("WARNING: SUPABASE_SERVICE_ROLE_KEY is not set. Admin features will not work.")
}

// Create the main Supabase client for client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Create admin client for server-side operations (with service role key)
export const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null

// Helper functions
export const isSupabaseConfigured = () => !!(supabaseUrl && supabaseAnonKey)

export const isSupabaseAdminConfigured = () => !!(supabaseUrl && supabaseServiceKey)

// Database connection test
export const testSupabaseConnection = async () => {
  if (!supabase) {
    return { success: false, error: "Supabase not configured" }
  }

  try {
    const { data, error } = await supabase.from("products").select("count", { count: "exact", head: true })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, message: "Connection successful" }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Real-time subscriptions helper
export const subscribeToProducts = (callback: (payload: any) => void) => {
  if (!supabase) return null

  return supabase
    .channel("products-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "products",
      },
      callback,
    )
    .subscribe()
}

export const subscribeToOrders = (callback: (payload: any) => void) => {
  if (!supabase) return null

  return supabase
    .channel("orders-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
      },
      callback,
    )
    .subscribe()
}

// Utility types for better TypeScript support
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
