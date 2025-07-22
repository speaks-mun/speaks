import { createClient } from "@/lib/supabase/server"

export interface Event {
  id: string
  creator_id: string
  title: string
  description: string
  date_time: string
  venue: string
  category: string
  tags: string[]
  max_participants: number | null
  current_participants: number
  image_url: string | null
  status: string
  is_verified: boolean
  additional_info: string | null
  created_at: string
  updated_at: string
  creator?: {
    name: string
    avatar_url?: string
  }
  is_bookmarked?: boolean
  user_rsvp_status?: string | null
}

export interface EventFilters {
  category?: string
  dateRange?: { from?: Date; to?: Date }
  location?: string
  tags?: string
  sort?: string
}

export async function getEvents(
  filters: EventFilters = {},
  offset = 0,
  limit = 20,
): Promise<{ events: Event[]; hasMore: boolean }> {
  const supabase = createClient()

  let query = supabase
    .from("events")
    .select(
      `
      *,
      creator:users!creator_id(name, avatar_url),
      bookmarks!left(user_id),
      rsvps!left(user_id, status)
    `,
    )
    .eq("is_verified", true)
    .eq("status", "live")

  // Apply filters
  if (filters.category && filters.category !== "All Categories") {
    query = query.eq("category", filters.category)
  }

  if (filters.dateRange?.from) {
    query = query.gte("date_time", filters.dateRange.from.toISOString())
  }

  if (filters.dateRange?.to) {
    query = query.lte("date_time", filters.dateRange.to.toISOString())
  }

  if (filters.location) {
    query = query.ilike("venue", `%${filters.location}%`)
  }

  if (filters.tags) {
    const searchTerms = filters.tags.toLowerCase().split(" ")
    searchTerms.forEach((term) => {
      query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,tags.cs.{${term}},venue.ilike.%${term}%`)
    })
  }

  // Apply sorting
  switch (filters.sort) {
    case "date_desc":
      query = query.order("date_time", { ascending: false })
      break
    case "participants_desc":
      query = query.order("current_participants", { ascending: false })
      break
    case "participants_asc":
      query = query.order("current_participants", { ascending: true })
      break
    case "created_desc":
      query = query.order("created_at", { ascending: false })
      break
    default:
      query = query.order("date_time", { ascending: true })
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    console.error("Error fetching events:", error)
    return { events: [], hasMore: false }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Process events to include bookmark and RSVP status
  const events: Event[] = (data || []).map((event: any) => ({
    ...event,
    creator: event.creator,
    is_bookmarked: user ? event.bookmarks.some((b: any) => b.user_id === user.id) : false,
    user_rsvp_status: user ? event.rsvps.find((r: any) => r.user_id === user.id)?.status || null : null,
  }))

  return {
    events,
    hasMore: data?.length === limit,
  }
}

export async function getUserEvents(userId: string, type: "created" | "attending" | "bookmarked") {
  const supabase = createClient()

  let query

  switch (type) {
    case "created":
      query = supabase
        .from("events")
        .select("*, creator:users!creator_id(name, avatar_url)")
        .eq("creator_id", userId)
        .order("created_at", { ascending: false })
      break

    case "attending":
      query = supabase
        .from("rsvps")
        .select("*, event:events(*, creator:users!creator_id(name, avatar_url))")
        .eq("user_id", userId)
        .eq("status", "going")
        .order("created_at", { ascending: false })
      break

    case "bookmarked":
      query = supabase
        .from("bookmarks")
        .select("*, event:events(*, creator:users!creator_id(name, avatar_url))")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      break
  }

  const { data, error } = await query

  if (error) {
    console.error(`Error fetching ${type} events:`, error)
    return []
  }

  if (type === "created") {
    return data || []
  }

  return (data || []).map((item: any) => item.event)
}
