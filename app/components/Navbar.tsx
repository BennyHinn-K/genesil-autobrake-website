"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Menu, ShoppingCart, User, Sun, Moon, LogOut, Shield, Eye, EyeOff } from "lucide-react"
import { useCart } from "../context/CartContext"
import { useTheme } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminDialog, setShowAdminDialog] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [adminError, setAdminError] = useState("")
  const [adminLoading, setAdminLoading] = useState(false)

  const { items } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Check admin status with immediate updates
  useEffect(() => {
    const checkAdmin = () => {
      const adminAuth = localStorage.getItem("adminAuth")
      setIsAdmin(adminAuth === "true")
    }

    // Initial check
    checkAdmin()

    // Listen for admin login/logout events
    const handleAdminLogin = () => {
      setTimeout(checkAdmin, 100)
    }
    const handleAdminLogout = () => {
      setTimeout(checkAdmin, 100)
    }

    window.addEventListener("adminLogin", handleAdminLogin)
    window.addEventListener("adminLogout", handleAdminLogout)
    window.addEventListener("storage", checkAdmin)

    return () => {
      window.removeEventListener("adminLogin", handleAdminLogin)
      window.removeEventListener("adminLogout", handleAdminLogout)
      window.removeEventListener("storage", checkAdmin)
    }
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Catalogue", href: "/catalogue" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  const handleUserAction = () => {
    if (user) {
      logout()
      localStorage.removeItem("adminAuth")
      setIsAdmin(false)
      window.dispatchEvent(new Event("adminLogout"))
    }
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setAdminLoading(true)
    setAdminError("")

    setTimeout(() => {
      if (adminPassword === "K@ranJA") {
        localStorage.setItem("adminAuth", "true")
        setIsAdmin(true)
        window.dispatchEvent(new Event("adminLogin"))
        setShowAdminDialog(false)
        setAdminPassword("")
        setAdminError("")
        setTimeout(() => {
          router.push("/admin")
        }, 100)
      } else {
        setAdminError("Invalid password. Access denied.")
      }
      setAdminLoading(false)
    }, 800)
  }

  const handleAdminClick = () => {
    if (isAdmin) {
      router.push("/admin")
    } else {
      setShowAdminDialog(true)
    }
  }

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 dark:bg-card/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-gray-700/50"
            : "bg-white dark:bg-card shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-3 group">
              <img
                src="/images/genesil-logo.png"
                alt="Genesil Autospares"
                className="h-10 w-auto transition-transform group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 dark:text-foreground group-hover:text-yellow-600 transition-colors">
                  GENESIL
                </h1>
                <p className="text-xs text-gray-600 dark:text-muted-foreground">AUTOBRAKE & ACCESSORIES</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 hover:text-yellow-600 hover:scale-105 ${
                    isActive(item.href)
                      ? "text-yellow-600 dark:text-yellow-400 font-semibold"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Admin Button - Always visible */}
              <Button
                variant="ghost"
                onClick={handleAdminClick}
                className={`text-sm font-medium transition-all duration-200 hover:text-yellow-600 hover:scale-105 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 ${
                  isActive("/admin")
                    ? "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 font-semibold"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Cart */}
              <Link href="/cart">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-yellow-500 hover:bg-yellow-600 text-black text-xs font-bold animate-pulse">
                      {cartItemsCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Actions */}
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUserAction}
                  className="hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              ) : (
                <Link href="/auth">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200 flex items-center gap-1"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden sm:inline">Login</span>
                  </Button>
                </Link>
              )}

              {/* Mobile Menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden hover:text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-all duration-200"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="p-0 bg-white dark:bg-card w-80">
                  <div className="flex flex-col p-6 space-y-6">
                    <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <img src="/images/genesil-logo.png" alt="Genesil" className="h-8 w-auto" />
                      <div>
                        <h2 className="font-bold text-gray-900 dark:text-foreground">GENESIL</h2>
                        <p className="text-xs text-gray-600 dark:text-muted-foreground">AUTOBRAKE</p>
                      </div>
                    </div>

                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`text-base font-medium transition-colors hover:text-yellow-600 py-2 ${
                          isActive(item.href)
                            ? "text-yellow-600 dark:text-yellow-400 font-semibold"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}

                    {/* Mobile Admin - Always visible */}
                    <Button
                      variant="ghost"
                      className="text-base font-medium transition-colors hover:text-yellow-600 text-gray-700 dark:text-gray-300 flex items-center gap-3 justify-start p-2 h-auto"
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        handleAdminClick()
                      }}
                    >
                      <Shield className="h-5 w-5" />
                      Admin
                    </Button>

                    {!user && (
                      <Link
                        href="/auth"
                        className="text-base font-medium transition-colors hover:text-yellow-600 text-gray-700 dark:text-gray-300 py-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Admin Login Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-card border-2 border-yellow-200 dark:border-yellow-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              Admin Access
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Enter the admin password to access the dashboard
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAdminLogin} className="space-y-6 pt-4">
            <div className="space-y-3">
              <Label htmlFor="admin-password" className="text-sm font-medium">
                Admin Password
              </Label>
              <div className="relative">
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                  className="pr-12 h-12 border-2 focus:border-yellow-400 transition-colors"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-10 w-10 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {adminError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <AlertDescription className="text-red-700 dark:text-red-400">{adminError}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAdminDialog(false)
                  setAdminPassword("")
                  setAdminError("")
                }}
                className="flex-1 h-12 border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={adminLoading}
              >
                {adminLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Authenticating...
                  </div>
                ) : (
                  "Access Dashboard"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
