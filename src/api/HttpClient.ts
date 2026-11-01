export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface QueryParams {
  [key: string]: string | number | boolean
}

export interface ProblemDetail {
  type: string
  title: string
  status: number
  detail: string
  code: string
  message?: string
  source?: string
  timestamp?: string
  instance?: string
}

export interface HttpClientError extends Error {
  isProblemDetail: boolean
  problemDetail?: ProblemDetail
  error?: Error
}

export interface HttpClient {
  get<R>(url: string, query?: QueryParams): Promise<R>
  post<T, R>(url: string, data?: T, query?: QueryParams): Promise<R>
  put<T, R>(url: string, data?: T, query?: QueryParams): Promise<R>
  delete<T, R>(url: string, data?: T, query?: QueryParams): Promise<R>
}
