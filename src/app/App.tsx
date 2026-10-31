import type { FC, ReactNode } from 'react'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppRouter } from './AppRouter'
import { ConfigProvider, theme } from 'antd'

const queryClient = new QueryClient()

export const App: FC = (): ReactNode => {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  )
}
