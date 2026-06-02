'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SplitText from '@/design-system/effects/SplitText'
import AuthVisualPanel from '@/features/auth/components/AuthVisualPanel'
import BackButton from '@/design-system/effects/BackButton'
import { ClientForm } from './components/client.form'
import { BusinessForm } from './components/business.form'

type Mode = 'selection' | 'client' | 'business'

export default function Cadastro() {
  const [mode, setMode] = useState<Mode>('selection')

  const pageTitle =
    mode === 'client' ? 'Cadastro de Vizinho' : mode === 'business' ? 'Cadastro de Negócio' : 'Crie sua conta'
  const pageDesc =
    mode === 'client'
      ? 'Preencha seus dados para acessar.'
      : mode === 'business'
        ? 'Vamos criar sua vitrine digital.'
        : 'Escolha como você deseja usar a plataforma.'

  const visualMode = mode === 'business' ? 'business' : 'client'

  return (
    <main
      data-context={mode === 'business' ? 'business' : 'client'}
      className="min-h-dvh flex"
    >
      <div className="flex-1 flex items-center justify-center bg-[var(--color-page)] p-6">
        <div className="w-full max-w-md flex flex-col gap-6 p-6">
          <header className="flex flex-col gap-3">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/assets/logo-seubairro.svg" alt="SeuBairro" width={40} height={40} priority />
              <SplitText
                text="SeuBairro"
                className="text-xl font-bold text-[var(--color-title)]"
                delay={50}
                duration={1.25}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="left"
              />
            </Link>
            {mode !== 'selection' && (
              <div>
                <BackButton onClick={() => setMode('selection')} />
              </div>
            )}
            <h1 className="text-2xl font-bold text-[var(--color-title)]">{pageTitle}</h1>
            <p className="text-sm text-[var(--color-muted)]">{pageDesc}</p>
          </header>

          {mode === 'selection' && (
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setMode('client')}
                className="group flex items-center gap-4 p-4 text-left rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] hover:border-[var(--color-primary)] active:bg-[var(--color-page)] transition-colors"
              >
                <span className="size-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-2xl flex items-center justify-center">
                  <i className="ri-user-smile-line" aria-hidden />
                </span>
                <span className="flex-1">
                  <strong className="block text-[var(--color-title)]">Sou Vizinho / Cliente</strong>
                  <span className="text-sm text-[var(--color-muted)]">
                    Quero encontrar produtos e serviços perto de mim.
                  </span>
                </span>
                <i
                  aria-hidden
                  className="ri-arrow-right-line text-xl text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors"
                />
              </button>

              <button
                type="button"
                onClick={() => setMode('business')}
                className="group flex items-center gap-4 p-4 text-left rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] hover:border-[var(--color-primary)] active:bg-[var(--color-page)] transition-colors"
              >
                <span className="size-12 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-2xl flex items-center justify-center">
                  <i className="ri-store-3-line" aria-hidden />
                </span>
                <span className="flex-1">
                  <strong className="block text-[var(--color-title)]">Sou Empreendedor</strong>
                  <span className="text-sm text-[var(--color-muted)]">
                    Quero divulgar meu negócio e vender na região.
                  </span>
                </span>
                <i
                  aria-hidden
                  className="ri-arrow-right-line text-xl text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors"
                />
              </button>

              <p className="text-sm text-center text-[var(--color-muted)] mt-2">
                Já tem uma conta?{' '}
                <Link href="/login" className="text-[var(--color-primary)] font-medium hover:underline">
                  Fazer Login
                </Link>
              </p>
            </div>
          )}

          {mode === 'client' && <ClientForm />}
          {mode === 'business' && <BusinessForm />}
        </div>
      </div>

      <AuthVisualPanel
        title={visualMode === 'business' ? 'Expanda seu negócio' : 'Explore seu bairro'}
        description={
          visualMode === 'business'
            ? 'Conecte-se com clientes locais.'
            : 'Encontre tudo o que precisa perto de você.'
        }
        mode={visualMode}
      />
    </main>
  )
}
