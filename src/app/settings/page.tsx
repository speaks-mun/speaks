import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, Palette, HelpCircle } from "lucide-react"

export default async function SettingsPage() {
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
          <h1 className="text-3xl font-bold text-heading-text mb-2">Settings</h1>
          <p className="text-body-text">Customize your Speaks experience</p>
        </div>

        <div className="space-y-6">
          {/* Notifications */}
          <Card className="border-border-divider bg-card-background">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary-cta" />
                <CardTitle className="text-heading-text">Notifications</CardTitle>
              </div>
              <CardDescription className="text-body-text">
                Manage how you receive updates about MUN events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-heading-text">Event Reminders</p>
                  <p className="text-sm text-body-text">Get notified about upcoming events</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-heading-text">New Events</p>
                  <p className="text-sm text-body-text">Notifications for new MUN events</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-heading-text">Registration Updates</p>
                  <p className="text-sm text-body-text">Updates about your event registrations</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="border-border-divider bg-card-background">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary-cta" />
                <CardTitle className="text-heading-text">Privacy & Security</CardTitle>
              </div>
              <CardDescription className="text-body-text">Control your privacy and account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-heading-text">Profile Visibility</p>
                  <p className="text-sm text-body-text">Make your profile visible to other users</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button variant="outline" className="w-full border-border-divider bg-transparent">
                Change Password
              </Button>
              <Button variant="outline" className="w-full border-border-divider bg-transparent">
                Download My Data
              </Button>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="border-border-divider bg-card-background">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-primary-cta" />
                <CardTitle className="text-heading-text">Appearance</CardTitle>
              </div>
              <CardDescription className="text-body-text">Customize the look and feel of the app</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-body-text mb-4">Theme settings are available in the navigation menu</p>
            </CardContent>
          </Card>

          {/* Support */}
          <Card className="border-border-divider bg-card-background">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5 text-primary-cta" />
                <CardTitle className="text-heading-text">Support</CardTitle>
              </div>
              <CardDescription className="text-body-text">Get help and provide feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full border-border-divider bg-transparent">
                Help Center
              </Button>
              <Button variant="outline" className="w-full border-border-divider bg-transparent">
                Contact Support
              </Button>
              <Button variant="outline" className="w-full border-border-divider bg-transparent">
                Send Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
