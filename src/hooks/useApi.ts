import type { GigaAiAgentApi } from '@api/api'
import { useContext } from 'react'
import { ApiContext } from '@context/ApiContext'

export const useApi = (): GigaAiAgentApi => useContext<GigaAiAgentApi>(ApiContext)
