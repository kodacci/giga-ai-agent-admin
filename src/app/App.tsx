import type { FC, ReactNode } from 'react'
import { BrowserRouter } from 'react-router'
import { AppRouter } from './AppRouter'
import { App as AntdApp, ConfigProvider, theme } from 'antd'
import { AppContext } from '@app/AppContext'

export const App: FC = (): ReactNode => {
  return (
    <AppContext>
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <AntdApp>
          <BrowserRouter>
            <AppRouter />
          </BrowserRouter>
        </AntdApp>
      </ConfigProvider>
    </AppContext>
  )
}
