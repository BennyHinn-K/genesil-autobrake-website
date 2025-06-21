// Node.js script to create sample data files
const fs = require("fs")
const path = require("path")

// Sample JSON data
const jsonData = {
  products: [
    {
      sku: "GEN-BD-001",
      name: "Premium Brake Disc Set",
      price: 38999,
      originalPrice: 45499,
      category: "Brake Discs",
      brand: "Genesil Pro",
      description: "High-performance ventilated brake discs for superior stopping power",
      rating: 4.8,
      reviews: 124,
      inStock: true,
    },
    {
      sku: "GEN-BP-002",
      name: "Ceramic Brake Pads Premium",
      price: 11699,
      originalPrice: 14299,
      category: "Brake Pads",
      brand: "Genesil Pro",
      description: "Advanced ceramic brake pads with excellent heat dissipation",
      rating: 4.9,
      reviews: 89,
      inStock: true,
    },
  ],
}

// Sample CSV data
const csvData = `sku,name,price,originalPrice,category,brand,description,rating,reviews,inStock
GEN-BD-001,Premium Brake Disc Set,38999,45499,Brake Discs,Genesil Pro,High-performance ventilated brake discs,4.8,124,true
GEN-BP-002,Ceramic Brake Pads Premium,11699,14299,Brake Pads,Genesil Pro,Advanced ceramic brake pads,4.9,89,true`

// Create files
try {
  // Create JSON file
  fs.writeFileSync(path.join(__dirname, "sample-products.json"), JSON.stringify(jsonData, null, 2))

  // Create CSV file
  fs.writeFileSync(path.join(__dirname, "sample-products.csv"), csvData)

  console.log("✅ Sample data files created successfully!")
  console.log("📁 Files created:")
  console.log("   - sample-products.json")
  console.log("   - sample-products.csv")
  console.log("")
  console.log("🚀 You can now upload these files to test the sync functionality!")
} catch (error) {
  console.error("❌ Error creating sample files:", error)
}
