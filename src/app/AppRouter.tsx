import type { FC, ReactNode } from 'react'
import { Route, Routes } from 'react-router'
import { AppShell } from '@components/atoms/AppShell'
import { HomePage } from '@components/pages/HomePage'
import { ModelsPage } from '@components/pages/ModelsPage'

export const AppRouter: FC = (): ReactNode => {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="/models" element={<ModelsPage />} />
      </Route>
    </Routes>
  )
}
