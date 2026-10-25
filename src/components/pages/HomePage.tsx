import type { FC, ReactNode } from 'react'
import { Content, Footer, Header } from 'antd/es/layout/layout'
import { AppLayout } from '@components/atoms/AppLayout'

export const HomePage: FC = (): ReactNode => {
  return (
    <AppLayout>
      <Header className="flex items-center"></Header>
      <Content className="flex justify-center p-8">
          <h1 className="text-3xl">Giga AI Agent Admin</h1>
      </Content>
      <Footer className="flex items-center flex-col justify-center text-sm">RA-ITech LLC</Footer>
    </AppLayout>
  )
}
