import type { FC, PropsWithChildren, ReactNode } from 'react'
import { describe, expect, it } from '@jest/globals'
import { renderHook } from '@testing-library/react'
import { ApiContext } from '@context/ApiContext'
import { useApi } from '@hooks/useApi'
import type { GigaAiAgentApi } from '@api/api'

const fakeApi = {
  listModels: {
    queryKey: ['fake-models'],
    queryFn: (): Promise<null> => Promise.resolve(null),
  },
} as unknown as GigaAiAgentApi

const wrapper: FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): ReactNode => (
  <ApiContext value={fakeApi}>{children}</ApiContext>
)

describe('useApi', () => {
  it('returns the api provided through the context', () => {
    const { result } = renderHook((): GigaAiAgentApi => useApi(), { wrapper })

    expect(result.current).toBe(fakeApi)
  })

  it('falls back to the real agent api without a provider', () => {
    const { result } = renderHook((): GigaAiAgentApi => useApi())

    expect(result.current.listModels.queryKey).toEqual(['models'])
  })
})
