'use client'

import { useUserLocation } from '@/features/client/hooks/useUserLocation'
import { cn } from '@/lib/utils/cn'

/**
 * Controle explícito da fonte de coordenada ativa (GPS vs endereço cadastrado).
 * Aparece na aba Localização do perfil.
 */
export function LocationSourceToggle() {
  const {
    source,
    status,
    requestGps,
    applyProfileFallback,
    hasProfileAddress,
    profileAddress,
    isLocating,
    error,
  } = useUserLocation()

  const options = [
    {
      key: 'gps' as const,
      label: 'Usar minha localização (GPS)',
      icon: 'ri-gps-line',
      onSelect: requestGps,
      disabled: false,
      loading: false,
    },
    {
      key: 'profile' as const,
      label: 'Usar endereço cadastrado',
      icon: 'ri-home-4-line',
      onSelect: () => void applyProfileFallback(),
      disabled: !hasProfileAddress || isLocating,
      loading: isLocating,
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div role="radiogroup" aria-label="Fonte de localização" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const checked = source === opt.key
          return (
            <button
              key={opt.key}
              type="button"
              role="radio"
              aria-checked={checked}
              disabled={opt.disabled}
              onClick={opt.onSelect}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium text-left transition-colors',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]',
                checked
                  ? 'border-[var(--color-primary)] bg-[var(--color-page)] text-[var(--color-primary)]'
                  : 'border-[var(--color-border-default)] text-[var(--color-body)] hover:bg-[var(--color-page)]',
                opt.disabled && 'opacity-50 cursor-not-allowed',
              )}
            >
              <i
                className={cn(opt.loading ? 'ri-loader-4-line animate-spin' : opt.icon, 'text-lg')}
                aria-hidden
              />
              <span className="flex-1">{opt.label}</span>
              {checked && <i className="ri-check-line" aria-hidden />}
            </button>
          )
        })}
      </div>

      {status === 'denied' && (
        <p role="alert" className="text-xs text-[var(--color-danger)]">
          Permissão de localização negada. Habilite o acesso à localização nas configurações do navegador
          para usar o GPS.
        </p>
      )}

      {error && (
        <p role="alert" className="text-xs text-[var(--color-danger)]">
          {error.message}
        </p>
      )}

      {source === 'gps' && status === 'granted' && (
        <p className="text-xs text-[var(--color-muted)]">
          <i className="ri-gps-line align-middle mr-1" aria-hidden />
          Usando sua localização atual (GPS).
        </p>
      )}

      {source === 'profile' && profileAddress && (
        <p className="text-xs text-[var(--color-muted)]">
          <i className="ri-home-4-line align-middle mr-1" aria-hidden />
          Usando endereço: {profileAddress.neighborhood}, {profileAddress.city}.
        </p>
      )}

      {!hasProfileAddress && (
        <p className="text-xs text-[var(--color-muted)]">
          Cadastre um endereço abaixo para usá-lo como fonte de localização.
        </p>
      )}
    </div>
  )
}
