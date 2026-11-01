import { describe, expect, it, jest } from '@jest/globals'
import { api } from '@api/api'
import type { HttpClient } from '@api/HttpClient'

const httpClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
} as unknown as HttpClient

describe('api', () => {
  it('aggregates the models api into the agent api surface', () => {
    const gigaApi = api(httpClient)

    expect(gigaApi.listModels.queryKey).toEqual(['models'])
    expect(gigaApi.listModels.queryFn).toBeInstanceOf(Function)
  })
})
