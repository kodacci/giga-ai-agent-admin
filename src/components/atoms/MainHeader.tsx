import type { FC, ReactNode } from 'react'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { Header } from 'antd/es/layout/layout'
import { useLocation, useNavigate } from 'react-router'

const items: MenuProps['items'] = [
  { key: '/', label: 'Home' },
  { key: '/models', label: 'AI Models' },
]

export const MainHeader: FC = (): ReactNode => {
  const location = useLocation()
  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = ({ key }): void => {
    void navigate(key)
  }

  return (
    <Header className="flex items-center px-4">
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
