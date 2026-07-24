'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { ROLE_CUSTOMER, type Workspace } from '@/lib/api/helper/RoleHelper'
import { useBusinessSetup } from '@/features/business/hooks'
import { Avatar } from '@/design-system/primitives/Avatar'
import { Input } from '@/design-system/primitives/Input'
import { DropdownMenu } from '@/design-system/patterns'
import { WorkspaceSwitcher } from '@/features/shared/components/WorkspaceSwitcher'

export type NavbarContext = 'client' | 'business' | 'public'

type Props = {
  /** Workspace da rota, informado pelo layout do route group. */
  context?: NavbarContext
  /**
   * Conteúdo específico do workspace, injetado pelo layout (chip de
   * localização no cliente, CTA de criar anúncio no business). A navbar não
   * insere esses elementos por conta própria para manter desacoplamento.
   */
  slot?: React.ReactNode
}

const LOGO_HREF: Record<NavbarContext, string> = {
  client: '/dashboard-client',
  business: '/dashboard-business',
  public: '/',
}

export default function Navbar({ context = 'public', slot }: Props) {
  const router = useRouter()
  const { user, roles, logout } = useAuthContext()
  const { business } = useBusinessSetup()
  const [search, setSearch] = useState('')

  const isBusiness = context === 'business'
  const activeWorkspace: Workspace | undefined =
    context === 'public' ? undefined : (context satisfies Workspace)

  const profileHref =
    context === 'business'
      ? '/minha-empresa'
      : context === 'client'
        ? '/perfil'
        : roles.includes(ROLE_CUSTOMER) || roles.length === 0
          ? '/perfil'
          : '/minha-empresa'

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const query = search.trim()
    router.push(query ? `/busca?query=${encodeURIComponent(query)}` : '/busca')
  }

  const onLogout = async () => {
    await logout()
    router.push('/')
  }

  // No contexto business, exibe o nome e logo da Empresa. No cliente/público, exibe o do Usuário.
  const displayName = isBusiness
    ? business?.businessName || business?.legalName || 'Minha Empresa'
    : user?.name
  const displayAvatar = isBusiness
    ? business?.logoUrl || undefined
    : user?.profilePictureUrl
  const displaySubtitle = isBusiness
    ? business?.legalName || user?.email
    : user?.email

  const initials = isBusiness && !business?.businessName && !business?.legalName
    ? 'E'
    : (displayName ?? '?').charAt(0).toUpperCase()

  return (
    <nav
      data-context={isBusiness ? 'business' : 'client'}
      className="sticky top-0 z-30 w-full h-[var(--nav-height)] bg-[var(--color-surface)] border-b border-[var(--color-border-default)]"
    >
      <div className="h-full w-full px-4 md:px-8 flex items-center justify-between gap-4">
        <Link href={LOGO_HREF[context]} className="flex items-center gap-2 shrink-0">
          <Image src="/assets/logo-seubairro.svg" alt="SeuBairro" width={36} height={36} priority />
          <span className="font-bold text-[var(--color-title)] hidden sm:inline">
            Seu<span className="text-[var(--color-primary)]">Bairro</span>
            {isBusiness && (
              <small className="ml-1 text-[0.6em] text-[var(--color-accent)]">Business</small>
            )}
          </span>
        </Link>

        {!isBusiness && context !== 'client' && (
          <form role="search" className="hidden md:flex flex-1 max-w-[500px]" onSubmit={onSearchSubmit}>
            <Input
              label=""
              placeholder="Buscar produtos ou serviços..."
              type="search"
              size="sm"
              leftIcon={<i className="ri-search-line" aria-hidden />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              fullWidth
              className="rounded-full bg-[var(--color-input)] focus:bg-[var(--color-surface)]"
              aria-label="Buscar produtos ou serviços"
            />
          </form>
        )}

        <div className="ml-auto flex items-center gap-2">
          {!isBusiness && (
            <Link
              href="/busca"
              aria-label="Buscar produtos ou serviços"
              className="md:hidden size-11 rounded-full flex items-center justify-center text-[var(--color-body)] hover:bg-[var(--color-page)] transition-colors"
            >
              <i className="ri-search-line text-xl" aria-hidden />
            </Link>
          )}
          {slot}
          {user && (
            <DropdownMenu
              trigger={
                <button
                  type="button"
                  className="flex items-center gap-2 py-1 pl-1 pr-3 rounded-full bg-[var(--color-page)] hover:bg-[var(--color-border-default)] active:bg-[var(--color-border-default)] transition-colors min-h-11 cursor-pointer"
                  aria-label="Menu da conta"
                >
                  <Avatar
                    src={displayAvatar ?? undefined}
                    alt={displayName ?? 'Avatar'}
                    fallback={initials}
                    size="sm"
                  />
                  {displayName && (
                    <span className="hidden sm:inline text-sm font-semibold text-[var(--color-title)]">
                      {displayName}
                    </span>
                  )}
                  <i className="ri-arrow-down-s-line text-[var(--color-muted)]" aria-hidden />
                </button>
              }
            >
              <DropdownMenu.Label>
                <span className="flex flex-col gap-0.5 min-w-0 p-1">
                  <span className="text-sm font-bold text-[var(--color-title)] uppercase tracking-wide truncate">
                    {displayName ?? 'Sua conta'}
                  </span>
                  {displaySubtitle && (
                    <span className="text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wider truncate">
                      {displaySubtitle}
                    </span>
                  )}
                </span>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Item asChild>
                <Link href={profileHref} className="flex items-center gap-3 w-full">
                  <i className="ri-user-settings-line text-lg text-[var(--color-primary)]" aria-hidden />
                  <span className="flex-1 font-medium">{isBusiness ? 'Minha empresa' : 'Meu perfil'}</span>
                </Link>
              </DropdownMenu.Item>
              <WorkspaceSwitcher activeWorkspace={activeWorkspace} />
              <DropdownMenu.Separator />
              <DropdownMenu.Item
                intent="danger"
                icon={<i className="ri-logout-box-r-line text-lg" />}
                onSelect={onLogout}
              >
                <span className="font-semibold">Sair</span>
              </DropdownMenu.Item>
            </DropdownMenu>
          )}
        </div>
      </div>
    </nav>
  )
}
