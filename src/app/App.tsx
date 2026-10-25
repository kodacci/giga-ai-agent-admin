import type { FC, ReactNode } from 'react'
import { BrowserRouter } from 'react-router'
import { AppRouter } from './AppRouter'
import { ConfigProvider, theme } from 'antd'

export const App: FC = (): ReactNode => {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </ConfigProvider>
  )
}
