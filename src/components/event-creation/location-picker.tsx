"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LocationPickerProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function LocationPicker({ value, onChange, error }: LocationPickerProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { toast } = useToast()

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      })
      return
    }

    setIsGettingLocation(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // In a real app, you'd use a geocoding service here
          // For now, we'll just use coordinates
          const { latitude, longitude } = position.coords
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          onChange(locationString)
          toast({
            title: "Location found",
            description: "Current location has been added to the venue field.",
          })
        } catch (error) {
          toast({
            title: "Location error",
            description: "Failed to get location details.",
            variant: "destructive",
          })
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        let message = "Failed to get your location."
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location permission denied. Please enable location access."
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Location information is unavailable."
        }

        toast({
          title: "Location error",
          description: message,
          variant: "destructive",
        })
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="venue" className="text-heading-text">
        Venue/Location <span className="text-destructive">*</span>
      </Label>
      <div className="flex space-x-2">
        <Input
          id="venue"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter venue or location"
          className="flex-1 border-border-divider bg-background"
        />
        <Button
          type="button"
          variant="outline"
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
          className="border-border-divider bg-transparent"
        >
          {isGettingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
