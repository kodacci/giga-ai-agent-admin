import type { FC, ReactNode } from 'react'
import { Route, Routes } from 'react-router'
import { AppShell } from '@components/atoms/AppShell'
import { ModelsPage } from '@components/pages/ModelsPage'

export const AppRouter: FC = (): ReactNode => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<ModelsPage />} />
      </Route>
    </Routes>
  )
}
