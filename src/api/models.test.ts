import { describe, expect, it, jest, afterEach } from '@jest/globals'
import { getAiModels } from './models'

const jsonResponse = (status: number, body: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }) as Response

const setFetch = (mock: typeof fetch): void => {
  ;(globalThis as unknown as { fetch: typeof fetch }).fetch = mock
}

const stubFetch = (
  impl: () => Promise<Response>
): jest.MockedFunction<typeof fetch> => {
  const mock = jest.fn<typeof fetch>(impl)
  setFetch(mock)
  return mock
}

afterEach(() => {
  jest.restoreAllMocks()
  delete (globalThis as { fetch?: typeof fetch }).fetch
})

describe('getAiModels', () => {
  it('requests the models endpoint via a relative path', async () => {
    const fetchMock = stubFetch(() =>
      Promise.resolve(jsonResponse(200, { models: ['GigaChat'] }))
    )

    await getAiModels()

    expect(fetchMock).toHaveBeenCalledWith('/api/v1/ai-agent/models')
  })

  it('unwraps the models array from the response', async () => {
    stubFetch(() =>
      Promise.resolve(
        jsonResponse(200, {
          models: ['GigaChat (salutedevices)', 'Embeddings (salutedevices)'],
        })
      )
    )

    await expect(getAiModels()).resolves.toEqual([
      'GigaChat (salutedevices)',
      'Embeddings (salutedevices)',
    ])
  })

  it('throws on a non-2xx response', async () => {
    stubFetch(() => Promise.resolve(jsonResponse(500, {})))

    await expect(getAiModels()).rejects.toThrow(
      'AI models request failed with status 500'
    )
  })

  it('propagates network failures', async () => {
    stubFetch(() => Promise.reject(new TypeError('Failed to fetch')))

    await expect(getAiModels()).rejects.toThrow('Failed to fetch')
  })
})
