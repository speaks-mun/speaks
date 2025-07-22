"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { EventCardWithActions } from "@/components/event-management/event-card-with-actions"
import { EmptyState } from "@/components/empty-state"
import { Plus, Calendar, BarChart3 } from "lucide-react"
import Link from "next/link"

// Mock data for demonstration
const generateMockEventsWithStats = () => {
  const statuses = ["draft", "pending_review", "live", "full", "ended", "cancelled"] as const
  const categories = ["Model UN Conference", "Youth Parliament", "Debate Competition", "Crisis Committee"]
  const venues = [
    "Chennai Convention Center",
    "Bangalore International Centre",
    "Hyderabad Conference Hall",
    "Kochi Marriott Hotel",
  ]

  return Array.from({ length: 12 }, (_, i) => {
    const eventId = i + 1
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const maxParticipants = Math.floor(Math.random() * 200) + 50
    const currentParticipants = status === "ended" ? maxParticipants : Math.floor(Math.random() * maxParticipants)

    return {
      id: `my-event-${eventId}`,
      title: `My ${categories[Math.floor(Math.random() * categories.length)]} ${eventId}`,
      description: `This is my event description for event ${eventId}. It includes detailed information about the conference objectives and expected outcomes.`,
      date_time: new Date(
        Date.now() + (status === "ended" ? -1 : 1) * Math.random() * 90 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      venue: venues[Math.floor(Math.random() * venues.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      tags: ["UNSC", "UNHRC", "DISEC"].slice(0, Math.floor(Math.random() * 3) + 1),
      max_participants: maxParticipants,
      current_participants: currentParticipants,
      host_name: "You",
      image_url: `/placeholder.svg?height=200&width=400&text=My+Event+${eventId}`,
      status,
      stats: {
        views: Math.floor(Math.random() * 1000) + 50,
        rsvp_rate: Math.floor(Math.random() * 100),
        bookmarks: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 20),
      },
    }
  })
}

export default function MyEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setEvents(generateMockEventsWithStats())
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleEventUpdate = (eventId: string, action: string) => {
    // Handle event updates (delete, duplicate, etc.)
    if (action === "delete") {
      setEvents((prev) => prev.filter((event) => event.id !== eventId))
    }
    // Add other action handlers as needed
  }

  const filterEventsByStatus = (status: string) => {
    if (status === "all") return events
    return events.filter((event) => event.status === status)
  }

  const getTabCounts = () => {
    return {
      all: events.length,
      draft: events.filter((e) => e.status === "draft").length,
      live: events.filter((e) => e.status === "live").length,
      past: events.filter((e) => e.status === "ended").length,
      pending_review: events.filter((e) => e.status === "pending_review").length,
    }
  }

  const counts = getTabCounts()
  const filteredEvents = filterEventsByStatus(activeTab)

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-heading-text mb-2">My Events</h1>
          <p className="text-body-text">Manage your created and hosted events</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="text-sm text-body-text">
            <span className="font-medium">Total Events: {events.length}</span>
          </div>
          <Button className="bg-primary-cta hover:bg-primary-cta/90 text-white" asChild>
            <Link href="/create-event">
              <Plus className="mr-2 h-4 w-4" />
              Create New Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-border-divider bg-card-background">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary-cta">{counts.live}</div>
            <div className="text-sm text-body-text">Live Events</div>
          </CardContent>
        </Card>
        <Card className="border-border-divider bg-card-background">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">{counts.draft}</div>
            <div className="text-sm text-body-text">Drafts</div>
          </CardContent>
        </Card>
        <Card className="border-border-divider bg-card-background">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-500">
              {events.reduce((sum, event) => sum + event.stats.views, 0)}
            </div>
            <div className="text-sm text-body-text">Total Views</div>
          </CardContent>
        </Card>
        <Card className="border-border-divider bg-card-background">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-500">
              {Math.round(events.reduce((sum, event) => sum + event.stats.rsvp_rate, 0) / events.length) || 0}%
            </div>
            <div className="text-sm text-body-text">Avg RSVP Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({counts.draft})</TabsTrigger>
          <TabsTrigger value="live">Live ({counts.live})</TabsTrigger>
          <TabsTrigger value="past">Past ({counts.past})</TabsTrigger>
          <TabsTrigger value="pending_review">Pending ({counts.pending_review})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Bulk Actions Placeholder */}
          <div className="mb-6">
            <Button disabled variant="outline" className="border-border-divider bg-transparent">
              <BarChart3 className="mr-2 h-4 w-4" />
              Bulk Actions (Coming Soon)
            </Button>
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <EmptyState
              title="No events found"
              subtitle={
                activeTab === "all"
                  ? "You haven't created any events yet. Start by creating your first MUN event!"
                  : `No ${activeTab} events found. Try switching to a different tab.`
              }
              icon={<Calendar className="mx-auto h-16 w-16 text-body-text" />}
              actionButtons={
                activeTab === "all"
                  ? [
                      <Button key="create" className="bg-primary-cta hover:bg-primary-cta/90 text-white" asChild>
                        <Link href="/create-event">
                          <Plus className="mr-2 h-4 w-4" />
                          Create Your First Event
                        </Link>
                      </Button>,
                    ]
                  : []
              }
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCardWithActions
                  key={event.id}
                  event={event}
                  showActions={true}
                  onEventUpdate={handleEventUpdate}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
