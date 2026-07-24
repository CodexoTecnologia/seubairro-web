'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Drawer } from '@/design-system/patterns'

const NAV_ITEMS = [
  { href: '#proposito', label: 'Propósito' },
  { href: '#para-quem', label: 'Para Quem É' },
  { href: '#como-funciona', label: 'Como Funciona' },
  { href: '#roadmap', label: 'Trajetória' },
  { href: '#contato', label: 'Contato' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)]/80 backdrop-blur border-b border-[var(--color-border-default)]">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/assets/logo-seubairro.svg" alt="Logo SeuBairro" width={32} height={32} priority />
          <span className="font-bold text-lg text-[var(--color-title)]">
            Seu<span className="text-[var(--color-primary)]">Bairro</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3" aria-label="Navegação principal">
          <ul role="list" className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((it) => (
              <li key={it.href}>
                <a
                  href={it.href}
                  className="block px-1 py-2 min-h-11 text-sm font-medium text-[var(--color-body)] hover:text-[var(--color-primary)] transition-colors"
                >
                  {it.label}
                </a>
              </li>
            ))}
          </ul>

          <Link
            href="/login"
            className="hidden md:inline-flex items-center px-4 h-11 rounded-full border border-[var(--color-border-default)] text-sm font-semibold text-[var(--color-body)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="hidden md:inline-flex items-center gap-2 px-4 h-11 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 active:opacity-80 transition-opacity"
          >
            <i className="ri-user-add-line" aria-hidden />
            Criar conta
          </Link>

          <div className="md:hidden">
            <Drawer
              title="Menu"
              size="sm"
              trigger={
                <button
                  type="button"
                  aria-label="Abrir menu"
                  className="size-11 flex items-center justify-center text-2xl text-[var(--color-body)] hover:bg-[var(--color-page)] active:bg-[var(--color-border-default)] rounded-full transition-colors"
                >
                  <i className="ri-menu-3-line" aria-hidden />
                </button>
              }
            >
              <ul role="list" className="flex flex-col gap-1">
                {NAV_ITEMS.map((it) => (
                  <li key={it.href}>
                    <Drawer.Close asChild>
                      <a
                        href={it.href}
                        className="flex items-center px-3 py-2 min-h-11 rounded-lg text-sm font-medium text-[var(--color-body)] hover:bg-[var(--color-page)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        {it.label}
                      </a>
                    </Drawer.Close>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-[var(--color-border-default)] flex flex-col gap-2">
                <Drawer.Close asChild>
                  <Link
                    href="/cadastro"
                    className="inline-flex items-center justify-center gap-2 h-11 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold"
                  >
                    <i className="ri-user-add-line" aria-hidden />
                    Criar conta grátis
                  </Link>
                </Drawer.Close>
                <Drawer.Close asChild>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center h-11 rounded-full border border-[var(--color-border-default)] text-sm font-semibold text-[var(--color-body)]"
                  >
                    Entrar
                  </Link>
                </Drawer.Close>
              </div>
            </Drawer>
          </div>
        </nav>
      </div>
    </header>
  )
}
