import type { FC, ReactNode } from 'react'
import { describe, expect, it } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { useQueryClient } from '@tanstack/react-query'
import { AppContext } from './AppContext'
import { useApi } from '@hooks/useApi'

const Probe: FC = (): ReactNode => {
  const { listModels } = useApi()
  useQueryClient()

  return <div>{String(listModels.queryKey)}</div>
}

describe('AppContext', () => {
  it('provides the agent api and query client to its children', () => {
    render(
      <AppContext>
        <Probe />
      </AppContext>
    )

    expect(screen.getByText('models')).toBeInTheDocument()
  })
})
