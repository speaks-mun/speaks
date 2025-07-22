"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileEditModal } from "@/components/profile/profile-edit-modal"
import { EventCardInteractive } from "@/components/event-card-interactive"
import { EmptyState } from "@/components/empty-state"
import { User, Mail, MapPin, Calendar, Edit, Settings, Share, Globe, Twitter, Linkedin } from "lucide-react"
import { getUserEvents, type Event } from "@/lib/supabase/events"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  name: string
  email: string
  bio?: string
  interests?: string[]
  location?: string
  website?: string
  twitter?: string
  linkedin?: string
  avatar_url?: string
  created_at: string
}

interface ActivityItem {
  id: string
  type: "created" | "rsvp" | "bookmark"
  action: string
  event_title: string
  created_at: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("my-events")
  const [events, setEvents] = useState<{ [key: string]: Event[] }>({
    created: [],
    attending: [],
    bookmarked: [],
  })
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadUserProfile()
  }, [])

  useEffect(() => {
    if (user) {
      loadUserEvents()
      loadUserActivity()
    }
  }, [user, activeTab])

  const loadUserProfile = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) return

      const { data: profile, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

      if (error) throw error

      setUser({
        ...profile,
        email: authUser.email || "",
      })
    } catch (error) {
      console.error("Error loading profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadUserEvents = async () => {
    if (!user) return

    try {
      const [createdEvents, attendingEvents, bookmarkedEvents] = await Promise.all([
        getUserEvents(user.id, "created"),
        getUserEvents(user.id, "attending"),
        getUserEvents(user.id, "bookmarked"),
      ])

      setEvents({
        created: createdEvents,
        attending: attendingEvents,
        bookmarked: bookmarkedEvents,
      })
    } catch (error) {
      console.error("Error loading user events:", error)
    }
  }

  const loadUserActivity = async () => {
    // Mock activity data for MVP
    const mockActivity: ActivityItem[] = [
      {
        id: "1",
        type: "created",
        action: "Created",
        event_title: "Chennai MUN Conference 2024",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      },
      {
        id: "2",
        type: "rsvp",
        action: "RSVP'd to",
        event_title: "Bangalore Youth Summit",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      },
      {
        id: "3",
        type: "bookmark",
        action: "Bookmarked",
        event_title: "Hyderabad International MUN",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      },
    ]

    setActivity(mockActivity)
  }

  const handleProfileSave = (updatedData: any) => {
    if (user) {
      setUser({ ...user, ...updatedData })
    }
  }

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "created":
        return "🎯"
      case "rsvp":
        return "✅"
      case "bookmark":
        return "❤️"
      default:
        return "📝"
    }
  }

  const formatActivityDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg" />
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto max-w-4xl">
        <EmptyState
          title="Profile not found"
          subtitle="Unable to load your profile. Please try again."
          actionButtons={[
            <Button key="retry" onClick={loadUserProfile} className="bg-primary-cta hover:bg-primary-cta/90">
              Retry
            </Button>,
          ]}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="border-border-divider bg-card-background">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="w-24 h-24 bg-primary-cta/10 rounded-full flex items-center justify-center">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url || "/placeholder.svg"}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-primary-cta" />
                )}
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-heading-text">{user.name}</h1>
                    <p className="text-body-text">{user.email}</p>
                    {user.bio && <p className="text-body-text mt-2">{user.bio}</p>}
                  </div>
                  <div className="flex space-x-2 mt-4 sm:mt-0">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditModalOpen(true)}
                      className="border-border-divider bg-transparent"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" disabled className="border-border-divider bg-transparent">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="outline" disabled className="border-border-divider bg-transparent">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center space-x-2 text-sm text-body-text">
                    <Mail className="h-4 w-4 text-primary-cta" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-body-text">
                    <Calendar className="h-4 w-4 text-primary-cta" />
                    <span>Joined {formatJoinDate(user.created_at)}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center space-x-2 text-sm text-body-text">
                      <MapPin className="h-4 w-4 text-primary-cta" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center space-x-2 text-sm text-body-text">
                      <Globe className="h-4 w-4 text-primary-cta" />
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Website
                      </a>
                    </div>
                  )}
                  {user.twitter && (
                    <div className="flex items-center space-x-2 text-sm text-body-text">
                      <Twitter className="h-4 w-4 text-primary-cta" />
                      <a
                        href={`https://twitter.com/${user.twitter.replace("@", "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {user.twitter}
                      </a>
                    </div>
                  )}
                  {user.linkedin && (
                    <div className="flex items-center space-x-2 text-sm text-body-text">
                      <Linkedin className="h-4 w-4 text-primary-cta" />
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        LinkedIn
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <Card className="border-border-divider bg-card-background">
            <CardHeader>
              <CardTitle className="text-heading-text">MUN Interests</CardTitle>
              <CardDescription className="text-body-text">Your preferred committees and topics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="bg-primary-cta/10 text-primary-cta">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="my-events">My Events ({events.created.length})</TabsTrigger>
            <TabsTrigger value="attending">Attending ({events.attending.length})</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks ({events.bookmarked.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* My Events Tab */}
          <TabsContent value="my-events" className="mt-6">
            {events.created.length === 0 ? (
              <EmptyState
                title="No events created"
                subtitle="You haven't created any events yet. Start organizing your first MUN event!"
                actionButtons={[
                  <Button key="create" className="bg-primary-cta hover:bg-primary-cta/90 text-white" asChild>
                    <a href="/create-event">Create Your First Event</a>
                  </Button>,
                ]}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.created.map((event) => (
                  <EventCardInteractive key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Attending Tab */}
          <TabsContent value="attending" className="mt-6">
            {events.attending.length === 0 ? (
              <EmptyState
                title="No events attended"
                subtitle="You haven't RSVP'd to any events yet. Discover exciting MUN conferences to join!"
                actionButtons={[
                  <Button key="discover" className="bg-primary-cta hover:bg-primary-cta/90 text-white" asChild>
                    <a href="/discover">Discover Events</a>
                  </Button>,
                ]}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.attending.map((event) => (
                  <EventCardInteractive key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Bookmarks Tab */}
          <TabsContent value="bookmarks" className="mt-6">
            {events.bookmarked.length === 0 ? (
              <EmptyState
                title="No bookmarked events"
                subtitle="You haven't bookmarked any events yet. Save interesting events for later!"
                actionButtons={[
                  <Button key="discover" className="bg-primary-cta hover:bg-primary-cta/90 text-white" asChild>
                    <a href="/discover">Discover Events</a>
                  </Button>,
                ]}
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.bookmarked.map((event) => (
                  <EventCardInteractive key={event.id} event={event} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-6">
            <Card className="border-border-divider bg-card-background">
              <CardHeader>
                <CardTitle className="text-heading-text">Recent Activity</CardTitle>
                <CardDescription className="text-body-text">Your recent actions and interactions</CardDescription>
              </CardHeader>
              <CardContent>
                {activity.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-body-text">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activity.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-card-background/50"
                      >
                        <div className="text-lg">{getActivityIcon(item.type)}</div>
                        <div className="flex-1">
                          <p className="text-sm text-heading-text">
                            {item.action} <span className="font-medium">"{item.event_title}"</span>
                          </p>
                          <p className="text-xs text-body-text">{formatActivityDate(item.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleProfileSave}
      />
    </div>
  )
}
