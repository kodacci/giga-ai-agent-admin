import { useId } from 'react'
import type { FC, ReactNode } from 'react'

export const BrandIcon: FC<{ size?: number; className?: string }> = ({
  size = 32,
  className,
}): ReactNode => {
  const gradientId = useId().replace(/[^a-zA-Z0-9]/g, '')

  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label="Giga AI Agent"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6366F1" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="60"
        height="60"
        rx="16"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M32 14 L38 26 L50 32 L38 38 L32 50 L26 38 L14 32 L26 26 Z"
        fill="#FFFFFF"
      />
    </svg>
  )
}
