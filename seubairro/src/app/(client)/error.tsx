'use client'

import { ErrorState } from '@/design-system/patterns/ErrorState'

export default function ClientError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <ErrorState
      title="Não foi possível carregar"
      description={error.message || 'Ocorreu um erro inesperado. Tente novamente.'}
      retry={reset}
    />
  )
}
