import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { FC, ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { MainHeader } from './MainHeader'

const renderAt = (path: string): HTMLElement => {
  const Probe: FC = (): ReactNode => (
    <MemoryRouter initialEntries={[path]}>
      <MainHeader />
      <Routes>
        <Route index element={<div>home content</div>} />
      </Routes>
    </MemoryRouter>
  )
  const { container } = render(<Probe />)
  return container
}

describe('MainHeader', () => {
  it('renders the Models navigation entry', () => {
    renderAt('/')

    expect(screen.getByRole('menuitem', { name: 'Models' })).toBeInTheDocument()
  })

  it('marks Models active on the index route', () => {
    const container = renderAt('/')

    expect(
      container.querySelector('.ant-menu-item-selected')
    ).toHaveTextContent('Models')
  })

  it('navigates to the models section on click', async () => {
    renderAt('/elsewhere')

    expect(screen.queryByText('home content')).not.toBeInTheDocument()

    await userEvent.click(screen.getByRole('menuitem', { name: 'Models' }))

    expect(screen.getByText('home content')).toBeInTheDocument()
  })
})
