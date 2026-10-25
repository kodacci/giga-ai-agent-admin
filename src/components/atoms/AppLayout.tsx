import type { FC, PropsWithChildren, ReactNode } from 'react'
import { Layout } from 'antd'

export const AppLayout: FC<PropsWithChildren> = ({ children }): ReactNode => {
  return <Layout style={{ display: 'flex', minHeight: 'calc(100vh)', padding: 0 }}>{children}</Layout>
}