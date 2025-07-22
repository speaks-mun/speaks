"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StepIndicator } from "@/components/event-creation/step-indicator"
import { LocationPicker } from "@/components/event-creation/location-picker"
import { CalendarIcon, ChevronLeft, ChevronRight, Save, Eye, Send } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { eventCreationSchema, type EventCreationFormData } from "@/lib/event-schemas"
import { useEventDraft } from "@/hooks/use-event-draft"
import { useToast } from "@/hooks/use-toast"

const categories = [
  "Model UN Conference",
  "Youth Parliament",
  "Debate Competition",
  "Crisis Committee",
  "Specialized Agency",
  "Historical Committee",
]

const stepTitles = ["Basic Information", "Date & Location", "Additional Details"]

export default function CreateEventPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { draft, saveDraft, clearDraft, getLastSavedTime, hasDraft } = useEventDraft()

  const [currentStep, setCurrentStep] = useState(1)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [showDraftRestore, setShowDraftRestore] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset,
  } = useForm<EventCreationFormData>({
    resolver: zodResolver(eventCreationSchema),
    mode: "onBlur",
  })

  const watchedValues = watch()
  const titleLength = watch("title")?.length || 0
  const descriptionLength = watch("description")?.length || 0

  // Show draft restore option on mount
  useEffect(() => {
    if (hasDraft && draft) {
      setShowDraftRestore(true)
    }
  }, [hasDraft, draft])

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const formData = getValues()
      if (Object.keys(formData).some((key) => formData[key as keyof EventCreationFormData])) {
        saveDraft(formData, false)
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [getValues, saveDraft])

  const handleSaveDraft = () => {
    const formData = getValues()
    const success = saveDraft(formData, false)
    if (success) {
      toast({
        title: "Draft saved",
        description: `Draft saved at ${new Date().toLocaleTimeString()}`,
      })
    }
  }

  const handleRestoreDraft = () => {
    if (draft?.formData) {
      Object.entries(draft.formData).forEach(([key, value]) => {
        if (key === "date_time" && value) {
          setValue(key as keyof EventCreationFormData, new Date(value))
        } else if (value !== undefined) {
          setValue(key as keyof EventCreationFormData, value)
        }
      })
      setShowDraftRestore(false)
      toast({
        title: "Draft restored",
        description: "Your saved draft has been restored.",
      })
    }
  }

  const handleDiscardDraft = () => {
    clearDraft()
    setShowDraftRestore(false)
    toast({
      title: "Draft discarded",
      description: "Your saved draft has been discarded.",
    })
  }

  const onSubmit = (data: EventCreationFormData) => {
    console.log("Event data:", data)
    clearDraft()
    toast({
      title: "Event published!",
      description: "Your event has been published successfully.",
    })
    router.push("/my-events")
  }

  const handlePreview = () => {
    const formData = getValues()
    console.log("Preview data:", formData)
    toast({
      title: "Preview mode",
      description: "Preview functionality coming soon!",
    })
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1:
        return watchedValues.title && watchedValues.description && watchedValues.category
      case 2:
        return watchedValues.date_time && watchedValues.venue
      default:
        return true
    }
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-heading-text mb-2">Create New Event</h1>
        <p className="text-body-text">Share your MUN event with the community</p>
      </div>

      {/* Draft Restore Banner */}
      {showDraftRestore && (
        <Card className="mb-6 border-primary-cta/20 bg-primary-cta/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-heading-text">Draft found</p>
                <p className="text-sm text-body-text">
                  Draft saved at {getLastSavedTime()}. Would you like to restore it?
                </p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleDiscardDraft}>
                  Discard
                </Button>
                <Button size="sm" onClick={handleRestoreDraft} className="bg-primary-cta hover:bg-primary-cta/90">
                  Restore
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={3} stepTitles={stepTitles} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card className="border-border-divider bg-card-background">
            <CardHeader>
              <CardTitle className="text-heading-text">Basic Information</CardTitle>
              <CardDescription className="text-body-text">
                Tell us about your event and what makes it special
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-heading-text">
                  Event Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter your event title"
                  className="border-border-divider bg-background"
                />
                <div className="flex justify-between items-center">
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                  <span className="text-xs text-body-text ml-auto">{titleLength}/100</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-heading-text">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Describe your event, its objectives, and what participants can expect"
                  className="min-h-[120px] border-border-divider bg-background"
                />
                <div className="flex justify-between items-center">
                  {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                  <span className="text-xs text-body-text ml-auto">{descriptionLength}/2000</span>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-heading-text">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(value) => setValue("category", value)}>
                  <SelectTrigger className="border-border-divider bg-background">
                    <SelectValue placeholder="Select event category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Date & Location */}
        {currentStep === 2 && (
          <Card className="border-border-divider bg-card-background">
            <CardHeader>
              <CardTitle className="text-heading-text">Date & Location</CardTitle>
              <CardDescription className="text-body-text">When and where will your event take place?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date & Time */}
              <div className="space-y-2">
                <Label className="text-heading-text">
                  Event Date & Time <span className="text-destructive">*</span>
                </Label>
                <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-border-divider bg-background",
                        !watchedValues.date_time && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watchedValues.date_time ? (
                        format(watchedValues.date_time, "PPP 'at' p")
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={watchedValues.date_time}
                      onSelect={(date) => {
                        if (date) {
                          setValue("date_time", date)
                          setIsDatePickerOpen(false)
                        }
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date_time && <p className="text-sm text-destructive">{errors.date_time.message}</p>}
              </div>

              {/* Location */}
              <LocationPicker
                value={watchedValues.venue || ""}
                onChange={(value) => setValue("venue", value)}
                error={errors.venue?.message}
              />

              {/* Attendee Limit */}
              <div className="space-y-2">
                <Label htmlFor="max_participants" className="text-heading-text">
                  Maximum Participants
                </Label>
                <Input
                  id="max_participants"
                  type="number"
                  {...register("max_participants", { valueAsNumber: true })}
                  placeholder="Leave empty for unlimited"
                  className="border-border-divider bg-background"
                />
                {errors.max_participants && (
                  <p className="text-sm text-destructive">{errors.max_participants.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Additional Details */}
        {currentStep === 3 && (
          <Card className="border-border-divider bg-card-background">
            <CardHeader>
              <CardTitle className="text-heading-text">Additional Details</CardTitle>
              <CardDescription className="text-body-text">
                Add tags and extra information for your event
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags" className="text-heading-text">
                  Tags
                </Label>
                <Input
                  id="tags"
                  {...register("tags")}
                  placeholder="e.g., UNSC, UNHRC, Crisis Committee (comma-separated)"
                  className="border-border-divider bg-background"
                />
                <p className="text-xs text-body-text">Add relevant tags to help people find your event</p>
              </div>

              {/* Additional Info */}
              <div className="space-y-2">
                <Label htmlFor="additional_info" className="text-heading-text">
                  Additional Information
                </Label>
                <Textarea
                  id="additional_info"
                  {...register("additional_info")}
                  placeholder="Any additional details, requirements, or instructions for participants"
                  className="min-h-[100px] border-border-divider bg-background"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          {/* Step Navigation */}
          <div className="flex space-x-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                className="border-border-divider bg-transparent"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            )}
            {currentStep < 3 && (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceedToNextStep()}
                className="bg-primary-cta hover:bg-primary-cta/90 text-white"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              className="border-border-divider bg-transparent"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button type="button" variant="secondary" onClick={handlePreview}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            {currentStep === 3 && (
              <Button type="submit" className="bg-primary-cta hover:bg-primary-cta/90 text-white">
                <Send className="mr-2 h-4 w-4" />
                Publish Event
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
