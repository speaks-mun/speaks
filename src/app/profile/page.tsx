import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Mail, MapPin, Calendar } from "lucide-react"

export default async function ProfilePage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-text mb-2">Profile</h1>
          <p className="text-body-text">Manage your account and MUN preferences</p>
        </div>

        {/* Profile Card */}
        <Card className="border-border-divider bg-card-background mb-6">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary-cta/10 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-primary-cta" />
              </div>
              <div>
                <CardTitle className="text-heading-text">{user.user_metadata?.name || "MUN Delegate"}</CardTitle>
                <CardDescription className="text-body-text">{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-body-text" />
                <span className="text-body-text">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-body-text" />
                <span className="text-body-text">Member since {new Date(user.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-body-text" />
                <span className="text-body-text">South India</span>
              </div>
            </div>

            <div className="pt-4">
              <Button className="w-full bg-primary-cta hover:bg-primary-cta/90 text-white">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* MUN Interests */}
        <Card className="border-border-divider bg-card-background mb-6">
          <CardHeader>
            <CardTitle className="text-heading-text">MUN Interests</CardTitle>
            <CardDescription className="text-body-text">Your preferred committees and topics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["UNSC", "UNHRC", "DISEC", "WHO"].map((interest) => (
                <span key={interest} className="px-3 py-1 text-sm bg-primary-cta/10 text-primary-cta rounded-full">
                  {interest}
                </span>
              ))}
            </div>
            <Button variant="outline" className="mt-4 border-border-divider bg-transparent">
              Update Interests
            </Button>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="border-border-divider bg-card-background">
          <CardHeader>
            <CardTitle className="text-heading-text">Your MUN Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-cta">0</div>
                <div className="text-sm text-body-text">Events Attended</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-cta">0</div>
                <div className="text-sm text-body-text">Events Created</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-cta">0</div>
                <div className="text-sm text-body-text">Bookmarks</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
