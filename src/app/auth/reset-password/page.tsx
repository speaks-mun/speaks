"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"
import { useApiAction } from "@/hooks/use-api-action"
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/auth-schemas"
import { Loader2 } from "lucide-react"

export default function ResetPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
  })

  const { execute: handleResetPassword, isLoading } = useApiAction(
    async (data: ResetPasswordFormData) => {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/auth/update-password`,
      })

      if (error) {
        throw new Error(error.message)
      }

      reset()
    },
    {
      successMessage: "Password reset email sent! Please check your inbox.",
      errorMessage: "Failed to send reset email. Please try again.",
    },
  )

  const onSubmit = (data: ResetPasswordFormData) => {
    handleResetPassword(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-border-divider bg-card-background">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-heading-text">Reset password</CardTitle>
          <CardDescription className="text-body-text">
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
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

            <Button
              type="submit"
              className="w-full bg-primary-cta hover:bg-primary-cta/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-body-text">Remember your password? </span>
            <Link href="/auth/login" className="text-primary-cta hover:underline">
              Back to login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
