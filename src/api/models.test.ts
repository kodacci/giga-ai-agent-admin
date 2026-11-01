import { describe, expect, it, jest } from '@jest/globals'
import { modelsApi } from '@api/models'
import { MODELS_API_PATH } from '@api/constants'
import type { HttpClient } from '@api/HttpClient'
import type { QueryFunctionContext } from '@tanstack/react-query'

const makeHttpClient = (
  response: unknown
): { httpClient: HttpClient; get: jest.Mock } => {
  const get = jest.fn<() => Promise<unknown>>().mockResolvedValue(response)
  return {
    get,
    httpClient: {
      get,
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    } as unknown as HttpClient,
  }
}

describe('modelsApi', () => {
  it('exposes a stable query key for the model list', () => {
    const { listModels } = modelsApi(makeHttpClient({ models: [] }).httpClient)

    expect(listModels.queryKey).toEqual(['models'])
  })

  it('fetches the model list from the models endpoint', async () => {
    const { httpClient, get } = makeHttpClient({
      models: ['GigaChat (salutedevices)'],
    })
    const { listModels } = modelsApi(httpClient)

    const response = await listModels.queryFn({
      queryKey: listModels.queryKey,
    } as QueryFunctionContext)

    expect(response).toEqual({ models: ['GigaChat (salutedevices)'] })
    expect(get).toHaveBeenCalledWith(MODELS_API_PATH)
  })
})
