"use client"

import { useCart } from "@/app/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import type { Product } from "@/types"

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      product: product,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      sku: product.sku
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <Button onClick={handleAddToCart} disabled={!product.inStock} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
      <ShoppingCart className="h-4 w-4 mr-2" />
      {product.inStock ? 'Add to Cart' : 'Out of Stock'}
    </Button>
  );
}

export function AddToCartIconButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();
    const { toast } = useToast();

    const handleAddToCart = () => {
        addItem({
            id: product.id,
            product: product,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image,
            sku: product.sku,
        });
        toast({
            title: "Added to Cart",
            description: `${product.name} has been added to your cart`,
        });
    };

    return (
        <Button size="sm" variant="secondary" className="h-8 w-8 p-0" onClick={handleAddToCart} disabled={!product.inStock}>
            <ShoppingCart className="h-4 w-4" />
        </Button>
    );
} 