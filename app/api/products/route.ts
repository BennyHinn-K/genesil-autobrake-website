import { type NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), "data", "products.json")

async function readProducts() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8")
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function writeProducts(products: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), "utf-8")
}

export async function GET(request: NextRequest) {
  try {
    const products = await readProducts()
    return NextResponse.json({
      products,
      success: true,
      count: products.length,
      message: products.length === 0 ? "No products found" : "Products loaded successfully",
    })
  } catch (error) {
    return NextResponse.json({
      products: [],
      success: false,
      error: "Failed to load products",
      message: error instanceof Error ? error.message : "Unknown error",
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()
    if (!productData.name || !productData.price) {
      return NextResponse.json({ error: "Product name and price are required" }, { status: 400 })
    }
    const products = await readProducts()
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    products.unshift(newProduct)
    await writeProducts(products)
    return NextResponse.json(newProduct)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
  }
}
