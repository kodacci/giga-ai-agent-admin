export interface GetAiModelsResponse {
  models: string[]
}

export const getAiModels = async (): Promise<string[]> => {
  const response = await fetch('/api/v1/ai-agent/models')
  if (!response.ok) {
    throw new Error(
      `AI models request failed with status ${response.status.toString()}`
    )
  }
  const body = (await response.json()) as GetAiModelsResponse
  return body.models
}
