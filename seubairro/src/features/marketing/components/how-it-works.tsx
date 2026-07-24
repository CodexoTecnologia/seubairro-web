import Link from 'next/link'

const STEPS = [
  {
    icon: 'ri-user-add-line',
    title: 'Crie sua conta',
    desc: 'Cadastro rápido e gratuito — como vizinho, como negócio ou os dois.',
  },
  {
    icon: 'ri-map-pin-line',
    title: 'Defina sua localização',
    desc: 'Use o GPS ou o seu endereço para enxergar o que existe por perto.',
  },
  {
    icon: 'ri-compass-3-line',
    title: 'Descubra o bairro',
    desc: 'Busque produtos e serviços, veja quem está aberto agora e fale direto com o vendedor.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 md:py-24 scroll-mt-20">
      <div className="max-w-[1200px] mx-auto px-4">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-title)]">
            Como funciona
          </h2>
          <p className="mt-3 text-[var(--color-muted)]">
            Três passos separam você do comércio da sua vizinhança.
          </p>
        </header>

        <ol role="list" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="relative p-6 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="size-8 shrink-0 rounded-full bg-[var(--color-primary)] text-white text-sm font-bold flex items-center justify-center"
                >
                  {i + 1}
                </span>
                <span className="size-12 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-2xl flex items-center justify-center">
                  <i className={s.icon} aria-hidden />
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[var(--color-title)]">{s.title}</h3>
              <p className="text-sm text-[var(--color-body)]">{s.desc}</p>
            </li>
          ))}
        </ol>

        <footer className="mt-10 text-center">
          <Link
            href="/cadastro"
            className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-[var(--shadow-primary)] hover:opacity-95 active:opacity-90 transition-opacity"
          >
            Começar agora <i className="ri-arrow-right-line" aria-hidden />
          </Link>
        </footer>
      </div>
    </section>
  )
}
