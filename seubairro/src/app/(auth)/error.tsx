'use client'

import { ErrorState } from '@/design-system/patterns/ErrorState'

export default function AuthError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <ErrorState
        title="Algo deu errado"
        description={error.message || 'Tente novamente em alguns instantes.'}
        retry={reset}
      />
    </div>
  )
}
