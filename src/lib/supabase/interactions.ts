"use server"

import { createClient } from "@/lib/supabase/server"

export async function toggleBookmark(eventId: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Check if bookmark exists
  const { data: existingBookmark } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .single()

  if (existingBookmark) {
    // Remove bookmark
    const { error } = await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("event_id", eventId)

    if (error) throw error
    return { bookmarked: false }
  } else {
    // Add bookmark
    const { error } = await supabase.from("bookmarks").insert({
      user_id: user.id,
      event_id: eventId,
    })

    if (error) throw error
    return { bookmarked: true }
  }
}

export async function toggleRSVP(eventId: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  // Check if RSVP exists
  const { data: existingRSVP } = await supabase
    .from("rsvps")
    .select("id, status")
    .eq("user_id", user.id)
    .eq("event_id", eventId)
    .single()

  if (existingRSVP) {
    // Remove RSVP
    const { error } = await supabase.from("rsvps").delete().eq("user_id", user.id).eq("event_id", eventId)

    if (error) throw error

    // Update event participant count
    await supabase.rpc("decrement_participants", { event_id: eventId })

    return { rsvp_status: null }
  } else {
    // Add RSVP
    const { error } = await supabase.from("rsvps").insert({
      user_id: user.id,
      event_id: eventId,
      status: "going",
    })

    if (error) throw error

    // Update event participant count
    await supabase.rpc("increment_participants", { event_id: eventId })

    return { rsvp_status: "going" }
  }
}

export async function toggleFollow(userId: string) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  if (user.id === userId) {
    throw new Error("Cannot follow yourself")
  }

  // Check if follow exists
  const { data: existingFollow } = await supabase
    .from("followers")
    .select("*")
    .eq("follower_id", user.id)
    .eq("followed_id", userId)
    .single()

  if (existingFollow) {
    // Unfollow
    const { error } = await supabase.from("followers").delete().eq("follower_id", user.id).eq("followed_id", userId)

    if (error) throw error
    return { following: false }
  } else {
    // Follow
    const { error } = await supabase.from("followers").insert({
      follower_id: user.id,
      followed_id: userId,
    })

    if (error) throw error
    return { following: true }
  }
}
