import type { FC, PropsWithChildren, ReactNode } from 'react'
import { describe, expect, it } from '@jest/globals'
import { renderHook } from '@testing-library/react'
import { App as AntdApp } from 'antd'
import { useNotification } from '@hooks/useNotification'
import type { NotificationApi } from '@hooks/useNotification'

const wrapper: FC<PropsWithChildren> = ({
  children,
}: PropsWithChildren): ReactNode => <AntdApp>{children}</AntdApp>

describe('useNotification', () => {
  it('exposes the antd notification api from the app context', () => {
    const { result } = renderHook((): NotificationApi => useNotification(), {
      wrapper,
    })

    expect(result.current.error).toBeInstanceOf(Function)
    expect(result.current.success).toBeInstanceOf(Function)
    expect(result.current.open).toBeInstanceOf(Function)
  })
})
