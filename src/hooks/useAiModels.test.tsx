import { describe, expect, it, jest, afterEach } from '@jest/globals'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { FC, PropsWithChildren, ReactNode } from 'react'
import { useAiModels } from './useAiModels'

const jsonResponse = (status: number, body: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }) as Response

const setFetch = (mock: typeof fetch): void => {
  ;(globalThis as unknown as { fetch: typeof fetch }).fetch = mock
}

const createWrapper = (): FC<PropsWithChildren> => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const Wrapper: FC<PropsWithChildren> = ({ children }): ReactNode => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  return Wrapper
}

afterEach(() => {
  jest.restoreAllMocks()
  delete (globalThis as { fetch?: typeof fetch }).fetch
})

describe('useAiModels', () => {
  it('returns the model list on success', async () => {
    setFetch(
      jest.fn<typeof fetch>(() =>
        Promise.resolve(
          jsonResponse(200, { models: ['GigaChat (salutedevices)'] })
        )
      )
    )

    const { result } = renderHook(() => useAiModels(), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.data).toEqual(['GigaChat (salutedevices)'])
  })

  it('reports error state when the request fails', async () => {
    setFetch(
      jest.fn<typeof fetch>(() => Promise.resolve(jsonResponse(500, {})))
    )

    const { result } = renderHook(() => useAiModels(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })
})
