import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, HelpCircle, User, Lock } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="container mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-heading-text mb-2">Settings</h1>
        <p className="text-body-text">Customize your Speaks experience</p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <Card className="border-border-divider bg-card-background">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-primary-cta" />
              <CardTitle className="text-heading-text">Account</CardTitle>
            </div>
            <CardDescription className="text-body-text">Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start border-border-divider bg-transparent">
              Edit Profile
            </Button>
            <Button variant="outline" className="w-full justify-start border-border-divider bg-transparent">
              <Lock className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </CardContent>
        </Card>

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
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-heading-text">Event Reminders</p>
                <p className="text-sm text-body-text">Get notified about upcoming events</p>
              </div>
              <Switch className="data-[state=checked]:bg-primary-cta" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-heading-text">New Events</p>
                <p className="text-sm text-body-text">Notifications for new MUN events</p>
              </div>
              <Switch className="data-[state=checked]:bg-primary-cta" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-heading-text">Registration Updates</p>
                <p className="text-sm text-body-text">Updates about your event registrations</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-primary-cta" />
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
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-heading-text">Profile Visibility</p>
                <p className="text-sm text-body-text">Make your profile visible to other users</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-primary-cta" />
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full border-border-divider bg-transparent">
                Download My Data
              </Button>
              <Button
                variant="outline"
                className="w-full border-border-divider bg-transparent text-destructive hover:text-destructive"
              >
                Delete Account
              </Button>
            </div>
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
            <Button variant="outline" className="w-full justify-start border-border-divider bg-transparent">
              Help Center
            </Button>
            <Button variant="outline" className="w-full justify-start border-border-divider bg-transparent">
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start border-border-divider bg-transparent">
              Send Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
