"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useApiAction } from "@/hooks/use-api-action"
import { signupSchema, type SignupFormData } from "@/lib/auth-schemas"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  })

  const { execute: handleSignup, isLoading } = useApiAction(
    async (data: SignupFormData) => {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            interests: data.interests,
          },
        },
      })

      if (error) {
        throw new Error(error.message)
      }

      router.push("/auth/profile-setup")
    },
    {
      successMessage: "Account created successfully! Please check your email to verify your account.",
      errorMessage: "Failed to create account. Please try again.",
    },
  )

  const onSubmit = (data: SignupFormData) => {
    handleSignup(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-border-divider bg-card-background">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-heading-text">Create account</CardTitle>
          <CardDescription className="text-body-text">Join the South Indian MUN community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-heading-text">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                className="border-border-divider bg-background"
                {...register("name")}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

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
                placeholder="Create a password"
                className="border-border-divider bg-background"
                {...register("password")}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests" className="text-heading-text">
                Interests
              </Label>
              <Input
                id="interests"
                type="text"
                placeholder="e.g., UNSC, UNHRC, Crisis Committee (comma-separated)"
                className="border-border-divider bg-background"
                {...register("interests")}
              />
              {errors.interests && <p className="text-sm text-destructive">{errors.interests.message}</p>}
              <p className="text-xs text-body-text">Enter your MUN interests separated by commas</p>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary-cta hover:bg-primary-cta/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
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
              Sign up with Google
            </Button>
            <Button disabled variant="outline" className="w-full border-border-divider bg-transparent">
              Sign up with Apple
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-body-text">Already have an account? </span>
            <Link href="/auth/login" className="text-primary-cta hover:underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
