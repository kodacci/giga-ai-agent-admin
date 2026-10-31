import type { FC, ReactNode } from 'react'
import { Alert, Button, List, Skeleton, Typography } from 'antd'
import { useAiModels } from '@hooks/useAiModels'

const isEmbeddingModel = (name: string): boolean =>
  name.toLowerCase().includes('embedding')

const ModelGroup: FC<{ title: string; models: string[] }> = ({
  title,
  models,
}): ReactNode => {
  if (models.length === 0) {
    return null
  }
  return (
    <section className="mb-6" data-testid={`${title} group`}>
      <Typography.Title level={5}>{title}</Typography.Title>
      <List
        dataSource={models}
        renderItem={(model): ReactNode => <List.Item>{model}</List.Item>}
      />
    </section>
  )
}

export const ModelsPage: FC = (): ReactNode => {
  const { data, isLoading, isError, refetch } = useAiModels()

  if (isLoading) {
    return (
      <div role="status" aria-label="Loading AI models">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    )
  }

  if (isError) {
    return (
      <Alert
        type="error"
        showIcon
        message="Failed to load AI models"
        description="The model list could not be retrieved from the backend."
        action={<Button onClick={(): void => void refetch()}>Retry</Button>}
      />
    )
  }

  if (!data || data.length === 0) {
    return <Typography.Text>No models are available.</Typography.Text>
  }

  return (
    <div className="max-w-xl">
      <ModelGroup
        title="Chat models"
        models={data.filter((name) => !isEmbeddingModel(name))}
      />
      <ModelGroup
        title="Embedding models"
        models={data.filter(isEmbeddingModel)}
      />
    </div>
  )
}
