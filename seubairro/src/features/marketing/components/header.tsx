'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import SplitText from '@/design-system/effects/SplitText'
import { cn } from '@/lib/utils/cn'

export default function Header() {
  const [menuActive, setMenuActive] = useState(false)
  const close = () => setMenuActive(false)

  return (
    <header className="sticky top-0 z-40 bg-[var(--color-surface)]/80 backdrop-blur border-b border-[var(--color-border-default)]">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2 shrink-0">
          <Image src="/assets/logo-seubairro.svg" alt="Logo SeuBairro" width={32} height={32} priority />
          <SplitText
            text="SeuBairro"
            className="font-bold text-lg text-[var(--color-title)]"
            delay={50}
            duration={1.25}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
          />
        </a>

        <nav className="flex items-center gap-3">
          <button
            type="button"
            aria-label={menuActive ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuActive}
            onClick={() => setMenuActive((v) => !v)}
            className="md:hidden size-11 flex items-center justify-center text-2xl text-[var(--color-body)] hover:bg-[var(--color-page)] active:bg-[var(--color-border-default)] rounded-full transition-colors"
          >
            <i className={menuActive ? 'ri-close-line' : 'ri-menu-3-line'} aria-hidden />
          </button>

          <ul
            role="list"
            className={cn(
              'md:flex md:items-center md:gap-6 md:static md:bg-transparent md:shadow-none md:flex-row',
              'absolute md:relative top-16 md:top-0 right-0 md:right-auto',
              'flex-col gap-2 p-4 md:p-0 bg-[var(--color-surface)] md:bg-transparent',
              'shadow-lg md:shadow-none w-64 md:w-auto',
              menuActive ? 'flex' : 'hidden md:flex',
            )}
          >
            <li>
              <a
                href="#proposito"
                onClick={close}
                className="block px-3 py-2 min-h-11 text-sm font-medium text-[var(--color-body)] hover:text-[var(--color-primary)] transition-colors"
              >
                Propósito
              </a>
            </li>
            <li>
              <a
                href="#para-quem"
                onClick={close}
                className="block px-3 py-2 min-h-11 text-sm font-medium text-[var(--color-body)] hover:text-[var(--color-primary)] transition-colors"
              >
                Para Quem É
              </a>
            </li>
            <li className="md:hidden">
              <Link
                href="/login"
                onClick={close}
                className="inline-flex items-center gap-2 px-4 py-2 min-h-11 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold"
              >
                <i className="ri-user-line" aria-hidden />
                Entrar
              </Link>
            </li>
          </ul>

          <Link
            href="/login"
            className="hidden md:inline-flex items-center gap-2 px-4 h-11 rounded-full bg-[var(--color-primary)] text-white text-sm font-semibold hover:opacity-90 active:opacity-80 transition-opacity"
          >
            <i className="ri-user-line" aria-hidden />
            Entrar
          </Link>
        </nav>
      </div>
    </header>
  )
}
