import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Calendar, Users, MapPin } from "lucide-react"

export default function CreatePage() {
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-heading-text mb-2">Create Event</h1>
        <p className="text-body-text">Organize your own MUN conference or event</p>
      </div>

      {/* Coming Soon */}
      <Card className="border-border-divider bg-card-background">
        <CardContent className="p-12 text-center">
          <PlusCircle className="mx-auto h-16 w-16 text-primary-cta mb-6" />
          <h3 className="text-xl font-semibold text-heading-text mb-3">Event Creation Coming Soon</h3>
          <p className="text-body-text mb-8 max-w-md mx-auto">
            We're building powerful tools to help you create and manage MUN events. Stay tuned for comprehensive event
            management features!
          </p>

          {/* Feature Preview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="text-center">
              <Calendar className="mx-auto h-8 w-8 text-primary-cta mb-2" />
              <h4 className="font-medium text-heading-text mb-1">Event Scheduling</h4>
              <p className="text-sm text-body-text">Set dates, times, and schedules</p>
            </div>
            <div className="text-center">
              <Users className="mx-auto h-8 w-8 text-primary-cta mb-2" />
              <h4 className="font-medium text-heading-text mb-1">Registration Management</h4>
              <p className="text-sm text-body-text">Handle participant registrations</p>
            </div>
            <div className="text-center">
              <MapPin className="mx-auto h-8 w-8 text-primary-cta mb-2" />
              <h4 className="font-medium text-heading-text mb-1">Venue & Logistics</h4>
              <p className="text-sm text-body-text">Manage locations and resources</p>
            </div>
          </div>

          <Button className="bg-primary-cta hover:bg-primary-cta/90 text-white" disabled>
            Create Event (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
