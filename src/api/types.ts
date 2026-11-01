import type {
  MutationFunction,
  MutationKey,
  QueryFunction,
  QueryKey,
} from '@tanstack/react-query'
import type { ProblemDetail } from '@api/HttpClient'

export interface QueryApiMethod<T> {
  readonly queryKey: QueryKey
  readonly queryFn: QueryFunction<T>
  readonly initialData?: T
}

export interface MutationApiMethod<T, R> {
  readonly mutationKey: MutationKey
  readonly mutationFn: MutationFunction<R, T>
}

export const isProblemDetail = (problem: unknown): problem is ProblemDetail => {
  return (
    !!problem &&
    typeof problem === 'object' &&
    'title' in problem &&
    typeof problem.title === 'string' &&
    'status' in problem &&
    typeof problem.status === 'number' &&
    'detail' in problem &&
    typeof problem.detail === 'string'
  )
}
