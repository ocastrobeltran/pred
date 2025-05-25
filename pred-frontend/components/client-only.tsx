'use client'

import dynamic from 'next/dynamic'
import { ComponentType } from 'react'

export function ClientOnly<T extends Record<string, any>>({
  children,
  fallback,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <div suppressHydrationWarning>
      {typeof window === 'undefined' ? fallback : children}
    </div>
  )
}

export function withClientOnly<P extends Record<string, any>>(
  Component: ComponentType<P>
) {
  return dynamic(() => Promise.resolve(Component), {
    ssr: false,
  })
}