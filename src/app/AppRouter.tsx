import type { FC, ReactNode } from 'react'
import { Route, Routes } from 'react-router'
import { HomePage } from '@components/pages/HomePage'

export const AppRouter: FC = (): ReactNode => {
  return (
    <Routes>
      <Route index element={<HomePage />}></Route>
    </Routes>
  )
}
