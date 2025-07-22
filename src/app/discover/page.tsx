import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Users, Clock } from "lucide-react"

export default async function DiscoverPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Mock event data for demonstration
  const mockEvents = [
    {
      id: 1,
      title: "Chennai MUN Conference 2024",
      description: "Annual Model United Nations conference focusing on global diplomatic challenges",
      date: "March 15-17, 2024",
      location: "Chennai, Tamil Nadu",
      participants: 150,
      committees: ["UNSC", "UNHRC", "DISEC"],
      registrationDeadline: "March 1, 2024",
    },
    {
      id: 2,
      title: "Bangalore Youth Diplomacy Summit",
      description: "Interactive MUN experience for young diplomats across South India",
      date: "April 5-7, 2024",
      location: "Bangalore, Karnataka",
      participants: 200,
      committees: ["WHO", "UNESCO", "Crisis Committee"],
      registrationDeadline: "March 20, 2024",
    },
    {
      id: 3,
      title: "Hyderabad International MUN",
      description: "Premier MUN conference with international participation and expert chairs",
      date: "May 10-12, 2024",
      location: "Hyderabad, Telangana",
      participants: 300,
      committees: ["UNSC", "ECOSOC", "UNGA"],
      registrationDeadline: "April 25, 2024",
    },
  ]

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-heading-text mb-2">Discover MUN Events</h1>
          <p className="text-body-text">Find and join Model United Nations conferences across South India</p>
        </div>

        {/* Search and Filters - Placeholder */}
        <div className="mb-6">
          <Card className="border-border-divider bg-card-background">
            <CardContent className="p-4">
              <p className="text-body-text text-center">
                🔍 Search and filtering features coming soon! Browse available events below.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => (
            <Card key={event.id} className="border-border-divider bg-card-background hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-heading-text text-lg">{event.title}</CardTitle>
                <CardDescription className="text-body-text">{event.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-body-text">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {event.date}
                  </div>
                  <div className="flex items-center text-sm text-body-text">
                    <MapPin className="mr-2 h-4 w-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center text-sm text-body-text">
                    <Users className="mr-2 h-4 w-4" />
                    {event.participants} participants expected
                  </div>
                  <div className="flex items-center text-sm text-body-text">
                    <Clock className="mr-2 h-4 w-4" />
                    Register by {event.registrationDeadline}
                  </div>
                </div>

                {/* Committees */}
                <div>
                  <p className="text-sm font-medium text-heading-text mb-2">Committees:</p>
                  <div className="flex flex-wrap gap-1">
                    {event.committees.map((committee) => (
                      <span key={committee} className="px-2 py-1 text-xs bg-primary-cta/10 text-primary-cta rounded-md">
                        {committee}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1 bg-primary-cta hover:bg-primary-cta/90 text-white">Register</Button>
                  <Button variant="outline" className="border-border-divider bg-transparent">
                    Bookmark
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="border-border-divider bg-transparent">
            Load More Events
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
