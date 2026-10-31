import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { getAiModels } from '@api/models'

export const useAiModels = (): UseQueryResult<string[]> =>
  useQuery({
    queryKey: ['ai-models'],
    queryFn: getAiModels,
  })
