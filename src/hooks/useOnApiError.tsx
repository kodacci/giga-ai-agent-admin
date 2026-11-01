import type { HttpClientError } from '@api/HttpClient'
import { useCallback } from 'react'
import { notification } from 'antd'

export const useOnApiError = (): ((error: HttpClientError) => void) => {
  const [api] = notification.useNotification()

  return useCallback((error: HttpClientError) => {
    api.error({
      title: 'Server Error',
      description: error.message,
      placement: 'bottomRight',
      duration: 60,
    })
  }, [api.error])
}