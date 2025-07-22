"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Heart,
  MapPin,
  Calendar,
  Users,
  Clock,
  MoreVertical,
  Edit,
  BarChart3,
  Copy,
  Share,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
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

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden border-border-divider bg-card-background transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
          event.status === "ended" && "opacity-60",
          event.status === "cancelled" && "opacity-50",
        )}
      >
        {/* Header Background */}
        <div className="relative h-48 overflow-hidden bg-gray-700">
          {event.image_url ? (
            <img
              src={event.image_url || "/placeholder.svg"}
              alt={event.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-cta/20 to-primary-cta/40">
              <span className="text-4xl font-bold text-primary-cta opacity-50">MUN</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 left-3">{getStatusBadge(event.status)}</div>

          {/* Actions Menu */}
          {showActions && (
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                  >
                    <MoreVertical className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/create-event?id=${event.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Event
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Analytics (Coming Soon)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("duplicate")}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate Event
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("share")}>
                    <Share className="mr-2 h-4 w-4" />
                    Share Event
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAction("toggle_visibility")}>
                    {event.status === "live" ? (
                      <>
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide Event
                      </>
                    ) : (
                      <>
                        <Eye className="mr-2 h-4 w-4" />
                        Show Event
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAction("delete")} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Event Title */}
            <h2 className="text-lg font-semibold text-heading-text line-clamp-2 group-hover:text-primary-cta transition-colors">
              {event.title}
            </h2>

            {/* Date & Time */}
            <div className="flex items-center space-x-4 text-sm text-body-text">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-primary-cta" />
                <span>{date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-primary-cta" />
                <span>{time}</span>
              </div>
            </div>

            {/* Venue */}
            <div className="flex items-center space-x-1 text-sm text-body-text">
              <MapPin className="h-4 w-4 text-primary-cta" />
              <span className="line-clamp-1">{event.venue}</span>
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {event.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-md bg-primary-cta/10 px-2 py-1 text-xs text-primary-cta">
                    {tag}
                  </span>
                ))}
                {event.tags.length > 3 && (
                  <span className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    +{event.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-body-text line-clamp-2">{event.description}</p>

            {/* Stats */}
            {showActions && (
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border-divider">
                <div className="flex items-center space-x-1 text-xs text-body-text">
                  <Eye className="h-3 w-3" />
                  <span>{event.stats.views} Views</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-body-text">
                  <Users className="h-3 w-3" />
                  <span>{event.stats.rsvp_rate}% RSVP</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-body-text">
                  <Heart className="h-3 w-3" />
                  <span>{event.stats.bookmarks} Bookmarks</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-body-text">
                  <Share className="h-3 w-3" />
                  <span>{event.stats.shares} Shares</span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {!showActions && (
            <div className="mt-4 flex items-center justify-between">
              {/* Attendee Count */}
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[...Array(Math.min(3, event.current_participants))].map((_, i) => (
                    <div
                      key={i}
                      className="h-6 w-6 rounded-full bg-primary-cta/20 border-2 border-card-background flex items-center justify-center"
                    >
                      <Users className="h-3 w-3 text-primary-cta" />
                    </div>
                  ))}
                </div>
                <span className="text-xs text-body-text">
                  {event.current_participants}/{event.max_participants}
                </span>
              </div>

              {/* RSVP Button */}
              <Button
                size="sm"
                className={cn(
                  "bg-primary-cta hover:bg-primary-cta/90 text-white",
                  event.status === "ended" && "opacity-50 cursor-not-allowed",
                  event.status === "full" && "bg-yellow-500 hover:bg-yellow-600",
                )}
                disabled={event.status === "ended"}
                asChild={event.status !== "ended"}
              >
                {event.status === "ended" ? (
                  <span>Ended</span>
                ) : event.status === "full" ? (
                  <span>Join Waitlist</span>
                ) : (
                  <Link href={`/events/${event.id}`}>Register</Link>
                )}
              </Button>
            </div>
          )}

          {/* Host Info */}
          <div className="mt-3 flex items-center space-x-2 pt-3 border-t border-border-divider">
            <div className="h-6 w-6 rounded-full bg-primary-cta/20 flex items-center justify-center">
              <span className="text-xs font-medium text-primary-cta">{event.host_name.charAt(0).toUpperCase()}</span>
            </div>
            <span className="text-xs text-body-text">Hosted by {event.host_name}</span>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{event.title}"? This action cannot be undone and all registrations will
              be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
