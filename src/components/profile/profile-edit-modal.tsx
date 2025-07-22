"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"

const profileEditSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  interests: z.string().optional(),
  location: z.string().max(100, "Location must be less than 100 characters").optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
})

type ProfileEditFormData = z.infer<typeof profileEditSchema>

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    name: string
    bio?: string
    interests?: string[]
    location?: string
    website?: string
    twitter?: string
    linkedin?: string
  }
  onSave: (data: any) => void
}

export function ProfileEditModal({ isOpen, onClose, user, onSave }: ProfileEditModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileEditFormData>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      interests: user.interests?.join(", ") || "",
      location: user.location || "",
      website: user.website || "",
      twitter: user.twitter || "",
      linkedin: user.linkedin || "",
    },
  })

  const onSubmit = async (data: ProfileEditFormData) => {
    setIsLoading(true)

    try {
      // Process interests
      const interests = data.interests
        ? data.interests
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []

      const updateData = {
        name: data.name,
        bio: data.bio || null,
        interests,
        location: data.location || null,
        website: data.website || null,
        twitter: data.twitter || null,
        linkedin: data.linkedin || null,
        updated_at: new Date().toISOString(),
      }

      // Optimistic update
      onSave(updateData)

      // Update in Supabase
      const { error } = await supabase.from("users").update(updateData).eq("id", user.id)

      if (error) {
        throw error
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })

      onClose()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information and preferences</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Display Name *</Label>
            <Input id="name" {...register("name")} className="border-border-divider bg-background" />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              {...register("bio")}
              placeholder="Tell us about yourself..."
              className="min-h-[80px] border-border-divider bg-background"
            />
            {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label htmlFor="interests">Interests</Label>
            <Input
              id="interests"
              {...register("interests")}
              placeholder="e.g., UNSC, UNHRC, Crisis Committee (comma-separated)"
              className="border-border-divider bg-background"
            />
            <p className="text-xs text-body-text">Enter your MUN interests separated by commas</p>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="City, Country"
              className="border-border-divider bg-background"
            />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              {...register("website")}
              placeholder="https://yourwebsite.com"
              className="border-border-divider bg-background"
            />
            {errors.website && <p className="text-sm text-destructive">{errors.website.message}</p>}
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                {...register("twitter")}
                placeholder="@username"
                className="border-border-divider bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                {...register("linkedin")}
                placeholder="linkedin.com/in/username"
                className="border-border-divider bg-background"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary-cta hover:bg-primary-cta/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
