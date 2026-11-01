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
        <Route path="/models" element={<div>models content</div>} />
      </Routes>
    </MemoryRouter>
  )
  const { container } = render(<Probe />)
  return container
}

describe('MainHeader', () => {
  it('renders navigation entries for every section', () => {
    renderAt('/')

    expect(screen.getByRole('menuitem', { name: 'Home' })).toBeInTheDocument()
    expect(
      screen.getByRole('menuitem', { name: 'AI Models' })
    ).toBeInTheDocument()
  })

  it('marks Home active on the index route', () => {
    const container = renderAt('/')

    expect(
      container.querySelector('.ant-menu-item-selected')
    ).toHaveTextContent('Home')
  })

  it('marks AI Models active on the models route', () => {
    const container = renderAt('/models')

    expect(
      container.querySelector('.ant-menu-item-selected')
    ).toHaveTextContent('AI Models')
  })

  it('navigates to the models section on click', async () => {
    renderAt('/')

    await userEvent.click(screen.getByRole('menuitem', { name: 'AI Models' }))

    expect(screen.getByText('models content')).toBeInTheDocument()
  })
})
