"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Search, Filter, X, CalendarIcon, MapPin } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface FilterBarProps {
  filters: {
    category: string
    dateRange: { from?: Date; to?: Date }
    location: string
    tags: string
    sort: string
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
  hasActiveFilters: boolean
}

export function FilterBar({ filters, onFiltersChange, onClearFilters, hasActiveFilters }: FilterBarProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  const categories = [
    "All Categories",
    "Model UN Conference",
    "Youth Parliament",
    "Debate Competition",
    "Crisis Committee",
    "Specialized Agency",
    "Historical Committee",
  ]

  const sortOptions = [
    { value: "date_asc", label: "Date (Earliest First)" },
    { value: "date_desc", label: "Date (Latest First)" },
    { value: "participants_desc", label: "Most Popular" },
    { value: "participants_asc", label: "Least Popular" },
    { value: "created_desc", label: "Recently Added" },
  ]

  return (
    <div className="sticky top-20 z-40 bg-card-background/95 backdrop-blur-sm border-b border-border-divider p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Main Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-body-text" />
            <Input
              placeholder="Search events, committees, locations..."
              value={filters.tags}
              onChange={(e) => onFiltersChange({ ...filters, tags: e.target.value })}
              className="pl-10 border-border-divider bg-background"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Category Filter */}
          <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
            <SelectTrigger className="w-[180px] border-border-divider bg-background">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Date Range Picker */}
          <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal border-border-divider bg-background",
                  !filters.dateRange.from && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateRange.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} - {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange.from}
                selected={filters.dateRange}
                onSelect={(range) => {
                  onFiltersChange({ ...filters, dateRange: range || { from: undefined, to: undefined } })
                  if (range?.from && range?.to) {
                    setIsDatePickerOpen(false)
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {/* Location Filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-body-text" />
            <Input
              placeholder="Location or venue"
              value={filters.location}
              onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
              className="pl-10 w-[200px] border-border-divider bg-background"
            />
          </div>

          {/* Sort Options */}
          <Select value={filters.sort} onValueChange={(value) => onFiltersChange({ ...filters, sort: value })}>
            <SelectTrigger className="w-[180px] border-border-divider bg-background">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="outline" onClick={onClearFilters} className="border-border-divider bg-background">
              <X className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          )}

          {/* Filter Count Badge */}
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-primary-cta" />
              <span className="text-sm text-primary-cta font-medium">
                {
                  Object.values(filters).filter((value) => {
                    if (typeof value === "string") return value !== "" && value !== "All Categories"
                    if (typeof value === "object" && value !== null) {
                      return Object.values(value).some((v) => v !== undefined)
                    }
                    return false
                  }).length
                }{" "}
                active
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
