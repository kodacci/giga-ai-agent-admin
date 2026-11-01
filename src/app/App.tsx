import type { FC, ReactNode } from 'react'
import { BrowserRouter } from 'react-router'
import { AppRouter } from './AppRouter'
import { ConfigProvider, theme } from 'antd'
import { AppContext } from '@app/AppContext'

export const App: FC = (): ReactNode => {
  return (
    <AppContext>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ConfigProvider>
    </AppContext>
  )
}
