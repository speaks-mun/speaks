"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, Calendar, Users, Clock, Share, UserPlus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { toggleBookmark, toggleRSVP, toggleFollow } from "@/lib/supabase/interactions"
import { ShareEventDialog } from "@/components/social/share-event-dialog"
import type { Event } from "@/lib/supabase/events"

interface EventCardInteractiveProps {
  event: Event
  showFollowButton?: boolean
}

export function EventCardInteractive({ event, showFollowButton = false }: EventCardInteractiveProps) {
  const [isBookmarked, setIsBookmarked] = useState(event.is_bookmarked || false)
  const [rsvpStatus, setRsvpStatus] = useState(event.user_rsvp_status)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const { toast } = useToast()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    }
  }

  const { date, time } = formatDate(event.date_time)

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const previousState = isBookmarked
    setIsBookmarked(!isBookmarked) // Optimistic update

    try {
      const result = await toggleBookmark(event.id)
      setIsBookmarked(result.bookmarked)
      toast({
        title: result.bookmarked ? "Event bookmarked" : "Bookmark removed",
        description: result.bookmarked ? "Event added to your bookmarks" : "Event removed from bookmarks",
      })
    } catch (error) {
      setIsBookmarked(previousState) // Revert on error
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleRSVPToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return

    const previousState = rsvpStatus
    setIsLoading(true)
    setRsvpStatus(rsvpStatus ? null : "going") // Optimistic update

    try {
      const result = await toggleRSVP(event.id)
      setRsvpStatus(result.rsvp_status)
      toast({
        title: result.rsvp_status ? "RSVP confirmed" : "RSVP cancelled",
        description: result.rsvp_status ? "You're now registered for this event" : "Your RSVP has been cancelled",
      })
    } catch (error) {
      setRsvpStatus(previousState) // Revert on error
      toast({
        title: "Error",
        description: "Failed to update RSVP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const previousState = isFollowing
    setIsFollowing(!isFollowing) // Optimistic update

    try {
      const result = await toggleFollow(event.creator_id)
      setIsFollowing(result.following)
      toast({
        title: result.following ? "Following user" : "Unfollowed user",
        description: result.following
          ? `You're now following ${event.creator?.name}`
          : `You unfollowed ${event.creator?.name}`,
      })
    } catch (error) {
      setIsFollowing(previousState) // Revert on error
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isPastEvent = new Date(event.date_time) < new Date()
  const isEventFull = event.status === "full"

  return (
    <>
      <Card
        className={cn(
          "group relative overflow-hidden border-border-divider bg-card-background transition-all duration-200 hover:shadow-lg hover:-translate-y-1",
          isPastEvent && "opacity-60",
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

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-primary-cta/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {event.category}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex space-x-2">
            {/* Share Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setShowShareDialog(true)
              }}
            >
              <Share className="h-4 w-4 text-white" />
            </Button>

            {/* Bookmark Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
              onClick={handleBookmarkToggle}
            >
              <Heart className={cn("h-4 w-4", isBookmarked ? "fill-red-500 text-red-500" : "text-white")} />
            </Button>
          </div>

          {/* Status Overlays */}
          {isPastEvent && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-lg bg-black/70 px-4 py-2 text-sm font-medium text-white">Event Ended</span>
            </div>
          )}
          {isEventFull && !isPastEvent && (
            <div className="absolute bottom-3 left-3">
              <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-medium text-black">Fully Booked</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Event Title */}
            <Link href={`/events/${event.id}`}>
              <h2 className="text-lg font-semibold text-heading-text line-clamp-2 group-hover:text-primary-cta transition-colors cursor-pointer">
                {event.title}
              </h2>
            </Link>

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
          </div>

          {/* Footer Actions */}
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
                {event.current_participants}
                {event.max_participants && `/${event.max_participants}`}
              </span>
            </div>

            {/* RSVP Button */}
            <Button
              size="sm"
              className={cn(
                "transition-all duration-200",
                rsvpStatus === "going"
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-primary-cta hover:bg-primary-cta/90 text-white",
                isPastEvent && "opacity-50 cursor-not-allowed",
                isEventFull && !rsvpStatus && "bg-yellow-500 hover:bg-yellow-600",
                isLoading && "opacity-50",
              )}
              disabled={isPastEvent || isLoading}
              onClick={handleRSVPToggle}
            >
              {isLoading
                ? "Loading..."
                : isPastEvent
                  ? "Ended"
                  : rsvpStatus === "going"
                    ? "Going ✓"
                    : isEventFull
                      ? "Join Waitlist"
                      : "RSVP"}
            </Button>
          </div>

          {/* Host Info */}
          <div className="mt-3 flex items-center justify-between pt-3 border-t border-border-divider">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full bg-primary-cta/20 flex items-center justify-center">
                <span className="text-xs font-medium text-primary-cta">
                  {event.creator?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-xs text-body-text">Hosted by {event.creator?.name || "Unknown"}</span>
            </div>

            {/* Follow Button */}
            {showFollowButton && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs border-border-divider bg-transparent"
                onClick={handleFollowToggle}
              >
                <UserPlus className="h-3 w-3 mr-1" />
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Share Dialog */}
      <ShareEventDialog event={event} isOpen={showShareDialog} onClose={() => setShowShareDialog(false)} />
    </>
  )
}
