'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { usePublicProfileLink, useBusinessOpenStatus } from '@/features/business/hooks'
import { cn } from '@/lib/utils/cn'

type Item = {
  href: string
  icon: string
  label: string
  external?: boolean
  warn?: boolean
}

export function BusinessSidebar() {
  const pathname = usePathname() ?? ''
  const { href: publicHref, slug, businessId } = usePublicProfileLink()
  const { status: openStatus, isOpenNow } = useBusinessOpenStatus(businessId)
  const statusReady = openStatus === 'ready'

  const items: Item[] = [
    { href: '/dashboard-business', icon: 'ri-dashboard-line', label: 'Visão Geral' },
    {
      href: publicHref,
      icon: 'ri-eye-line',
      label: 'Perfil Público',
      external: Boolean(slug),
      warn: !slug,
    },
    { href: '/listar-anuncio', icon: 'ri-store-2-line', label: 'Meus Anúncios' },
    { href: '/horarios', icon: 'ri-time-line', label: 'Horários' },
    { href: '/chat', icon: 'ri-message-3-line', label: 'Mensagens', external: true },
    { href: '/editar-profile', icon: 'ri-settings-3-line', label: 'Configurações' },
  ]

  return (
    <aside className="w-[260px] h-full flex flex-col gap-4 p-5 bg-[var(--color-surface)] border-r border-[var(--color-border-default)]">
      <header className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[var(--color-title)]">Minha Loja</h3>
        <span
          className={cn(
            'text-xs px-2 py-1 rounded-full font-semibold',
            !statusReady
              ? 'bg-[var(--color-page)] text-[var(--color-muted)]'
              : isOpenNow
                ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                : 'bg-[var(--color-danger-bg)] text-[var(--color-danger)]',
          )}
          role="status"
          aria-live="polite"
        >
          {!statusReady ? 'Carregando…' : isOpenNow ? 'Loja Aberta' : 'Loja Fechada'}
        </span>
      </header>

      <nav aria-label="Navegação do negócio" className="flex flex-col gap-1">
        {items.map((it) => {
          const active = !it.external && it.href !== '/' && pathname.startsWith(it.href)
          return (
            <Link
              key={it.label}
              href={it.href}
              target={it.external ? '_blank' : undefined}
              rel={it.external ? 'noreferrer' : undefined}
              title={it.warn ? 'Configure seu negócio primeiro' : undefined}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2 min-h-11 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-body)] hover:bg-[var(--color-page)] hover:text-[var(--color-primary)] active:bg-[var(--color-border-default)]',
              )}
            >
              <i className={`${it.icon} text-lg`} aria-hidden />
              <span className="flex-1">{it.label}</span>
              {it.external && <i className="ri-external-link-line text-xs opacity-70" aria-hidden />}
              {it.warn && (
                <i
                  className="ri-error-warning-line text-xs text-[var(--color-warning)]"
                  aria-label="Atenção"
                />
              )}
            </Link>
          )
        })}
      </nav>

      <footer className="mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--color-page)]">
          <i className="ri-vip-crown-line text-xl text-[var(--color-warning)]" aria-hidden />
          <div className="flex flex-col text-xs">
            <strong className="text-[var(--color-title)]">Plano Premium</strong>
            <button
              type="button"
              className="text-left text-[var(--color-primary)] hover:underline"
            >
              Gerenciar Plano
            </button>
          </div>
        </div>
      </footer>
    </aside>
  )
}
