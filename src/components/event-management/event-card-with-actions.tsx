"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface EventWithStats {
  id: string
  title: string
  description: string
  date_time: string
  venue: string
  category: string
  tags: string[]
  max_participants: number
  current_participants: number
  host_name: string
  host_avatar?: string
  image_url?: string
  status: "draft" | "pending_review" | "live" | "full" | "ended" | "cancelled"
  stats: {
    views: number
    rsvp_rate: number
    bookmarks: number
    shares: number
  }
}

interface EventCardWithActionsProps {
  event: EventWithStats
  showActions?: boolean
  onEventUpdate?: (eventId: string, action: string) => void
}

export function EventCardWithActions({ event, showActions = false, onEventUpdate }: EventCardWithActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    }
  }

  const { date, time } = formatDate(event.date_time)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "pending_review":
        return <Badge variant="warning">Under Review</Badge>
      case "live":
        return <Badge variant="success">Live</Badge>
      case "full":
        return <Badge variant="info">Event Full</Badge>
      case "ended":
        return <Badge variant="outline">Event Ended</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return null
    }
  }

  const handleAction = (action: string) => {
    switch (action) {
      case "edit":
        // Navigate to edit page
        break
      case "duplicate":
        toast({
          title: "Event duplicated",
          description: "A copy of your event has been created as a draft.",
        })
        onEventUpdate?.(event.id, "duplicate")
        break
      case "share":
        if (navigator.share) {
          navigator.share({
            title: event.title,
            text: event.description,
            url: `/events/${event.id}`,
          })
        } else {
          navigator.clipboard.writeText(`${window.location.origin}/events/${event.id}`)
          toast({
            title: "Link copied",
            description: "Event link has been copied to clipboard.",
          })
        }
        break
      case "delete":
        setShowDeleteDialog(true)
        break
      case "toggle_visibility":
        toast({
          title: "Visibility updated",
          description: "Event visibility has been updated.",
        })
        onEventUpdate?.(event.id, "toggle_visibility")
        break
    }
  }

  const handleDelete = () => {
    toast({
      title: "Event deleted",
      description: "Your event has been permanently deleted.",
      variant: "destructive",
    })
    onEventUpdate?.(event.id, "delete")
    setShowDeleteDialog(false)
  }

  return null
}
