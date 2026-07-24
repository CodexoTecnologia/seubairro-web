'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/dashboard-client', icon: 'ri-home-5-line', label: 'Início' },
  { href: '/meus-pedidos', icon: 'ri-shopping-bag-3-line', label: 'Meus Pedidos' },
  { href: '/mensagens', icon: 'ri-message-3-line', label: 'Mensagens' },
]

/** Navegação lateral do workspace cliente (desktop). */
export function ClientSidebar() {
  const pathname = usePathname() ?? ''

  return (
    <aside className="w-[260px] h-full flex flex-col gap-4 p-5 bg-[var(--color-surface)] border-r border-[var(--color-border-default)]">
      <header>
        <h3 className="text-sm font-bold text-[var(--color-title)]">Meu Bairro</h3>
      </header>

      <nav aria-label="Navegação do cliente" className="flex flex-col gap-1">
        {NAV_ITEMS.map((it) => {
          const active = pathname.startsWith(it.href)
          return (
            <Link
              key={it.label}
              href={it.href}
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
            </Link>
          )
        })}
      </nav>

      <footer className="mt-auto">
        <ClientPlanCard />
      </footer>
    </aside>
  )
}

/** Card informativo dos futuros Planos para o Cliente. */
function ClientPlanCard() {
  return (
    <div className="p-3.5 rounded-xl bg-gradient-to-br from-[var(--color-primary)]/10 via-[var(--color-surface)] to-[var(--color-page)] border border-[var(--color-primary)]/25 flex flex-col gap-2 shadow-2xs">
      <div className="flex items-center gap-2">
        <span className="size-7 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-bold shadow-2xs">
          <i className="ri-vip-crown-line text-amber-300" />
        </span>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-[var(--color-title)] truncate">Planos & Vantagens</span>
          <span className="text-[10px] text-[var(--color-muted)] font-medium">Recursos exclusivos</span>
        </div>
      </div>

      <p className="text-[11px] text-[var(--color-body)] leading-relaxed">
        Conheça nossos planos para clientes e garanta ofertas e vantagens nos estabelecimentos do seu bairro.
      </p>

      <Link
        href="/planos"
        className="mt-1 w-full h-8 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs"
      >
        <i className="ri-sparkles-line text-sm" />
        Conhecer Planos
      </Link>
    </div>
  )
}
