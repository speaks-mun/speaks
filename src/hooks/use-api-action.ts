"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface UseApiActionOptions {
  successMessage?: string
  errorMessage?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export function useApiAction<T extends any[], R>(
  action: (...args: T) => Promise<R>,
  options: UseApiActionOptions = {},
) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const { toast } = useToast()

  const execute = async (...args: T): Promise<R | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await action(...args)

      if (options.successMessage) {
        toast({
          title: "Success",
          description: options.successMessage,
          variant: "default",
        })
      }

      options.onSuccess?.()
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error("An unexpected error occurred")
      setError(error)

      const errorMessage = options.errorMessage || error.message || "Something went wrong"
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      options.onError?.(error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    execute,
    pending: isLoading,
    error,
  }
}
