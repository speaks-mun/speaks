"use client"

import { useEffect } from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { EventReviewDialog } from "@/components/admin/event-review-dialog"
import { Calendar, MapPin, User, Search, Eye } from "lucide-react"
import { format } from "date-fns"
import { getPendingEvents, type PendingEvent } from "@/lib/supabase/admin"
import { checkUserAdminStatus } from "@/lib/admin-actions"
import { useRouter } from "next/navigation"

export const dynamic = "force-dynamic" // always fetch latest list

export default async function PendingEventsPage() {
  const [events, setEvents] = useState<PendingEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<PendingEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<PendingEvent | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const pendingEvents = await getPendingEvents()

  useEffect(() => {
    const checkAccessAndLoadEvents = async () => {
      try {
        await checkUserAdminStatus()
        setEvents(pendingEvents)
        setFilteredEvents(pendingEvents)
      } catch (error) {
        router.push("/discover")
      } finally {
        setIsLoading(false)
      }
    }

    checkAccessAndLoadEvents()
  }, [router])

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredEvents(filtered)
  }, [searchQuery, events])

  const handleReviewEvent = (event: PendingEvent) => {
    setSelectedEvent(event)
    setShowReviewDialog(true)
  }

  const handleEventProcessed = () => {
    // Refresh the events list
    const refreshEvents = async () => {
      const pendingEvents = await getPendingEvents()
      setEvents(pendingEvents)
      setFilteredEvents(pendingEvents)
    }
    refreshEvents()
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <div className="space-y-6">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-10 bg-muted rounded animate-pulse" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <section className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pending Events</h1>
          <p className="text-muted-foreground">Review and approve events waiting for verification</p>
        </div>
        <Badge variant="outline" className="text-sm">
          {filteredEvents.length} events pending
        </Badge>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search events by title, creator, category, or venue..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-muted-foreground">No events awaiting review 🎉</p>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <span>{event.title}</span>
                  <span className="text-sm text-muted-foreground">{format(new Date(event.date_time), "PPPp")}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-sm">
                    Creator: <span className="font-medium">{event.creator.name}</span> ({event.creator.email})
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(event.date_time), "PPP 'at' p")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{event.creator.name}</span>
                    </div>
                  </div>
                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {event.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {event.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{event.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-xs text-muted-foreground">
                      Created {format(new Date(event.created_at), "PPP")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{event.category}</Badge>
                  <Button variant="outline" size="sm" onClick={() => handleReviewEvent(event)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                  <Link
                    href={`/admin/pending-events/${event.id}`}
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <EventReviewDialog
        event={selectedEvent}
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        onEventProcessed={handleEventProcessed}
      />
    </section>
  )
}
