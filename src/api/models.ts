import type { QueryApiMethod } from '@api/types'
import type { HttpClient } from '@api/HttpClient'
import { MODELS_API_PATH } from '@api/constants'

export interface ModelsApi {
  listModels: QueryApiMethod<GetAiModelsResponse>
}

export interface GetAiModelsResponse {
  models: string[]
}

export const modelsApi = (httpClient: HttpClient): ModelsApi => ({
  listModels: {
    queryKey: ['models'],
    queryFn: (): Promise<GetAiModelsResponse> =>
      httpClient.get<GetAiModelsResponse>(MODELS_API_PATH),
  },
})
