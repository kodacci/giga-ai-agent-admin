import { App } from 'antd'

type AntdAppApi = ReturnType<typeof App.useApp>

export type NotificationApi = AntdAppApi['notification']

export const useNotification = (): NotificationApi => App.useApp().notification
