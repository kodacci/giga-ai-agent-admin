import { afterEach, describe, expect, it, jest } from '@jest/globals'
import { render, screen } from '@testing-library/react'
import { App } from './App'

const MODEL = 'GigaChat (salutedevices)'

const jsonResponse = (status: number, body: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }) as Response

const setFetch = (mock: typeof fetch): void => {
  ;(globalThis as unknown as { fetch: typeof fetch }).fetch = mock
}

afterEach(() => {
  jest.restoreAllMocks()
  delete (globalThis as { fetch?: typeof fetch }).fetch
})

describe('App', () => {
  it('renders the models list as the home page', async () => {
    setFetch(
      jest.fn<typeof fetch>(() =>
        Promise.resolve(jsonResponse(200, { models: [MODEL] }))
      )
    )

    render(<App />)

    expect(await screen.findByText(MODEL)).toBeInTheDocument()
    expect(screen.getByText('Chat models')).toBeInTheDocument()
  })
})
