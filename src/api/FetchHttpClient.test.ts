import { describe, expect, it, jest, afterEach } from '@jest/globals'
import { FetchHttpClient } from '@api/FetchHttpClient'
import { HTTP_CLIENT_ERROR_NAME } from '@api/constants'
import type { HttpClientError, ProblemDetail } from '@api/HttpClient'

const setFetch = (mock: typeof fetch): void => {
  ;(globalThis as unknown as { fetch: typeof fetch }).fetch = mock
}

const jsonResponse = (status: number, body: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    text: () => Promise.resolve(JSON.stringify(body)),
  }) as Response

const textResponse = (status: number, raw: string): Response =>
  ({
    ok: false,
    status,
    text: () => Promise.resolve(raw),
  }) as Response

const requestOf = (
  call: unknown
): { url: string; init: RequestInit; headers: Record<string, string> } => {
  const [url, init] = call as [string, RequestInit]
  return { url, init, headers: init.headers as Record<string, string> }
}

const rejection = async (
  promise: Promise<unknown>
): Promise<HttpClientError> => {
  let caught: unknown
  try {
    await promise
  } catch (error: unknown) {
    caught = error
  }

  if (caught === undefined) {
    throw new Error('Expected the request to reject')
  }

  return caught as HttpClientError
}

afterEach(() => {
  jest.restoreAllMocks()
  delete (globalThis as { fetch?: typeof fetch }).fetch
})

describe('FetchHttpClient', () => {
  const client = new FetchHttpClient()

  it('resolves parsed JSON on a successful GET', async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(200, { models: ['GigaChat'] }))
    setFetch(fetchMock)

    await expect(client.get<{ models: string[] }>('/models')).resolves.toEqual({
      models: ['GigaChat'],
    })

    const request = requestOf(fetchMock.mock.calls[0])
    expect(request.url).toBe('/models')
    expect(request.init.method).toBe('GET')
    expect(request.init.body).toBeNull()
  })

  it('sends content type and request trace headers', async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(200, {}))
    setFetch(fetchMock)

    await client.get('/models')

    const { headers } = requestOf(fetchMock.mock.calls[0])
    expect(headers['Content-Type']).toBe('application/json')
    expect(headers.rqUid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
    expect(Number.isNaN(Date.parse(headers.rqTm ?? ''))).toBe(false)
  })

  it('serializes query params into the URL', async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(200, {}))
    setFetch(fetchMock)

    await client.get('/models', { page: 2, flag: true, q: 'giga chat' })

    expect(requestOf(fetchMock.mock.calls[0]).url).toBe(
      '/models?page=2&flag=true&q=giga+chat'
    )
  })

  it('sends a JSON body on POST', async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(200, { ok: true }))
    setFetch(fetchMock)

    await expect(
      client.post<{ a: number }, { ok: boolean }>('/x', { a: 1 })
    ).resolves.toEqual({ ok: true })

    const request = requestOf(fetchMock.mock.calls[0])
    expect(request.init.method).toBe('POST')
    expect(request.init.body).toBe('{"a":1}')
  })

  it('issues PUT and DELETE requests', async () => {
    const fetchMock = jest
      .fn<typeof fetch>()
      .mockResolvedValue(jsonResponse(200, null))
    setFetch(fetchMock)

    await client.put('/x', { a: 1 })
    await client.delete('/x')

    expect(requestOf(fetchMock.mock.calls[0]).init.method).toBe('PUT')
    expect(requestOf(fetchMock.mock.calls[1]).init.method).toBe('DELETE')
  })

  it('rejects with a problem detail error for RFC-7807 responses', async () => {
    const problem: ProblemDetail = {
      type: 'about:blank',
      title: 'Unprocessable Entity',
      status: 422,
      detail: 'Model is not available',
      code: 'MODEL_UNAVAILABLE',
    }
    setFetch(
      jest
        .fn<typeof fetch>()
        .mockResolvedValue(textResponse(422, JSON.stringify(problem)))
    )

    const error = await rejection(client.get('/models'))

    expect(error.name).toBe(HTTP_CLIENT_ERROR_NAME)
    expect(error.isProblemDetail).toBe(true)
    expect(error.problemDetail).toEqual(problem)
    expect(error.message).toBe(
      'Http request failed with status 422: Model is not available'
    )
  })

  it('rejects with a generic error for JSON bodies that are not problem details', async () => {
    setFetch(
      jest
        .fn<typeof fetch>()
        .mockResolvedValue(textResponse(400, '{"foo":"bar"}'))
    )

    const error = await rejection(client.get('/models'))

    expect(error.name).toBe(HTTP_CLIENT_ERROR_NAME)
    expect(error.isProblemDetail).toBe(false)
    expect(error.message).toBe(
      'Http request failed: Unknown error: {"foo":"bar"}'
    )
  })

  it('rejects with a generic error for non-JSON error bodies', async () => {
    jest.spyOn(console, 'error').mockImplementation((): void => undefined)
    setFetch(
      jest.fn<typeof fetch>().mockResolvedValue(textResponse(500, 'oops'))
    )

    const error = await rejection(client.get('/models'))

    expect(error.isProblemDetail).toBe(false)
    expect(error.message).toBe(
      'Http request failed: Unknown error: "status: 500, body: oops"'
    )
  })

  it('wraps transport failures into an http client error', async () => {
    setFetch(
      jest
        .fn<typeof fetch>()
        .mockRejectedValue(new TypeError('Failed to fetch'))
    )

    const error = await rejection(client.get('/models'))

    expect(error.name).toBe(HTTP_CLIENT_ERROR_NAME)
    expect(error.isProblemDetail).toBe(false)
    expect(error.message).toBe('Http request failed: Failed to fetch')
    expect(error.error).toBeInstanceOf(TypeError)
  })
})
