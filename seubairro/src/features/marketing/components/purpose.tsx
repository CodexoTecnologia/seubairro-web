'use client'

import { cn } from '@/lib/utils/cn'

type Card = { icon: string; title: string; body: React.ReactNode; highlight?: boolean }

const CARDS: Card[] = [
  {
    icon: 'ri-map-pin-user-line',
    title: 'Visibilidade Real',
    body: (
      <>
        Muitos serviços locais excelentes ficam escondidos nos mapas genéricos. O{' '}
        <strong>SeuBairro</strong> dá destaque igualitário para o pequeno empreendedor.
      </>
    ),
  },
  {
    icon: 'ri-hand-heart-line',
    title: 'Economia Circular',
    body: 'Nossa missão é manter o dinheiro circulando na comunidade. Quando você compra do vizinho, todo o bairro se desenvolve.',
    highlight: true,
  },
  {
    icon: 'ri-shake-hands-line',
    title: 'Relacionamento Direto',
    body: 'Sem algoritmos complexos ou taxas abusivas de entrega. Facilitamos o contato direto para você negociar como preferir.',
  },
]

export default function Purpose() {
  return (
    <section id="proposito" className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-title)]">
            Mais que um mapa, uma comunidade
          </h2>
          <p className="mt-3 text-[var(--color-muted)]">
            Enquanto grandes plataformas focam apenas em rotas e trânsito, nós focamos nas pessoas e
            nos negócios que fazem o bairro acontecer.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CARDS.map((c) => (
            <article
              key={c.title}
              className={cn(
                'p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] flex flex-col gap-3 transition-colors',
                c.highlight && 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5',
              )}
            >
              <div className="size-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-2xl flex items-center justify-center">
                <i className={c.icon} />
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-title)]">{c.title}</h3>
              <p className="text-sm text-[var(--color-body)]">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
