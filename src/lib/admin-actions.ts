"use server"

import { createClient } from "@/lib/supabase/server"
import { checkAdminAccess, logAdminAction } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function approveEvent(eventId: string) {
  const isAdmin = await checkAdminAccess()
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required")
  }

  const supabase = createClient()

  // Get event details for logging
  const { data: event } = await supabase.from("events").select("title, creator_id").eq("id", eventId).single()

  // Update event status
  const { error } = await supabase
    .from("events")
    .update({
      is_verified: true,
      status: "live",
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId)

  if (error) {
    throw new Error("Failed to approve event")
  }

  // Log admin action
  await logAdminAction("approve_event", eventId, "event", {
    event_title: event?.title,
    creator_id: event?.creator_id,
  })

  revalidatePath("/admin/pending-events")
  return { success: true, message: "Event approved successfully" }
}

export async function rejectEvent(eventId: string, reason: string) {
  const isAdmin = await checkAdminAccess()
  if (!isAdmin) {
    throw new Error("Unauthorized: Admin access required")
  }

  const supabase = createClient()

  // Get event details for logging
  const { data: event } = await supabase.from("events").select("title, creator_id").eq("id", eventId).single()

  // Update event status
  const { error } = await supabase
    .from("events")
    .update({
      is_verified: false,
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId)

  if (error) {
    throw new Error("Failed to reject event")
  }

  // Log admin action
  await logAdminAction("reject_event", eventId, "event", {
    event_title: event?.title,
    creator_id: event?.creator_id,
    rejection_reason: reason,
  })

  revalidatePath("/admin/pending-events")
  return { success: true, message: "Event rejected successfully" }
}

export async function checkUserAdminStatus() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (userData?.role !== "admin") {
    redirect("/discover")
  }

  return true
}
