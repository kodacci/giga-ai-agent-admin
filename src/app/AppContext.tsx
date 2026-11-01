import { type FC, type PropsWithChildren, type ReactNode, StrictMode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FetchHttpClient } from '@api/FetchHttpClient'
import { ApiContext } from '@context/ApiContext'
import { api } from '@api/api'

const queryClient = new QueryClient()
const httpClient = new FetchHttpClient()
const gigaApi = api(httpClient)

export const AppContext: FC<PropsWithChildren> = ({ children } : PropsWithChildren): ReactNode => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ApiContext value={gigaApi}>
          {children}
        </ApiContext>
      </QueryClientProvider>
    </StrictMode>
  )
}