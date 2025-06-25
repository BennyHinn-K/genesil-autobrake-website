"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Phone, Mail, MapPin, Clock } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/images/genesil-logo.png" alt="Genesil Autospares" className="logo-image brightness-0 invert" width={120} height={40} />
              <div>
                <h3 className="text-lg font-bold">GENESIL</h3>
                <p className="text-sm text-gray-400">AUTOSPARES & ACCESSORIES</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for premium automotive spare parts and accessories. Quality products, professional
              service, competitive prices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/catalogue" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Product Catalogue
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Product Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/catalogue?category=brake-systems"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Brake Systems
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?category=engine-parts"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Engine Parts
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?category=suspension"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Suspension
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?category=electrical"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Electrical
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue?category=accessories"
                  className="text-gray-400 hover:text-yellow-400 transition-colors text-sm"
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">
                    Nairobi, Kenya
                    <br />
                    Industrial Area
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-400 text-sm">+254 722 683 434</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                <p className="text-gray-400 text-sm">info@genesil.co.ke</p>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400 text-sm">
                    Mon - Fri: 8:00 AM - 6:00 PM
                    <br />
                    Sat: 8:00 AM - 4:00 PM
                    <br />
                    Sun: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">© 2024 Genesil Autospares & Accessories Ltd. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/admin" className="text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
