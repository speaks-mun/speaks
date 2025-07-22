import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProfileSetupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-border-divider bg-card-background">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-heading-text">Welcome to Speaks!</CardTitle>
          <CardDescription className="text-body-text">
            Your account has been created successfully. Please check your email to verify your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary-cta/10 rounded-full flex items-center justify-center mx-auto">
              <div className="w-8 h-8 bg-primary-cta rounded-full flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-heading-text">Account Created!</h3>
              <p className="text-sm text-body-text">
                We've sent a verification email to your inbox. Please click the link in the email to verify your
                account.
              </p>
            </div>

            <Button className="w-full bg-primary-cta hover:bg-primary-cta/90 text-white" asChild>
              <Link href="/auth/login">Continue to Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
