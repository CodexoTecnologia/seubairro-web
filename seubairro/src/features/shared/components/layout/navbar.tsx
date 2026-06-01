'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { ROLE_CUSTOMER, ROLE_ENTREPENEUR, DASHBOARD_BY_ROLE } from '@/lib/api/helper/RoleHelper'
import { Input } from '@/design-system/primitives/Input'

const BUSINESS_PATHS = [
  '/dashboard-business',
  '/criar-anuncio',
  '/listar-anuncio',
  '/editar-profile',
  '/chat',
]

export default function Navbar() {
  const pathname = usePathname() ?? ''
  const { roles, user } = useAuthContext()
  const [search, setSearch] = useState('')

  const onBusinessPath = BUSINESS_PATHS.some((p) =>
    pathname.toLowerCase().startsWith(p.toLowerCase()),
  )
  const hasBusinessRole = roles.includes(ROLE_ENTREPENEUR)
  const hasCustomerRole = roles.includes(ROLE_CUSTOMER)
  const isBusiness = hasBusinessRole && (onBusinessPath || !hasCustomerRole)

  const logoHref =
    roles.length > 1
      ? isBusiness
        ? DASHBOARD_BY_ROLE[ROLE_ENTREPENEUR]
        : DASHBOARD_BY_ROLE[ROLE_CUSTOMER]
      : hasBusinessRole
        ? DASHBOARD_BY_ROLE[ROLE_ENTREPENEUR]
        : hasCustomerRole
          ? DASHBOARD_BY_ROLE[ROLE_CUSTOMER]
          : DASHBOARD_BY_ROLE[ROLE_CUSTOMER]

  return (
    <nav
      data-context={isBusiness ? 'business' : 'client'}
      className="sticky top-0 z-30 w-full h-[var(--nav-height)] bg-[var(--color-surface)] border-b border-[var(--color-border-default)]"
    >
      <div className="h-full max-w-[1200px] mx-auto px-4 flex items-center gap-4">
        <Link href={logoHref} className="flex items-center gap-2 shrink-0">
          <Image src="/assets/logo-seubairro.svg" alt="SeuBairro" width={36} height={36} priority />
          <span className="font-bold text-[var(--color-title)] hidden sm:inline">
            Seu<span className="text-[var(--color-primary)]">Bairro</span>
            {isBusiness && (
              <small className="ml-1 text-[0.6em] text-[var(--color-accent)]">Business</small>
            )}
          </span>
        </Link>

        {!isBusiness && (
          <form
            role="search"
            className="hidden md:flex flex-1 max-w-[500px]"
            onSubmit={(e) => {
              e.preventDefault()
              // TODO: rotear para /busca?q=...
            }}
          >
            <Input
              label="Buscar produtos ou serviços"
              placeholder="Buscar produtos ou serviços..."
              type="search"
              size="sm"
              leftIcon={<i className="ri-search-line" aria-hidden />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              className="rounded-full bg-[var(--color-input)] focus:bg-[var(--color-surface)]"
              // Label visualmente oculto mas acessível para screen readers.
              // eslint-disable-next-line jsx-a11y/no-redundant-roles
              aria-label="Buscar produtos ou serviços"
            />
          </form>
        )}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="relative size-11 flex items-center justify-center rounded-full text-[var(--color-body)] hover:bg-[var(--color-page)] hover:text-[var(--color-primary)] active:bg-[var(--color-border-default)] transition-colors"
            aria-label="Notificações"
          >
            <i className="ri-notification-3-line text-xl" aria-hidden />
            {/* Placeholder de badge — exibir condicionalmente quando houver pendência. */}
            {false && (
              <span
                aria-hidden
                className="absolute top-1.5 right-2 size-2 rounded-full bg-[var(--color-danger)] ring-2 ring-[var(--color-surface)]"
              />
            )}
          </button>
          {user && (
            <Link
              href="/perfil"
              className="flex items-center gap-2 py-1 pl-1 pr-3 rounded-full bg-[var(--color-page)] hover:bg-[var(--color-border-default)] active:bg-[var(--color-border-default)] transition-colors min-h-11"
              aria-current={pathname.startsWith('/perfil') ? 'page' : undefined}
            >
              <span className="size-8 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white text-sm font-bold">
                {(user.name ?? '?').charAt(0).toUpperCase()}
              </span>
              {user.name && (
                <span className="hidden sm:inline text-sm font-medium text-[var(--color-title)]">
                  {user.name}
                </span>
              )}
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
