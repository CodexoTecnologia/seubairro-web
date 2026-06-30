'use client'

import { useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { useUserLocation } from '@/features/client/hooks/useUserLocation'
import { Button } from '@/design-system/primitives/Button'
import { Card } from '@/design-system/primitives/Card'
import { EmptyState } from '@/design-system/patterns/EmptyState'

/**
 * Portão da RN02: sem coordenada de origem o feed não é gerado.
 * Bloqueia o conteúdo e orienta o usuário em vez de mostrar tela vazia.
 */
export function GeolocationGate({ children }: { children: ReactNode }) {
  const { coords, status, requestGps, applyProfileFallback, hasProfileAddress } = useUserLocation()

  // GPS negado/indisponível mas há endereço salvo → fallback automático e silencioso.
  useEffect(() => {
    if (coords === null && (status === 'denied' || status === 'unavailable') && hasProfileAddress) {
      applyProfileFallback()
    }
  }, [coords, status, hasProfileAddress, applyProfileFallback])

  if (coords !== null) return <>{children}</>

  if ((status === 'denied' || status === 'unavailable') && !hasProfileAddress) {
    return (
      <EmptyState
        icon={<i className="ri-map-pin-off-line" />}
        title="Precisamos da sua localização"
        description="Permita o acesso ao GPS ou cadastre um endereço para ver o que está perto de você."
        action={
          <Link href="/perfil">
            <Button leftIcon={<i className="ri-map-pin-add-line" />}>Cadastrar endereço</Button>
          </Link>
        }
      />
    )
  }

  return (
    <div className="flex justify-center py-10">
      <Card padding="lg" className="max-w-md w-full flex flex-col items-center text-center gap-4">
        <i className="ri-map-pin-2-line text-4xl text-[var(--color-primary)]" aria-hidden />
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-bold text-[var(--color-title)]">Onde você está?</h2>
          <p className="text-sm text-[var(--color-muted)]">
            Para mostrar o que tem perto de você, precisamos da sua localização.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            fullWidth
            isLoading={status === 'pending'}
            onClick={requestGps}
            leftIcon={<i className="ri-gps-line" />}
          >
            Permitir localização
          </Button>
          <Button fullWidth variant="outline" disabled={!hasProfileAddress} onClick={applyProfileFallback}>
            Usar endereço cadastrado
          </Button>
        </div>
      </Card>
    </div>
  )
}
