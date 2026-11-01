import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import type { HttpClientError } from '@api/HttpClient'
import { useOnApiError } from '@hooks/useOnApiError'
import { useEffect } from 'react'

export type UseApiQueryOptions<T> = UseQueryOptions<T, HttpClientError>
export type UseApiQueryResult<T> = UseQueryResult<T, HttpClientError>

export const useApiQuery = <T>(
  options: UseApiQueryOptions<T>
): UseApiQueryResult<T> => {
  const onError = useOnApiError()
  const result = useQuery<T, HttpClientError>(options)

  useEffect(() => {
    if (result.error) {
      onError(result.error)
    }
  }, [result.error, onError])

  return result
}
