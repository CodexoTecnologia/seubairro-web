'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AuthGuard } from '@/features/shared/components'
import { useWorkspace } from '@/features/shared/hooks'
import {
  DASHBOARD_BY_ROLE,
  ROLE_BY_WORKSPACE,
  ROLE_CUSTOMER,
  type Workspace,
} from '@/lib/api/helper/RoleHelper'
import { Spinner } from '@/design-system/primitives/Spinner'

const CARDS: Record<Workspace, { title: string; description: string; icon: string }> = {
  client: {
    title: 'Sou Vizinho',
    description: 'Descubra produtos e serviços perto de você.',
    icon: 'ri-user-heart-line',
  },
  business: {
    title: 'Sou Empreendedor',
    description: 'Gerencie sua loja, anúncios e pedidos.',
    icon: 'ri-store-2-line',
  },
}

export default function ChooseProfilePage() {
  return (
    <AuthGuard>
      <ChooseProfileContent />
    </AuthGuard>
  )
}

function ChooseProfileContent() {
  const router = useRouter()
  const { availableWorkspaces, canSwitch, switchWorkspace } = useWorkspace()

  // A tela de escolha só se aplica a multi-role; os demais seguem direto.
  // `replace` para o botão voltar do navegador não retornar a esta tela.
  useEffect(() => {
    if (canSwitch) return
    const target = availableWorkspaces[0]
    router.replace(
      target ? DASHBOARD_BY_ROLE[ROLE_BY_WORKSPACE[target]] : DASHBOARD_BY_ROLE[ROLE_CUSTOMER],
    )
  }, [canSwitch, availableWorkspaces, router])

  if (!canSwitch) {
    return (
      <main
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="min-h-screen flex items-center justify-center gap-2 bg-[var(--color-page)] text-[var(--color-muted)]"
      >
        <Spinner size="sm" />
        <span>Redirecionando…</span>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-page)] px-6 py-12 gap-6">
      <Image src="/assets/logo-seubairro.svg" alt="Logo SeuBairro" width={64} height={64} priority />
      <div className="text-center max-w-md">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">
          Como você quer entrar?
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Você pode trocar de espaço a qualquer momento pelo menu da sua conta.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mt-4">
        {availableWorkspaces.map((workspace) => {
          const card = CARDS[workspace]
          return (
            <button
              key={workspace}
              type="button"
              onClick={() => switchWorkspace(workspace)}
              data-context={workspace}
              className="group relative flex flex-col gap-3 p-6 text-left rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] hover:border-[var(--color-primary)] transition-colors"
            >
              <div className="size-12 flex items-center justify-center rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-2xl">
                <i className={card.icon} aria-hidden />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-title)]">{card.title}</h3>
                <p className="mt-1 text-sm text-[var(--color-muted)]">{card.description}</p>
              </div>
              <i
                className="ri-arrow-right-line absolute top-6 right-6 text-xl text-[var(--color-muted)] group-hover:text-[var(--color-primary)] transition-colors"
                aria-hidden
              />
            </button>
          )
        })}
      </div>
    </main>
  )
}
