'use client'

type Card = {
  icon: string
  title: string
  badge?: string
  items: string[]
  variant: 'client' | 'business'
}

const CARDS: Card[] = [
  {
    icon: 'ri-user-smile-line',
    title: 'Para Moradores',
    variant: 'client',
    items: [
      'Encontre serviços e produtos a poucos metros de casa.',
      'Descubra promoções exclusivas da vizinhança.',
      'Valorize o que é nosso e economize tempo de deslocamento.',
    ],
  },
  {
    icon: 'ri-store-3-line',
    title: 'Para Negócios Locais',
    badge: 'Oportunidade',
    variant: 'business',
    items: [
      'Sua vitrine digital focada em quem realmente compra de você.',
      'Ferramenta simples: cadastre-se e apareça no mapa.',
      'Sem taxas de adesão abusivas. Feito para o pequeno crescer.',
    ],
  },
]

export default function ForWho() {
  return (
    <section id="para-quem" className="py-16 md:py-24 bg-[var(--color-surface)]">
      <div className="max-w-[1200px] mx-auto px-4">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-title)]">
            Um ecossistema, duas soluções
          </h2>
          <p className="mt-3 text-[var(--color-muted)]">
            Conectamos as pontas soltas do bairro. Veja como o SeuBairro ajuda você.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CARDS.map((c) => (
            <article
              key={c.title}
              data-context={c.variant}
              className="relative p-6 md:p-8 rounded-[var(--radius-card)] bg-[var(--color-page)] border border-[var(--color-border-default)] flex flex-col gap-4"
            >
              {c.badge && (
                <span className="absolute top-4 right-4 text-xs px-2 py-1 rounded-full bg-[var(--color-primary)] text-white font-semibold">
                  {c.badge}
                </span>
              )}
              <div className="size-14 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-3xl flex items-center justify-center">
                <i className={c.icon} />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-title)]">{c.title}</h3>
              <ul className="flex flex-col gap-2">
                {c.items.map((line) => (
                  <li key={line} className="flex items-start gap-2 text-sm text-[var(--color-body)]">
                    <i className="ri-check-line text-[var(--color-success)] mt-0.5 shrink-0" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
