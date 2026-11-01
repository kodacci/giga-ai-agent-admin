import { describe, expect, it } from '@jest/globals'
import { isProblemDetail } from '@api/types'

const valid = {
  type: 'about:blank',
  title: 'Bad Request',
  status: 400,
  detail: 'Bad input',
}

describe('isProblemDetail', () => {
  it('accepts a well-formed problem detail', () => {
    expect(isProblemDetail(valid)).toBe(true)
  })

  it.each([
    ['null', null],
    ['undefined', undefined],
    ['a string', 'title: x, status: 400, detail: y'],
    ['a number', 400],
    ['an empty object', {}],
    ['a missing title', { status: 400, detail: 'y' }],
    ['a non-string title', { title: 1, status: 400, detail: 'y' }],
    ['a missing status', { title: 'x', detail: 'y' }],
    ['a non-number status', { title: 'x', status: '400', detail: 'y' }],
    ['a missing detail', { title: 'x', status: 400 }],
    ['a non-string detail', { title: 'x', status: 400, detail: 1 }],
  ])('rejects %s', (_label: string, value: unknown) => {
    expect(isProblemDetail(value)).toBe(false)
  })
})
