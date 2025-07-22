"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { EventReviewDialog } from "@/components/admin/event-review-dialog"
import { Calendar, MapPin, User, Search, Clock, Eye } from "lucide-react"
import { format } from "date-fns"
import { getPendingEvents, type PendingEvent } from "@/lib/supabase/admin"
import { checkUserAdminStatus } from "@/lib/admin-actions"
import { useRouter } from "next/navigation"

export default function PendingEventsPage() {
  const [events, setEvents] = useState<PendingEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<PendingEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<PendingEvent | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAccessAndLoadEvents = async () => {
      try {
        await checkUserAdminStatus()
        const pendingEvents = await getPendingEvents()
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
    <div className="max-w-7xl mx-auto p-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pending Events</h1>
            <p className="text-muted-foreground">Review and approve events waiting for verification</p>
          </div>
          <Badge variant="outline" className="text-sm">
            {filteredEvents.length} events pending
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events by title, creator, category, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Events List */}
        {filteredEvents.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">{searchQuery ? "No events match your search" : "No pending events"}</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "All events have been reviewed or no new events are waiting for approval"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{event.title}</CardTitle>
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
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">{event.category}</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleReviewEvent(event)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
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
                    <div className="text-xs text-muted-foreground">Creator: {event.creator.email}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Review Dialog */}
      <EventReviewDialog
        event={selectedEvent}
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        onEventProcessed={handleEventProcessed}
      />
    </div>
  )
}
