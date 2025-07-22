"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { EventCardInteractive } from "@/components/event-card-interactive"
import { FilterBar } from "@/components/discovery/filter-bar"
import { ViewToggleButton } from "@/components/discovery/view-toggle-button"
import { EmptyState } from "@/components/empty-state"
import { EventCardSkeleton } from "@/components/discovery/event-card-skeleton"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Plus, MapPin } from "lucide-react"
import Link from "next/link"
import { getEvents, type Event, type EventFilters } from "@/lib/supabase/events"

export default function DiscoverPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State management
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMoreEvents, setHasMoreEvents] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter state
  const [filters, setFilters] = useState<EventFilters>({
    category: searchParams.get("category") || "All Categories",
    dateRange: {
      from: searchParams.get("from") ? new Date(searchParams.get("from")!) : undefined,
      to: searchParams.get("to") ? new Date(searchParams.get("to")!) : undefined,
    },
    location: searchParams.get("location") || "",
    tags: searchParams.get("tags") || "",
    sort: searchParams.get("sort") || "date_asc",
  })

  // Check if filters are active
  const hasActiveFilters = Boolean(
    (filters.category && filters.category !== "All Categories") ||
      filters.dateRange?.from ||
      filters.location ||
      filters.tags ||
      (filters.sort && filters.sort !== "date_asc"),
  )

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: EventFilters) => {
      const params = new URLSearchParams()

      if (newFilters.category && newFilters.category !== "All Categories") {
        params.set("category", newFilters.category)
      }
      if (newFilters.dateRange?.from) {
        params.set("from", newFilters.dateRange.from.toISOString())
      }
      if (newFilters.dateRange?.to) {
        params.set("to", newFilters.dateRange.to.toISOString())
      }
      if (newFilters.location) {
        params.set("location", newFilters.location)
      }
      if (newFilters.tags) {
        params.set("tags", newFilters.tags)
      }
      if (newFilters.sort && newFilters.sort !== "date_asc") {
        params.set("sort", newFilters.sort)
      }

      const queryString = params.toString()
      const newURL = queryString ? `/discover?${queryString}` : "/discover"
      router.push(newURL, { scroll: false })
    },
    [router],
  )

  // Load events
  const loadEvents = useCallback(
    async (isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true)
        } else {
          setIsLoading(true)
          setError(null)
        }

        const offset = isLoadMore ? events.length : 0
        const { events: newEvents, hasMore } = await getEvents(filters, offset, 20)

        if (isLoadMore) {
          setEvents((prev) => [...prev, ...newEvents])
        } else {
          setEvents(newEvents)
        }

        setHasMoreEvents(hasMore)
      } catch (err) {
        console.error("Error loading events:", err)
        setError("Failed to load events. Please try again.")
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [filters, events.length],
  )

  // Handle filter changes
  const handleFiltersChange = (newFilters: EventFilters) => {
    setFilters(newFilters)
    updateURL(newFilters)
    setHasMoreEvents(true)
  }

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters: EventFilters = {
      category: "All Categories",
      dateRange: { from: undefined, to: undefined },
      location: "",
      tags: "",
      sort: "date_asc",
    }
    setFilters(clearedFilters)
    updateURL(clearedFilters)
    setHasMoreEvents(true)
  }

  // Load initial events and when filters change
  useEffect(() => {
    loadEvents(false)
  }, [filters])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore && hasMoreEvents && !isLoading) {
          loadEvents(true)
        }
      },
      { threshold: 0.1 },
    )

    const sentinel = document.getElementById("scroll-sentinel")
    if (sentinel) {
      observer.observe(sentinel)
    }

    return () => observer.disconnect()
  }, [isLoadingMore, hasMoreEvents, isLoading, loadEvents])

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl">
        {/* Map View Placeholder */}
        <div className="h-96 bg-gray-200 dark:bg-gray-800 flex items-center justify-center mb-8 rounded-lg">
          <div className="text-center">
            <MapPin className="mx-auto h-12 w-12 text-body-text mb-4" />
            <p className="text-body-text">Map View Placeholder</p>
          </div>
        </div>

        {/* Filter Bar Skeleton */}
        <div className="mb-8 p-4 bg-card-background border border-border-divider rounded-lg">
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="flex space-x-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Event Cards Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl">
        <EmptyState
          title="Error loading events"
          subtitle={error}
          icon={<Search className="mx-auto h-16 w-16 text-body-text" />}
          actionButtons={[
            <Button key="retry" onClick={() => loadEvents(false)} className="bg-primary-cta hover:bg-primary-cta/90">
              Try Again
            </Button>,
          ]}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl">
      {/* Map View Placeholder */}
      <div className="h-96 bg-gradient-to-br from-primary-cta/10 to-primary-cta/20 flex items-center justify-center mb-8 rounded-lg border border-border-divider">
        <div className="text-center">
          <MapPin className="mx-auto h-16 w-16 text-primary-cta mb-4" />
          <h3 className="text-xl font-semibold text-heading-text mb-2">Interactive Map Coming Soon</h3>
          <p className="text-body-text">Discover MUN events near you with our interactive map view</p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Events List Section */}
      <div id="events-list" className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-heading-text">
              {hasActiveFilters ? "Filtered Events" : "All Events"}
            </h2>
            <p className="text-body-text">
              {events.length} event{events.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Events Grid or Empty State */}
        {events.length === 0 ? (
          <EmptyState
            title="No events found"
            subtitle="Try adjusting your filters or create the first event!"
            icon={<Search className="mx-auto h-16 w-16 text-body-text" />}
            actionButtons={[
              <Button key="clear" variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>,
              <Button key="create" className="bg-primary-cta hover:bg-primary-cta/90 text-white" asChild>
                <Link href="/create-event">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Link>
              </Button>,
            ]}
          />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCardInteractive key={event.id} event={event} showFollowButton={true} />
              ))}
            </div>

            {/* Load More / End State */}
            <div className="mt-12 text-center">
              {isLoadingMore ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-primary-cta" />
                  <span className="text-body-text">Loading more events...</span>
                </div>
              ) : hasMoreEvents ? (
                <div id="scroll-sentinel" className="h-20 flex items-center justify-center">
                  <p className="text-body-text">Scroll down to load more events</p>
                </div>
              ) : (
                <div className="py-8">
                  <p className="text-body-text font-medium">🎉 You've reached the end!</p>
                  <p className="text-body-text text-sm mt-1">No more events to load.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* View Toggle Button */}
      <ViewToggleButton />
    </div>
  )
}
