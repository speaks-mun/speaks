import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays } from "lucide-react"

export default async function MyEventsPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-text mb-2">My Events</h1>
          <p className="text-body-text">Manage your registered and created MUN events</p>
        </div>

        {/* Tabs for different event types */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-card-background border border-border-divider rounded-lg p-1">
            <Button variant="ghost" className="flex-1 bg-primary-cta/10 text-primary-cta">
              Registered
            </Button>
            <Button variant="ghost" className="flex-1 text-body-text">
              Created
            </Button>
            <Button variant="ghost" className="flex-1 text-body-text">
              Past Events
            </Button>
          </div>
        </div>

        {/* Empty State */}
        <Card className="border-border-divider bg-card-background">
          <CardContent className="p-8 text-center">
            <CalendarDays className="mx-auto h-12 w-12 text-body-text mb-4" />
            <h3 className="text-lg font-semibold text-heading-text mb-2">No events yet</h3>
            <p className="text-body-text mb-4">
              You haven't registered for any MUN events yet. Discover exciting conferences to join!
            </p>
            <Button className="bg-primary-cta hover:bg-primary-cta/90 text-white">Discover Events</Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
