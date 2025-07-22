import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export interface AdminStats {
  pending_events: number
  total_users: number
  total_events: number
  total_rsvps: number
  total_bookmarks: number
  active_events: number
}

export interface AdminLog {
  id: string
  admin_id: string
  action: string
  target_id: string | null
  target_type: string | null
  details: Record<string, any>
  ip_address: string | null
  user_agent: string | null
  created_at: string
  admin?: {
    name: string
    email: string
  }
}

export interface PendingEvent {
  id: string
  title: string
  description: string
  date_time: string
  venue: string
  category: string
  tags: string[]
  max_participants: number | null
  additional_info: string | null
  created_at: string
  creator: {
    id: string
    name: string
    email: string
  }
}

export async function checkAdminAccess(): Promise<boolean> {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return false

  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

  return userData?.role === "admin"
}

export async function getAdminStats(): Promise<AdminStats | null> {
  const supabase = createClient()

  const isAdmin = await checkAdminAccess()
  if (!isAdmin) return null

  const { data, error } = await supabase.rpc("get_admin_stats")

  if (error) {
    console.error("Error fetching admin stats:", error)
    return null
  }

  return data as AdminStats
}

export async function getPendingEvents(): Promise<PendingEvent[]> {
  const supabase = createClient()

  const isAdmin = await checkAdminAccess()
  if (!isAdmin) return []

  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      date_time,
      venue,
      category,
      tags,
      max_participants,
      additional_info,
      created_at,
      creator:users!creator_id(id, name, email)
    `)
    .eq("is_verified", false)
    .eq("status", "pending_review")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching pending events:", error)
    return []
  }

  return data as PendingEvent[]
}

export async function getEventById(eventId: string): Promise<PendingEvent | null> {
  const supabase = createClient()

  const isAdmin = await checkAdminAccess()
  if (!isAdmin) return null

  const { data, error } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      date_time,
      venue,
      category,
      tags,
      max_participants,
      additional_info,
      created_at,
      creator:users!creator_id(id, name, email)
    `)
    .eq("id", eventId)
    .single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return data as PendingEvent
}

export async function getRecentAdminLogs(limit = 10): Promise<AdminLog[]> {
  const supabase = createClient()

  const isAdmin = await checkAdminAccess()
  if (!isAdmin) return []

  const { data, error } = await supabase
    .from("admin_logs")
    .select(`
      id,
      admin_id,
      action,
      target_id,
      target_type,
      details,
      ip_address,
      user_agent,
      created_at,
      admin:users!admin_id(name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching admin logs:", error)
    return []
  }

  return data as AdminLog[]
}

export async function logAdminAction(
  action: string,
  targetId?: string,
  targetType?: string,
  details: Record<string, any> = {},
): Promise<void> {
  const supabase = createClient()

  const isAdmin = await checkAdminAccess()
  if (!isAdmin) return

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  // Get IP address and user agent from headers
  const headersList = headers()
  const ipAddress = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || null
  const userAgent = headersList.get("user-agent") || null

  const { error } = await supabase.from("admin_logs").insert({
    admin_id: user.id,
    action,
    target_id: targetId,
    target_type: targetType,
    details,
    ip_address: ipAddress,
    user_agent: userAgent,
  })

  if (error) {
    console.error("Error logging admin action:", error)
  }
}
