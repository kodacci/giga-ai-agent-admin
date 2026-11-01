import type { HttpClient } from '@api/HttpClient'
import { type ModelsApi, modelsApi } from '@api/models'

export type GigaAiAgentApi = ModelsApi

export const api = (httpClient: HttpClient): GigaAiAgentApi => ({
  ...modelsApi(httpClient),
})
