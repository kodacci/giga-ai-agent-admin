import '@testing-library/jest-dom/jest-globals'
import { jest } from '@jest/globals'

// jsdom has no matchMedia; Ant Design uses it for responsive behaviour
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// jsdom has no ResizeObserver; Ant Design horizontal Menu observes its width
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: class {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  },
})
