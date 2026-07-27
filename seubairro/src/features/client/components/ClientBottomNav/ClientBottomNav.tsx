'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { href: '/dashboard-client', icon: 'ri-home-5-line', label: 'Início' },
  { href: '/meus-pedidos', icon: 'ri-shopping-bag-3-line', label: 'Pedidos' },
  { href: '/mensagens', icon: 'ri-message-3-line', label: 'Mensagens' },
]

export function ClientBottomNav() {
  const pathname = usePathname() ?? ''

  return (
    <ul className="grid grid-cols-3 h-16" role="list">
      {NAV_ITEMS.map((it) => {
        const active = pathname.startsWith(it.href)
        return (
          <li key={it.label}>
            <Link
              href={it.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'h-full flex flex-col items-center justify-center gap-0.5 text-xs transition-colors',
                active
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-primary)] active:bg-[var(--color-page)]',
              )}
            >
              <i className={`${it.icon} text-xl`} aria-hidden />
              <span>{it.label}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
