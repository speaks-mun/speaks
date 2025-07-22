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
  return false
}

export async function getAdminStats(): Promise<AdminStats | null> {
  return {
    pending_events: 0,
    total_users: 0,
    total_events: 0,
    total_rsvps: 0,
    total_bookmarks: 0,
    active_events: 0,
  }
}

export async function getPendingEvents(): Promise<PendingEvent[]> {
  return []
}

export async function getEventById(eventId: string): Promise<PendingEvent | null> {
  return null
}

export async function getRecentAdminLogs(limit = 10): Promise<AdminLog[]> {
  return []
}

export async function logAdminAction(
  action: string,
  targetId?: string,
  targetType?: string,
  details: Record<string, any> = {},
): Promise<void> {}
