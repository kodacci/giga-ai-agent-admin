import type { FC, ReactNode } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useLocation, useNavigate } from 'react-router'
import { BrandIcon } from './BrandIcon'

const items: MenuProps['items'] = [{ key: '/', label: 'Models' }]

export const MainHeader: FC = (): ReactNode => {
  const location = useLocation()
  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = ({ key }): void => {
    void navigate(key)
  }

  return (
    <Header className="flex items-center px-4">
      <BrandIcon size={32} className="mr-4 shrink-0" />
      <Menu
        mode="horizontal"
        items={items}
        selectedKeys={[location.pathname]}
        onClick={onClick}
        style={{ flex: 1, minWidth: 0 }}
      />
    </Header>
  )
}
