import { describe, expect, it } from '@jest/globals'
import { render } from '@testing-library/react'
import { BrandIcon } from './BrandIcon'

describe('BrandIcon', () => {
  it('renders an accessible brand mark', () => {
    const { container } = render(<BrandIcon />)

    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-label', 'Giga AI Agent')
    expect(svg).toHaveAttribute('viewBox', '0 0 64 64')
  })

  it('renders the badge and sparkle at a custom size', () => {
    const { container } = render(<BrandIcon size={16} />)

    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '16')
    expect(svg).toHaveAttribute('height', '16')
    expect(container.querySelector('rect')).toBeInTheDocument()
    expect(container.querySelector('path')).toBeInTheDocument()
  })
})
