'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function ChooseProfilePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-page)] px-6 py-12 gap-6">
      <Image src="/assets/logo-seubairro.svg" alt="Logo SeuBairro" width={64} height={64} priority />
      <div className="text-center max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">
          Como você quer entrar?
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          Escolha o perfil que melhor representa você.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-4">
        <Link
          href="/dashboard-client"
          data-context="client"
          className="group relative flex flex-col gap-3 p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] hover:border-[var(--color-primary)] transition-colors"
        >
          <div className="size-12 flex items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-2xl">
            <i className="ri-user-heart-line" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-title)]">Sou Vizinho</h3>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Quero descobrir produtos e serviços perto de mim.
            </p>
          </div>
          <i className="ri-arrow-right-line absolute top-6 right-6 text-xl text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
        </Link>
        <Link
          href="/dashboard-business"
          data-context="business"
          className="group relative flex flex-col gap-3 p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] hover:border-[var(--color-primary)] transition-colors"
        >
          <div className="size-12 flex items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-2xl">
            <i className="ri-store-2-line" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-title)]">Sou Empreendedor</h3>
            <p className="text-sm text-[var(--color-muted)] mt-1">
              Quero divulgar meu negócio no bairro.
            </p>
          </div>
          <i className="ri-arrow-right-line absolute top-6 right-6 text-xl text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors" />
        </Link>
      </div>
    </main>
  )
}
