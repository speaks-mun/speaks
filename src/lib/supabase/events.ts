import { createClient } from "@/lib/supabase/client"

export interface Event {
  id: string
  title: string
  description: string
  category: string
  date_time: string
  venue_location: string
  tags: string[]
  attendee_limit: number
  participant_count: number
  is_verified: boolean
  status: string
  creator: {
    id: string
    name: string
    email: string
  }
}

export interface GetEventsParams {
  offset?: number
  limit?: number
  category?: string
  dateFrom?: Date
  dateTo?: Date
  location?: string
  tags?: string[]
  sortBy?: string
}

export async function getEvents(params: GetEventsParams = {}) {
  const supabase = createClient()
  const { offset = 0, limit = 20, category, dateFrom, dateTo, location, tags, sortBy = "date_asc" } = params

  let query = supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      category,
      date_time,
      venue_location,
      tags,
      attendee_limit,
      participant_count,
      is_verified,
      status,
      creator:users!creator_id (
        id,
        name,
        email
      )
    `)
    .eq("is_verified", true)
    .eq("status", "live")

  // Apply filters
  if (category) {
    query = query.eq("category", category)
  }

  if (dateFrom) {
    query = query.gte("date_time", dateFrom.toISOString())
  }

  if (dateTo) {
    query = query.lte("date_time", dateTo.toISOString())
  }

  if (location) {
    query = query.ilike("venue_location", `%${location}%`)
  }

  if (tags && tags.length > 0) {
    query = query.contains("tags", tags)
  }

  // Apply sorting
  switch (sortBy) {
    case "date_desc":
      query = query.order("date_time", { ascending: false })
      break
    case "title_asc":
      query = query.order("title", { ascending: true })
      break
    case "title_desc":
      query = query.order("title", { ascending: false })
      break
    case "participants_desc":
      query = query.order("participant_count", { ascending: false })
      break
    default:
      query = query.order("date_time", { ascending: true })
  }

  // Apply pagination
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch events: ${error.message}`)
  }

  return {
    events: data || [],
    hasMore: (data || []).length === limit,
  }
}

export async function getUserEvents(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      category,
      date_time,
      venue_location,
      tags,
      attendee_limit,
      participant_count,
      is_verified,
      status,
      creator:users!creator_id (
        id,
        name,
        email
      )
    `)
    .eq("creator_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch user events: ${error.message}`)
  }

  return data || []
}
