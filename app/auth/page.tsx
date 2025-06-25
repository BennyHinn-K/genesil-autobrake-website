"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Loader2, User, Mail, Lock } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { login, user } = useAuth()
  const router = useRouter()

  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  })

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Check for admin credentials
      if (loginForm.username === "K@ranJA" && loginForm.password === "K@ranJA") {
        const adminUser = {
          id: "admin-001",
          name: "Administrator",
          email: "admin@genesil.co.ke",
          username: loginForm.username,
          role: "admin" as const,
        }

        await login(adminUser)

        // Set admin auth for admin dashboard
        localStorage.setItem("adminAuth", "true")

        // Dispatch events to update navbar
        window.dispatchEvent(new Event("adminLogin"))

        // Small delay to ensure state updates
        setTimeout(() => {
          router.push("/admin")
        }, 100)

        return
      }

      // Check for regular user
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const foundUser = users.find(
        (u: any) =>
          (u.username === loginForm.username || u.email === loginForm.username) && u.password === loginForm.password,
      )

      if (foundUser) {
        await login(foundUser)
        router.push("/")
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validation
      if (signupForm.password !== signupForm.confirmPassword) {
        setError("Passwords do not match")
        return
      }

      if (signupForm.password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const existingUser = users.find((u: any) => u.username === signupForm.username || u.email === signupForm.email)

      if (existingUser) {
        setError("Username or email already exists")
        return
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        name: signupForm.name,
        email: signupForm.email,
        username: signupForm.username,
        password: signupForm.password,
        role: "user" as const,
      }

      users.push(newUser)
      localStorage.setItem("users", JSON.stringify(users))

      setSuccess("Account created successfully! You can now login.")
      setSignupForm({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      })
    } catch (err) {
      setError("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (user) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/images/genesil-logo.png"
            alt="Genesil Autospares"
            className="w-24 h-24 mx-auto mb-4 drop-shadow-lg"
            width={96}
            height={96}
          />
          <h1 className="text-3xl font-bold text-black mb-2">GENESIL</h1>
          <p className="text-black/80 font-medium">AUTOSPARES & ACCESSORIES LTD</p>
        </div>

        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0 rounded-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-black">Welcome</CardTitle>
            <CardDescription className="text-gray-700">Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-yellow-100/80 rounded-xl p-1">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg font-medium"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg font-medium"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-black font-medium text-sm">
                      Username or Email
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="Enter username or email"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-black font-medium text-sm">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="pl-10 pr-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl h-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert className="border-red-200 bg-red-50 rounded-xl">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-black font-medium text-sm">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-black font-medium text-sm">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-username" className="text-black font-medium text-sm">
                      Username
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-username"
                        type="text"
                        placeholder="Choose a username"
                        value={signupForm.username}
                        onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                        className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-black font-medium text-sm">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="pl-10 pr-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl h-12"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-black font-medium text-sm">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={signupForm.confirmPassword}
                        onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                        className="pl-10 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl h-12"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert className="border-red-200 bg-red-50 rounded-xl">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert className="border-green-200 bg-green-50 rounded-xl">
                      <AlertDescription className="text-green-800">{success}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
