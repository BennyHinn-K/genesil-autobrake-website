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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const products = await readProducts()
    const product = products.find((p: any) => p.id === id)
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updates = await request.json()
    const products = await readProducts()
    const idx = products.findIndex((p: any) => p.id === id)
    if (idx === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    const updatedProduct = {
      ...products[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    products[idx] = updatedProduct
    await writeProducts(products)
    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    let products = await readProducts()
    const idx = products.findIndex((p: any) => p.id === id)
    if (idx === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    products.splice(idx, 1)
    await writeProducts(products)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
