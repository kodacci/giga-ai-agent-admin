import type { FC, PropsWithChildren, ReactNode } from 'react'
import { describe, expect, it } from '@jest/globals'
import { renderHook, screen, waitFor } from '@testing-library/react'
import { App as AntdApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useApiQuery } from '@hooks/useApiQuery'
import type { UseApiQueryOptions } from '@hooks/useApiQuery'
import type { HttpClientError } from '@api/HttpClient'

const httpError = (message: string): HttpClientError => ({
  name: 'HttpClientError',
  message,
  isProblemDetail: false,
})

const createWrapper = (): FC<PropsWithChildren> => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  const Wrapper = ({ children }: PropsWithChildren): ReactNode => (
    <AntdApp>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AntdApp>
  )

  return Wrapper
}

describe('useApiQuery', () => {
  it('passes the query result through to react-query', async () => {
    const { result } = renderHook(
      () =>
        useApiQuery<string>({
          queryKey: ['probe'],
          queryFn: (): Promise<string> => Promise.resolve('GigaChat'),
        }),
      { wrapper: createWrapper() }
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toBe('GigaChat')
  })

  it('surfaces request errors in a notification', async () => {
    const options: UseApiQueryOptions<string> = {
      queryKey: ['probe'],
      queryFn: (): Promise<string> =>
        Promise.reject(httpError('Http request failed: boom')),
    }

    const { result } = renderHook(() => useApiQuery<string>(options), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(await screen.findByText('Server Error')).toBeInTheDocument()
    expect(screen.getByText('Http request failed: boom')).toBeInTheDocument()
  })
})
