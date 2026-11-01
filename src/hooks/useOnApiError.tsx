import type { HttpClientError } from '@api/HttpClient'
import { useCallback } from 'react'
import { useNotification } from '@hooks/useNotification'

export const useOnApiError = (): ((error: HttpClientError) => void) => {
  const notification = useNotification()

  return useCallback(
    (error: HttpClientError) => {
      notification.error({
        title: 'Server Error',
        description: error.message,
        placement: 'bottomRight',
        duration: 60,
      })
    },
    [notification]
  )
}
