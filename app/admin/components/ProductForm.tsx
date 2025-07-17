"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/types"

interface ProductFormProps {
  product?: Product | null
  onSave: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [newTag, setNewTag] = useState("")
  const [newFeature, setNewFeature] = useState("")
  const [customBrand, setCustomBrand] = useState("")
  const [customCategory, setCustomCategory] = useState("")
  const [showCustomBrand, setShowCustomBrand] = useState(false)
  const [showCustomCategory, setShowCustomCategory] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    image: "",
    category: "",
    brand: "",
    sku: "",
    inStock: true,
    stockQuantity: 0,
    stock: 0,
    rating: 0,
    reviewCount: 0,
    reviews: 0,
    features: [] as string[],
    specifications: {} as Record<string, string>,
    tags: [] as string[],
    carModels: [] as string[],
    featured: false,
  })

  const categories = [
    "Brake Systems",
    "Engine Parts",
    "Suspension",
    "Electrical",
    "Transmission",
    "Cooling System",
    "Exhaust System",
    "Filters",
    "Belts & Hoses",
    "Body Parts",
    "Interior",
    "Lighting",
    "Tires & Wheels",
    "Fuel System",
    "Steering",
    "Air Conditioning",
    "Accessories",
    "Tools & Equipment",
    "Oils & Fluids",
    "Other",
  ]

  const brands = [
    "Bosch",
    "Brembo",
    "Febi",
    "Sachs",
    "Mann Filter",
    "Mahle",
    "NGK",
    "Denso",
    "Continental",
    "Valeo",
    "KYB",
    "Monroe",
    "Bilstein",
    "Castrol",
    "Shell",
    "Mobil",
    "Total",
    "Liqui Moly",
    "Hella",
    "Osram",
    "Philips",
    "Gates",
    "Dayco",
    "SKF",
    "FAG",
    "INA",
    "Lemforder",
    "TRW",
    "ATE",
    "Textar",
    "Pagid",
    "Ferodo",
    "Jurid",
    "Other",
  ]

  const carModels = [
    // Toyota
    "Toyota Corolla",
    "Toyota Camry",
    "Toyota Prius",
    "Toyota RAV4",
    "Toyota Highlander",
    "Toyota Land Cruiser",
    "Toyota Hilux",
    "Toyota Vitz",
    "Toyota Probox",
    "Toyota Succeed",
    // Honda
    "Honda Civic",
    "Honda Accord",
    "Honda CR-V",
    "Honda Pilot",
    "Honda Fit",
    "Honda HR-V",
    "Honda Odyssey",
    "Honda Ridgeline",
    // Nissan
    "Nissan Altima",
    "Nissan Sentra",
    "Nissan Rogue",
    "Nissan Pathfinder",
    "Nissan Murano",
    "Nissan Frontier",
    "Nissan Titan",
    "Nissan Note",
    "Nissan X-Trail",
    "Nissan Juke",
    // Mazda
    "Mazda 3",
    "Mazda 6",
    "Mazda CX-5",
    "Mazda CX-9",
    "Mazda MX-5",
    "Mazda CX-3",
    "Mazda Demio",
    "Mazda Axela",
    // Subaru
    "Subaru Outback",
    "Subaru Forester",
    "Subaru Impreza",
    "Subaru Legacy",
    "Subaru Crosstrek",
    "Subaru Ascent",
    // Mitsubishi
    "Mitsubishi Outlander",
    "Mitsubishi Eclipse Cross",
    "Mitsubishi Mirage",
    "Mitsubishi Pajero",
    "Mitsubishi Lancer",
    "Mitsubishi Colt",
    // Hyundai
    "Hyundai Elantra",
    "Hyundai Sonata",
    "Hyundai Tucson",
    "Hyundai Santa Fe",
    "Hyundai Accent",
    "Hyundai Palisade",
    // Kia
    "Kia Forte",
    "Kia Optima",
    "Kia Sportage",
    "Kia Sorento",
    "Kia Rio",
    "Kia Telluride",
    "Kia Picanto",
    // Volkswagen
    "Volkswagen Golf",
    "Volkswagen Jetta",
    "Volkswagen Passat",
    "Volkswagen Tiguan",
    "Volkswagen Atlas",
    "Volkswagen Polo",
    // BMW
    "BMW 3 Series",
    "BMW 5 Series",
    "BMW X3",
    "BMW X5",
    "BMW 1 Series",
    "BMW 7 Series",
    "BMW X1",
    "BMW X6",
    // Mercedes-Benz
    "Mercedes C-Class",
    "Mercedes E-Class",
    "Mercedes GLC",
    "Mercedes GLE",
    "Mercedes A-Class",
    "Mercedes S-Class",
    "Mercedes GLA",
    // Audi
    "Audi A3",
    "Audi A4",
    "Audi Q5",
    "Audi Q7",
    "Audi A6",
    "Audi Q3",
    "Audi A8",
    // Ford
    "Ford Focus",
    "Ford Fusion",
    "Ford Escape",
    "Ford Explorer",
    "Ford F-150",
    "Ford Mustang",
    "Ford Edge",
    // Chevrolet
    "Chevrolet Cruze",
    "Chevrolet Malibu",
    "Chevrolet Equinox",
    "Chevrolet Traverse",
    "Chevrolet Silverado",
    "Chevrolet Tahoe",
    // Peugeot
    "Peugeot 208",
    "Peugeot 308",
    "Peugeot 3008",
    "Peugeot 5008",
    "Peugeot 2008",
    "Peugeot 508",
    // Renault
    "Renault Clio",
    "Renault Megane",
    "Renault Captur",
    "Renault Kadjar",
    "Renault Duster",
    // Isuzu
    "Isuzu D-Max",
    "Isuzu MU-X",
    "Isuzu NPR",
    "Isuzu Forward",
    "Isuzu Elf",
    // Suzuki
    "Suzuki Swift",
    "Suzuki Vitara",
    "Suzuki Jimny",
    "Suzuki Baleno",
    "Suzuki Alto",
    "Suzuki Wagon R",
  ]

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        originalPrice: product.originalPrice || 0,
        image: product.image || "",
        category: product.category,
        brand: product.brand || "",
        sku: product.sku,
        inStock: product.inStock,
        stockQuantity: product.stockQuantity || 0,
        stock: product.stock || 0,
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        reviews: product.reviews || 0,
        features: product.features || [],
        specifications: product.specifications || {},
        tags: product.tags || [],
        carModels: product.carModels || [],
        featured: product.featured || false,
      })
      setImagePreview(product.image || "")

      // Check if brand or category is custom
      if (product.brand && !brands.includes(product.brand)) {
        setShowCustomBrand(true)
        setCustomBrand(product.brand)
      }
      if (product.category && !categories.includes(product.category)) {
        setShowCustomCategory(true)
        setCustomCategory(product.category)
      }
    } else {
      // Generate SKU for new product
      const timestamp = Date.now().toString().slice(-6)
      setFormData((prev) => ({
        ...prev,
        sku: `GEN-${timestamp}`,
      }))
    }
  }, [product])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name === "brand" && value === "Other") {
      setShowCustomBrand(true)
      setFormData((prev) => ({ ...prev, [name]: "" }))
    } else if (name === "category" && value === "Other") {
      setShowCustomCategory(true)
      setFormData((prev) => ({ ...prev, [name]: "" }))
    } else {
      setShowCustomBrand(false)
      setShowCustomCategory(false)
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCustomBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomBrand(value)
    setFormData((prev) => ({ ...prev, brand: value }))
  }

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCustomCategory(value)
    setFormData((prev) => ({ ...prev, category: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setImagePreview(result)
        setFormData((prev) => ({
          ...prev,
          image: result,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (featureToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((feature) => feature !== featureToRemove),
    }))
  }

  const toggleCarModel = (model: string) => {
    setFormData((prev) => ({
      ...prev,
      carModels: prev.carModels.includes(model)
        ? prev.carModels.filter((m) => m !== model)
        : [...prev.carModels, model],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      })
      return
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Product category is required",
        variant: "destructive",
      })
      return
    }

    if (formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Product price must be greater than 0",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">{product ? "Edit Product" : "Add New Product"}</h2>
          <p className="text-muted-foreground">
            {product ? "Update product information" : "Create a new product for your catalog"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Product Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Product Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                    className="bg-background border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={4}
                    className="bg-background border-border text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Category *</label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {showCustomCategory && (
                      <Input
                        value={customCategory}
                        onChange={handleCustomCategoryChange}
                        placeholder="Enter custom category"
                        className="mt-2 bg-background border-border text-foreground"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Brand</label>
                    <Select value={formData.brand} onValueChange={(value) => handleSelectChange("brand", value)}>
                      <SelectTrigger className="bg-background border-border text-foreground">
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {showCustomBrand && (
                      <Input
                        value={customBrand}
                        onChange={handleCustomBrandChange}
                        placeholder="Enter custom brand"
                        className="mt-2 bg-background border-border text-foreground"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">SKU</label>
                  <Input
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Product SKU"
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Pricing & Stock</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Price (KES) *</label>
                    <Input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      required
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Original Price (KES)</label>
                    <Input
                      name="originalPrice"
                      type="number"
                      value={formData.originalPrice}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="bg-background border-border text-foreground"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">Stock Quantity</label>
                    <Input
                      name="stockQuantity"
                      type="number"
                      value={formData.stockQuantity}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                      className="bg-background border-border text-foreground"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={formData.inStock}
                      onCheckedChange={(checked) => handleSwitchChange("inStock", checked)}
                    />
                    <label className="text-sm font-medium text-foreground">In Stock</label>
                  </div>
                </div>

                {/* Mark as Featured Toggle */}
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    checked={formData.featured || false}
                    onCheckedChange={(checked) => handleSwitchChange("featured", checked)}
                  />
                  <label className="text-sm font-medium text-yellow-600">Mark as Featured</label>
                </div>
              </CardContent>
            </Card>

            {/* Compatible Car Models */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Compatible Car Models</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                  {carModels.map((model) => (
                    <div key={model} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={model}
                        checked={formData.carModels.includes(model)}
                        onChange={() => toggleCarModel(model)}
                        className="rounded border-border"
                      />
                      <label htmlFor={model} className="text-sm text-foreground cursor-pointer">
                        {model}
                      </label>
                    </div>
                  ))}
                </div>
                {formData.carModels.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Selected Models:</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.carModels.map((model) => (
                        <Badge key={model} variant="secondary" className="text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature"
                    className="bg-background border-border text-foreground"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  />
                  <Button type="button" onClick={addFeature} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(feature)} />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    className="bg-background border-border text-foreground"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Product Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center relative">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Product preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setImagePreview("")
                          setFormData((prev) => ({ ...prev, image: "" }))
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                      <div>
                        <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Rating */}
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Rating & Reviews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Rating (0-5)</label>
                  <Input
                    name="rating"
                    type="number"
                    value={formData.rating}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    max="5"
                    step="0.1"
                    className="bg-background border-border text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Review Count</label>
                  <Input
                    name="reviewCount"
                    type="number"
                    value={formData.reviewCount}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                      {product ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{product ? "Update Product" : "Create Product"}</>
                  )}
                </Button>

                <Button type="button" variant="outline" onClick={onCancel} className="w-full" disabled={loading}>
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
