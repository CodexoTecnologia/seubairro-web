'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Link from 'next/link'
import { useUserLocation } from '@/features/client/hooks/useUserLocation'
import { Button } from '@/design-system/primitives/Button'
import { Card } from '@/design-system/primitives/Card'
import { EmptyState } from '@/design-system/patterns/EmptyState'

/**
 * Portão da RN02: sem coordenada de origem o feed não é gerado.
 * Bloqueia o conteúdo e orienta o usuário em vez de mostrar tela vazia.
 *
 * Ordem de preferência: se o usuário já tem endereço salvo, usamos automaticamente
 * — geocodificando no cliente quando o backend não fornece coordenadas. O GPS fica
 * disponível como troca explícita na aba Localização do perfil.
 */
export function GeolocationGate({ children }: { children: ReactNode }) {
  const {
    coords,
    status,
    requestGps,
    applyProfileFallback,
    hasProfileAddress,
    isLocating,
    isProfileLoading,
    error,
  } = useUserLocation()
  const autoTriedRef = useRef(false)

  // Uma única tentativa automática de usar o endereço salvo (evita repetir a
  // geocodificação se ela falhar e as deps não mudarem).
  useEffect(() => {
    if (
      coords === null &&
      status !== 'pending' &&
      !isLocating &&
      hasProfileAddress &&
      !autoTriedRef.current
    ) {
      autoTriedRef.current = true
      void applyProfileFallback()
    }
  }, [coords, status, isLocating, hasProfileAddress, applyProfileFallback])

  if (coords !== null) return <>{children}</>

  if (isLocating || isProfileLoading) {
    return (
      <div className="flex justify-center py-10">
        <Card padding="lg" className="max-w-md w-full flex flex-col items-center text-center gap-3">
          <i className="ri-loader-4-line text-3xl text-[var(--color-primary)] animate-spin" aria-hidden />
          <p className="text-sm text-[var(--color-muted)]">Localizando seu endereço…</p>
        </Card>
      </div>
    )
  }

  const gpsFailed = status === 'denied' || status === 'unavailable'
  const geocodeFailed = Boolean(error)

  if (gpsFailed || geocodeFailed) {
    return (
      <EmptyState
        icon={<i className="ri-map-pin-off-line" />}
        title={geocodeFailed ? 'Não conseguimos localizar seu endereço' : 'Precisamos da sua localização'}
        description={
          geocodeFailed
            ? 'Não encontramos as coordenadas do seu endereço salvo. Revise o endereço no perfil ou permita o acesso ao GPS.'
            : 'Permita o acesso ao GPS ou cadastre um endereço para ver o que está perto de você.'
        }
        action={
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={requestGps} leftIcon={<i className="ri-gps-line" />}>
              Tentar GPS novamente
            </Button>
            <Link href="/perfil">
              <Button variant="outline" leftIcon={<i className="ri-map-pin-add-line" />}>
                {hasProfileAddress ? 'Revisar endereço' : 'Cadastrar endereço'}
              </Button>
            </Link>
          </div>
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
          <Button
            fullWidth
            variant="outline"
            disabled={!hasProfileAddress}
            onClick={() => void applyProfileFallback()}
          >
            Usar endereço cadastrado
          </Button>
        </div>
      </Card>
    </div>
  )
}
