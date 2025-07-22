"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useApiAction } from "@/hooks/use-api-action"
import { loginSchema, type LoginFormData } from "@/lib/auth-schemas"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [rememberMe, setRememberMe] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  })

  const { execute: handleLogin, isLoading } = useApiAction(
    async (data: LoginFormData) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw new Error(error.message)
      }

      router.push("/discover")
    },
    {
      successMessage: "Welcome back! Redirecting to discover events...",
      errorMessage: "Failed to sign in. Please check your credentials.",
    },
  )

  const onSubmit = (data: LoginFormData) => {
    handleLogin(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-border-divider bg-card-background">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-heading-text">Welcome back</CardTitle>
          <CardDescription className="text-body-text">Sign in to your Speaks account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-heading-text">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="border-border-divider bg-background"
                {...register("email")}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-heading-text">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="border-border-divider bg-background"
                {...register("password")}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm text-body-text">
                Remember me
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-cta hover:bg-primary-cta/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border-divider" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card-background px-2 text-body-text">Or continue with</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button disabled variant="outline" className="w-full border-border-divider bg-transparent">
              Sign in with Google
            </Button>
            <Button disabled variant="outline" className="w-full border-border-divider bg-transparent">
              Sign in with Apple
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-body-text">Don't have an account? </span>
            <Link href="/auth/signup" className="text-primary-cta hover:underline">
              Sign up
            </Link>
          </div>

          <div className="text-center">
            <Link href="/auth/reset-password" className="text-sm text-primary-cta hover:underline">
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
