import type { FC, ReactNode } from 'react'
import { Outlet } from 'react-router'
import { Content, Footer } from 'antd/es/layout/layout'
import { AppLayout } from './AppLayout'
import { MainHeader } from './MainHeader'

export const AppShell: FC = (): ReactNode => {
  return (
    <AppLayout>
      <MainHeader />
      <Content className="p-8">
        <Outlet />
      </Content>
      <Footer className="flex items-center flex-col justify-center text-sm">
        RA-ITech LLC
      </Footer>
    </AppLayout>
  )
}
