"use client"

import { useState, useEffect, useCallback } from "react"
import type { EventDraft } from "@/lib/event-schemas"

const DRAFT_KEY = "event-draft"

export function useEventDraft() {
  const [draft, setDraft] = useState<EventDraft | null>(null)

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_KEY)
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft) as EventDraft
        setDraft(parsed)
      }
    } catch (error) {
      console.error("Failed to load draft:", error)
    }
  }, [])

  // Save draft to localStorage
  const saveDraft = useCallback((formData: Record<string, any>, isDirty = true) => {
    const draftData: EventDraft = {
      formData,
      lastSaved: Date.now(),
      isDirty,
    }

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData))
      setDraft(draftData)
      return true
    } catch (error) {
      console.error("Failed to save draft:", error)
      return false
    }
  }, [])

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY)
      setDraft(null)
    } catch (error) {
      console.error("Failed to clear draft:", error)
    }
  }, [])

  // Get formatted last saved time
  const getLastSavedTime = useCallback(() => {
    if (!draft?.lastSaved) return null
    return new Date(draft.lastSaved).toLocaleTimeString()
  }, [draft])

  return {
    draft: null,
    saveDraft,
    clearDraft,
    getLastSavedTime,
    hasDraft: false,
  }
}
