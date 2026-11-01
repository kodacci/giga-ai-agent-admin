import type { HttpClient } from '@api/HttpClient'
import { type ModelsApi, modelsApi } from '@api/models'

export interface GigaAiAgentApi extends ModelsApi {}

export const api = (httpClient: HttpClient): GigaAiAgentApi => ({
  ...modelsApi(httpClient),
})
