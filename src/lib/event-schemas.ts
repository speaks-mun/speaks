import { z } from "zod"

export const eventCreationSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters")
    .nonempty("Title is required"),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description must be less than 2000 characters")
    .nonempty("Description is required"),
  category: z.string().nonempty("Category is required"),
  date_time: z.date().min(new Date(), { message: "Event date must be in the future" }),
  venue: z.string().nonempty("Venue is required"),
  tags: z.string().optional(),
  max_participants: z.number().min(0, "Attendee limit must be 0 or greater").optional(),
  additional_info: z.string().optional(),
})

export type EventCreationFormData = z.infer<typeof eventCreationSchema>

export interface EventDraft {
  formData: Record<string, any>
  lastSaved: number
  isDirty: boolean
}
