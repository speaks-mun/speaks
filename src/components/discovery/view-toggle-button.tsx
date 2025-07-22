"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown } from "lucide-react"

export function ViewToggleButton() {
  const [isScrolledDown, setIsScrolledDown] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const threshold = 400 // Adjust based on your map height
      setIsScrolledDown(scrollPosition > threshold)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleToggle = () => {
    if (isScrolledDown) {
      // Scroll to top (map view)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      // Scroll to events list
      const eventsSection = document.getElementById("events-list")
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <Button
      onClick={handleToggle}
      className="fixed bottom-24 right-4 z-50 rounded-full bg-primary-cta hover:bg-primary-cta/90 text-white shadow-lg md:bottom-6"
      size="lg"
    >
      {isScrolledDown ? (
        <>
          <ChevronUp className="mr-2 h-4 w-4" />
          Back to Map
        </>
      ) : (
        <>
          <ChevronDown className="mr-2 h-4 w-4" />
          View Events
        </>
      )}
    </Button>
  )
}
