"use client"

import { useState, useEffect, type ChangeEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge as UIBadge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FaPlus, FaSearch, FaEdit, FaTrash, FaBox, FaChartLine, FaShoppingCart, FaFilter, FaDownload, FaUpload } from "react-icons/fa"
import { useToast } from "@/hooks/use-toast"
import ProductForm from "./ProductForm"
import type { Product } from "@/types"

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0,
  })
  const { toast } = useToast()

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products?t=${Date.now()}`)
      const data = await response.json()

      if (data.products) {
        setProducts(data.products)
        setFilteredProducts(data.products)
        calculateStats(data.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const calculateStats = (productList: Product[]) => {
    const totalProducts = productList.length
    const totalValue = productList.reduce((sum, product) => sum + product.price * (product.stockQuantity || 0), 0)
    const lowStock = productList.filter(
      (product) => (product.stockQuantity || 0) <= 5 && (product.stockQuantity || 0) > 0,
    ).length
    const outOfStock = productList.filter((product) => (product.stockQuantity || 0) === 0).length

    setStats({
      totalProducts,
      totalValue,
      lowStock,
      outOfStock,
    })
  }

  // Search products
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products)
    } else {
      const filtered = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredProducts(filtered)
    }
  }, [searchQuery, products])

  // Load products on mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Handle product save
  const handleProductSave = async (productData: Omit<Product, "id" | "createdAt" | "updatedAt">) => {
    try {
      let response

      if (selectedProduct) {
        // Update existing product
        response = await fetch(`/api/products/${selectedProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        })
      } else {
        // Create new product
        response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        })
      }

      if (response.ok) {
        toast({
          title: "Success",
          description: selectedProduct ? "Product updated successfully" : "Product created successfully",
        })

        setShowProductForm(false)
        setSelectedProduct(null)
        await fetchProducts() // Refresh products
      } else {
        // Enhanced error logging
        let errorText = await response.text();
        console.error("Failed to save product. Status:", response.status, "Body:", errorText);
        throw new Error("Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    }
  }

  // Handle product delete
  const handleProductDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
        await fetchProducts() // Refresh products
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      })
    }
  }

  // Handle edit product
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowProductForm(true)
  }

  // Handle add new product
  const handleAddProduct = () => {
    setSelectedProduct(null)
    setShowProductForm(true)
  }

  // Handle cancel form
  const handleCancelForm = () => {
    setShowProductForm(false)
    setSelectedProduct(null)
  }

  if (showProductForm) {
    return <ProductForm product={selectedProduct} onSave={handleProductSave} onCancel={handleCancelForm} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Product Management</h2>
          <p className="text-muted-foreground">Manage your product catalog and inventory</p>
        </div>
        <Button onClick={handleAddProduct} className="bg-yellow-500 hover:bg-yellow-600 text-black">
          <FaPlus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <FaBox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active products in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <FaChartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KES {stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total inventory worth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <UIBadge className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">Items with ≤5 units</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <FaShoppingCart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Items with 0 units</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Product Catalog</CardTitle>
              <CardDescription>Manage all your products from here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name, category, SKU, or brand..."
                    value={searchQuery}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FaFilter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <FaDownload className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <FaUpload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>
              </div>

              {/* Products Table */}
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center gap-2">
                              <FaBox className="h-8 w-8 text-muted-foreground" />
                              <p className="text-muted-foreground">
                                {searchQuery ? "No products found matching your search" : "No products found"}
                              </p>
                              {!searchQuery && (
                                <Button onClick={handleAddProduct} variant="outline" size="sm">
                                  <FaPlus className="h-4 w-4 mr-2" />
                                  Add your first product
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product: Product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image || "/placeholder.svg?height=40&width=40"}
                                  alt={product.name}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">{product.brand}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>KES {product.price.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{product.stockQuantity || 0}</span>
                                {(product.stockQuantity || 0) <= 5 && (product.stockQuantity || 0) > 0 && (
                                  <UIBadge className="text-yellow-600 border-yellow-600">
                                    Low
                                  </UIBadge>
                                )}
                                {(product.stockQuantity || 0) === 0 && (
                                  <UIBadge className="text-red-600 border-red-600">
                                    Out
                                  </UIBadge>
                                )}
                                {product.featured && (
                                  <UIBadge className="bg-yellow-500 text-black ml-2">Featured</UIBadge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <UIBadge className={product.inStock ? "default" : "secondary"}>
                                {product.inStock ? "Active" : "Inactive"}
                              </UIBadge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditProduct(product)}>
                                  <FaEdit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleProductDelete(product.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <FaTrash className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Monitor stock levels and manage inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Low Stock Alert */}
                {stats.lowStock > 0 && (
                  <Alert>
                    <AlertDescription>
                      You have {stats.lowStock} products with low stock (≤5 units). Consider restocking soon.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Out of Stock Alert */}
                {stats.outOfStock > 0 && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      You have {stats.outOfStock} products that are out of stock. Update inventory to avoid lost sales.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Inventory Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Current Stock</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products
                        .filter((product: Product) => (product.stockQuantity || 0) <= 10)
                        .map((product: Product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.image || "/placeholder.svg?height=40&width=40"}
                                  alt={product.name}
                                  className="h-10 w-10 rounded-md object-cover"
                                />
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">{product.sku}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={`font-medium ${
                                  (product.stockQuantity || 0) === 0
                                    ? "text-red-600"
                                    : (product.stockQuantity || 0) <= 5
                                      ? "text-yellow-600"
                                      : "text-green-600"
                                }`}
                              >
                                {product.stockQuantity || 0} units
                              </span>
                            </TableCell>
                            <TableCell>KES {((product.stockQuantity || 0) * product.price).toLocaleString()}</TableCell>
                            <TableCell>
                              {(product.stockQuantity || 0) === 0 ? (
                                <UIBadge className="text-red-600 border-red-600">
                                  Out of Stock
                                </UIBadge>
                              ) : (product.stockQuantity || 0) <= 5 ? (
                                <UIBadge className="text-yellow-600 border-yellow-600">
                                  Low Stock
                                </UIBadge>
                              ) : (
                                <UIBadge className="text-green-600 border-green-600">
                                  In Stock
                                </UIBadge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                Update Stock
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Top performing products by value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products
                    .sort((a: Product, b: Product) => (b.stockQuantity || 0) * b.price - (a.stockQuantity || 0) * a.price)
                    .slice(0, 5)
                    .map((product: Product, index: number) => (
                      <div key={product.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-yellow-500 text-white text-xs flex items-center justify-center">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            KES {((product.stockQuantity || 0) * product.price).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground">{product.stockQuantity || 0} units</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Products by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    products.reduce(
                      (acc: Record<string, number>, product: Product) => {
                        acc[product.category] = (acc[product.category] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    ),
                  )
                    .sort((a, b) => (b[1] as number) - (a[1] as number))
                    .map(([category, count]: [string, number]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="font-medium">{category}</div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-500 rounded-full"
                              style={{ width: `${(count / products.length) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-8 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
