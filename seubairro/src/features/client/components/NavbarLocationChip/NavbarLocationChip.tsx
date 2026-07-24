'use client'

import Link from 'next/link'
import { DropdownMenu } from '@/design-system/patterns'
import { useUserLocation } from '@/features/client/hooks/useUserLocation'
import { cn } from '@/lib/utils/cn'

/**
 * Chip de localização da navbar do cliente.
 * Permite que o cliente altere em tempo real na própria página se deseja buscar
 * por aproximação via GPS do dispositivo ou via Endereço Salvo do perfil.
 */
export function NavbarLocationChip() {
  const {
    source,
    status,
    requestGps,
    applyProfileFallback,
    profileAddress,
    isLocating,
    hasProfileAddress,
  } = useUserLocation()

  const label =
    source === 'gps'
      ? 'Localização Atual (GPS)'
      : source === 'profile'
        ? profileAddress?.neighborhood || profileAddress?.city
          ? `${profileAddress.neighborhood || profileAddress.city}`
          : 'Endereço Salvo'
        : status === 'pending' || isLocating
          ? 'Localizando…'
          : 'Definir Localização'

  return (
    <DropdownMenu
      trigger={
        <button
          type="button"
          aria-label={`Localização atual: ${label}. Clique para alterar.`}
          className="flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold bg-[var(--color-page)] hover:bg-[var(--color-border-default)] text-[var(--color-title)] border border-[var(--color-border-default)] transition-all min-w-0 shadow-2xs"
        >
          <i
            aria-hidden
            className={cn(
              'text-sm shrink-0',
              source === 'gps'
                ? 'ri-crosshair-2-fill text-[var(--color-primary)] font-bold'
                : source === 'profile'
                  ? 'ri-map-pin-2-fill text-[var(--color-primary)]'
                  : 'ri-map-pin-2-line text-[var(--color-muted)]',
            )}
          />
          <span className="hidden sm:inline max-w-40 truncate">{label}</span>
          <i aria-hidden className="ri-arrow-down-s-line hidden sm:inline text-[var(--color-muted)] text-sm" />
        </button>
      }
    >
      <DropdownMenu.Label>
        <span className="text-xs font-bold text-[var(--color-title)]">
          Como deseja buscar anúncios?
        </span>
      </DropdownMenu.Label>
      <DropdownMenu.Separator />

      {/* Opção 1: Usar GPS do dispositivo */}
      <DropdownMenu.Item
        onSelect={requestGps}
        className={cn(
          'flex items-center justify-between gap-3 cursor-pointer py-2 px-3',
          source === 'gps' && 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold',
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <i className="ri-crosshair-2-line text-lg text-[var(--color-primary)] shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-[var(--color-title)]">Usar meu GPS Atual</span>
            <span className="text-[10px] text-[var(--color-muted)]">Busca anúncios perto de onde você está agora</span>
          </div>
        </div>
        {source === 'gps' && <i className="ri-check-line text-[var(--color-primary)] font-bold text-sm shrink-0" />}
      </DropdownMenu.Item>

      {/* Opção 2: Usar Endereço Salvo no Perfil */}
      <DropdownMenu.Item
        onSelect={applyProfileFallback}
        disabled={!hasProfileAddress}
        className={cn(
          'flex items-center justify-between gap-3 cursor-pointer py-2 px-3',
          source === 'profile' && 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-semibold',
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <i className="ri-home-4-line text-lg text-[var(--color-primary)] shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-[var(--color-title)]">Usar Endereço Salvo</span>
            {profileAddress ? (
              <span className="text-[10px] text-[var(--color-muted)] truncate max-w-48">
                {[profileAddress.street, profileAddress.number, profileAddress.city].filter(Boolean).join(', ')}
              </span>
            ) : (
              <span className="text-[10px] text-[var(--color-muted)]">Nenhum endereço cadastrado</span>
            )}
          </div>
        </div>
        {source === 'profile' && <i className="ri-check-line text-[var(--color-primary)] font-bold text-sm shrink-0" />}
      </DropdownMenu.Item>

      <DropdownMenu.Separator />

      {/* Opção 3: Link para alterar no Perfil */}
      <DropdownMenu.Item asChild>
        <Link
          href="/perfil"
          className="flex items-center gap-2 text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] py-1.5 px-3"
        >
          <i className="ri-edit-line text-sm" />
          <span>Cadastrar / Alterar endereço no meu perfil</span>
        </Link>
      </DropdownMenu.Item>
    </DropdownMenu>
  )
}
