'use client'

import { ErrorState } from '@/design-system/patterns/ErrorState'

export default function PublicError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-12">
      <ErrorState
        title="Não foi possível carregar o perfil"
        description={error.message || 'O servidor demorou para responder.'}
        retry={reset}
      />
    </div>
  )
}
