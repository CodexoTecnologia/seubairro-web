'use client'

import { useEffect, useState } from 'react'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { BusinessService } from '@/lib/api/services/BusinessService'
import { BusinessOrNullSchema } from '@/features/business/schemas'

type Status = 'idle' | 'loading' | 'ready' | 'error'

type Result = {
  slug: string | null
  businessId: string | null
  /** Href para o perfil público — ou rota de edição caso ainda não tenha negócio criado. */
  href: string
  status: Status
  isReady: boolean
}

/**
 * Resolve o link do perfil público para o dono do negócio logado.
 *
 * Roda no client porque depende do AuthContext (token em localStorage).
 * Quando a página puder ser SSR-friendly, mover o fetch para a page.tsx e remover este hook.
 */
export const usePublicProfileLink = (): Result => {
  const { user, isAuthenticated, loading: authLoading } = useAuthContext()
  const [slug, setSlug] = useState<string | null>(null)
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (authLoading || !isAuthenticated || !user?.id) return
    let cancelled = false
    // Padrão canônico de "fetch on mount" — setState após resposta, não direto no body do effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('loading')
    BusinessService.getByOwnerId(user.id)
      .then((raw) => {
        if (cancelled) return
        const business = BusinessOrNullSchema.parse(raw)
        setSlug(business?.slug ?? null)
        setBusinessId(business?.id ?? null)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        console.error('[usePublicProfileLink] failed:', err)
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [user, isAuthenticated, authLoading])

  return {
    slug,
    businessId,
    href: slug ? `/negocio/${slug}` : '/editar-profile',
    status,
    isReady: status === 'ready',
  }
}
