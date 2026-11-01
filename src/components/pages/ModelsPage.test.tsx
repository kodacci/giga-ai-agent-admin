import { describe, expect, it, jest, afterEach } from '@jest/globals'
import { render, screen, within } from '@testing-library/react'
import type { RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntdApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ModelsPage } from './ModelsPage'

const jsonResponse = (status: number, body: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }) as Response

const setFetch = (mock: typeof fetch): void => {
  ;(globalThis as unknown as { fetch: typeof fetch }).fetch = mock
}

const renderPage = (): RenderResult => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <AntdApp>
      <QueryClientProvider client={queryClient}>
        <ModelsPage />
      </QueryClientProvider>
    </AntdApp>
  )
}

const stubModels = (models: string[]): void => {
  setFetch(
    jest.fn<typeof fetch>(() => Promise.resolve(jsonResponse(200, { models })))
  )
}

afterEach(() => {
  jest.restoreAllMocks()
  delete (globalThis as { fetch?: typeof fetch }).fetch
})

describe('ModelsPage', () => {
  it('shows a loading indicator and no model entries while fetching', () => {
    setFetch(jest.fn<typeof fetch>(() => new Promise<Response>(() => {})))

    const { container } = renderPage()

    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(container.querySelector('.ant-list-item')).toBeNull()
  })

  it('shows an error message with a retry control when the request fails', async () => {
    setFetch(
      jest
        .fn<typeof fetch>()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
    )

    renderPage()

    expect(
      await screen.findByText('Failed to load AI models')
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })

  it('displays the model list after a successful retry', async () => {
    setFetch(
      jest
        .fn<typeof fetch>()
        .mockRejectedValueOnce(new TypeError('Failed to fetch'))
        .mockResolvedValueOnce(
          jsonResponse(200, { models: ['GigaChat (salutedevices)'] })
        )
    )

    renderPage()

    await screen.findByText('Failed to load AI models')
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))

    expect(
      await screen.findByText('GigaChat (salutedevices)')
    ).toBeInTheDocument()
    expect(screen.getByText('Chat models')).toBeInTheDocument()
  })

  it('shows an explicit message when the backend returns no models', async () => {
    stubModels([])

    renderPage()

    expect(
      await screen.findByText('No models are available.')
    ).toBeInTheDocument()
  })

  it('groups chat and embedding models and renders names verbatim', async () => {
    stubModels([
      'GigaChat (salutedevices)',
      'GigaChat-Pro-preview (salutedevices)',
      'Embeddings (salutedevices)',
      'GigaEmbeddings-3B-2025-09 (salutedevices)',
    ])

    renderPage()

    const chatGroup = await screen.findByTestId('Chat models group')
    const embeddingGroup = screen.getByTestId('Embedding models group')

    expect(within(chatGroup).getAllByRole('listitem')).toHaveLength(2)
    expect(
      within(chatGroup).getByText('GigaChat-Pro-preview (salutedevices)')
    ).toBeInTheDocument()

    expect(within(embeddingGroup).getAllByRole('listitem')).toHaveLength(2)
    expect(
      within(embeddingGroup).getByText(
        'GigaEmbeddings-3B-2025-09 (salutedevices)'
      )
    ).toBeInTheDocument()
  })

  it('hides a group when no models of that kind exist', async () => {
    stubModels(['GigaChat (salutedevices)'])

    renderPage()

    await screen.findByText('Chat models')
    expect(
      screen.queryByTestId('Embedding models group')
    ).not.toBeInTheDocument()
  })
})
