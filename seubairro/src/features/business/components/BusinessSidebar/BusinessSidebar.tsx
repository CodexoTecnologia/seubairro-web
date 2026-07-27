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
  const statusLabel =
    openStatus === 'error'
      ? 'Status indisponível'
      : !statusReady
        ? 'Carregando…'
        : isOpenNow
          ? 'Loja Aberta'
          : 'Loja Fechada'

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
    { href: '/pedidos', icon: 'ri-shopping-bag-line', label: 'Pedidos' },
    { href: '/chat', icon: 'ri-message-3-line', label: 'Mensagens' },
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
          {statusLabel}
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
        <BusinessPlanCard />
      </footer>
    </aside>
  )
}

function BusinessPlanCard() {
  return (
    <div className="p-3.5 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-surface)] to-[var(--color-page)] border border-[var(--color-primary)]/25 flex flex-col gap-2 shadow-2xs">
      <div className="flex items-center gap-2">
        <span className="size-7 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold shadow-2xs">
          <i className="ri-vip-crown-line text-amber-300" />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[var(--color-title)] truncate">Planos & Destaques</span>
          <span className="text-[10px] text-[var(--color-muted)] font-medium">Recursos exclusivos</span>
        </div>
      </div>

      <p className="text-[11px] text-[var(--color-body)] leading-relaxed">
        Gerencie sua assinatura, limites de anúncios e recursos de destaque da sua empresa.
      </p>

      <Link
        href="/minha-empresa"
        className="mt-1 w-full h-8 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
      >
        <i className="ri-sparkles-line text-sm" />
        Gerenciar Plano
      </Link>
    </div>
  )
}
