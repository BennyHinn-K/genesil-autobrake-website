"use client"
/// <reference types="react" />
import * as React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Shield, Wrench, Truck } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-black/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-black/5 rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight text-black dark:!text-black">
              Premium Auto
              <span className="!text-black"> Spare Parts</span>
            </h1>
            <p className="text-xl mb-8 leading-relaxed text-black dark:!text-black">
              Your trusted partner for high-quality automotive spare parts and accessories. Professional-grade parts for
              all vehicle types with guaranteed performance and M-Pesa payment convenience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/catalogue">
                <Button
                  size="lg"
                  className="bg-black text-yellow-400 hover:bg-gray-900 px-8 py-4 text-lg font-semibold"
                >
                  Browse Catalogue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-black text-black dark:!text-white hover:bg-black hover:text-yellow-400 dark:hover:text-yellow-400 px-8 py-4 text-lg font-semibold transition-all duration-300"
                >
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-black dark:!text-black" />
                <div>
                  <h3 className="font-semibold text-black dark:!text-black">Quality Assured</h3>
                  <p className="text-sm text-black dark:!text-black">Certified parts</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Wrench className="h-8 w-8 text-black dark:!text-black" />
                <div>
                  <h3 className="font-semibold text-black dark:!text-black">Expert Support</h3>
                  <p className="text-sm text-black dark:!text-black">Technical assistance</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Truck className="h-8 w-8 text-black dark:!text-black" />
                <div>
                  <h3 className="font-semibold text-black dark:!text-black">Fast Delivery</h3>
                  <p className="text-sm text-black dark:!text-black">Kenya-wide shipping</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up delay-300">
            <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-8 border border-black/20">
              <Image
                src="https://cdn.prod.website-files.com/683fea9d1284e637c9c1050b/683ffbd0820979343ffe4dc5_65d1acfb-27c5-483e-855f-acc465b1c52c.avif"
                alt="Professional automotive spare parts and tools"
                className="w-full h-80 object-cover rounded-lg"
                width={800}
                height={320}
              />
              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="bg-black/10 rounded-lg p-4">
                  <h4 className="text-2xl font-bold text-black dark:!text-black">500+</h4>
                  <p className="text-sm text-black dark:!text-black">Products Available</p>
                </div>
                <div className="bg-black/10 rounded-lg p-4">
                  <h4 className="text-2xl font-bold text-black dark:!text-black">15+</h4>
                  <p className="text-sm text-black dark:!text-black">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
