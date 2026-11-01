import { createContext } from 'react'
import { api, type GigaAiAgentApi } from '@api/api'
import { FetchHttpClient } from '@api/FetchHttpClient'

const agentApi = api(new FetchHttpClient()) // Default value to make api have non-nullable type in context
export const ApiContext = createContext<GigaAiAgentApi>(agentApi)
