'use client'

import { cn } from '@/lib/utils/cn'

type Step = {
  icon: string
  label: string
  title: string
  desc: string
  state: 'done' | 'active' | 'future'
  badge?: string
}

const STEPS: Step[] = [
  {
    icon: 'ri-book-open-line',
    label: 'A Fundação',
    title: 'Validado no IFPR',
    state: 'done',
    desc: 'O projeto nasceu como TCC, onde a ideia, a viabilidade econômica e a necessidade do comércio de Colombo foram pesquisadas e validadas com nota máxima.',
  },
  {
    icon: 'ri-code-s-slash-line',
    label: 'O Desenvolvimento',
    title: 'Construção da V2',
    state: 'active',
    badge: 'Estamos Aqui',
    desc: 'Deixamos o código acadêmico para trás. Estamos reescrevendo a plataforma com arquitetura escalável, foco em segurança e design profissional.',
  },
  {
    icon: 'ri-rocket-2-line',
    label: 'O Lançamento',
    title: 'Piloto em Colombo',
    state: 'future',
    desc: 'O lançamento oficial acontecerá primeiro em nossa casa. Um teste piloto com comércios selecionados antes da expansão para toda a região.',
  },
]

const STATE_STYLES: Record<Step['state'], string> = {
  done: 'border-[var(--color-success)]/40 bg-[var(--color-success-bg)]',
  active: 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]/20',
  future: 'border-[var(--color-border-default)] bg-[var(--color-surface)] opacity-90',
}

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto px-4">
        <header className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-title)]">
            Do Conceito à Realidade
          </h2>
          <p className="mt-3 text-[var(--color-muted)]">
            O SeuBairro não é apenas uma ideia. É um projeto com base sólida e um plano claro de execução.
          </p>
        </header>

        <div className="relative">
          <div className="hidden md:block absolute left-0 right-0 top-12 h-px bg-gradient-to-r from-[var(--color-success)] via-[var(--color-primary)] to-[var(--color-border-default)]" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {STEPS.map((s) => (
              <article
                key={s.title}
                className={cn(
                  'relative p-6 rounded-[var(--radius-card)] border flex flex-col gap-3',
                  STATE_STYLES[s.state],
                )}
              >
                {s.badge && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow">
                    <span className="size-2 rounded-full bg-white animate-pulse" />
                    {s.badge}
                  </span>
                )}
                <div className="size-12 rounded-xl bg-white text-[var(--color-primary)] text-2xl flex items-center justify-center shadow-sm">
                  <i className={s.icon} />
                </div>
                <span className="text-xs uppercase tracking-wider text-[var(--color-muted)] font-semibold">
                  {s.label}
                </span>
                <h3 className="text-lg font-semibold text-[var(--color-title)]">{s.title}</h3>
                <p className="text-sm text-[var(--color-body)]">{s.desc}</p>
              </article>
            ))}
          </div>
        </div>

        <footer id="participar" className="mt-12 text-center">
          <p className="text-[var(--color-muted)]">Quer fazer parte do grupo de teste piloto?</p>
          <a
            href="mailto:codexotecnologia@gmail.com"
            className="inline-flex items-center gap-2 mt-2 text-[var(--color-primary)] font-semibold hover:underline"
          >
            Entre em contato conosco <i className="ri-arrow-right-line" />
          </a>
        </footer>
      </div>
    </section>
  )
}
