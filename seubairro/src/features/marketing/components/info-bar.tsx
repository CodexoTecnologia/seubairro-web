'use client'

const ITEMS = [
  { icon: 'ri-building-4-line', title: 'Identidade Local', desc: 'Focado na sua região' },
  { icon: 'ri-group-line', title: 'Sem Intermediários', desc: 'Conexão direta' },
  { icon: 'ri-rocket-line', title: 'Inovação Aberta', desc: 'Tecnologia acessível' },
]

export default function InfoBar() {
  return (
    <section className="bg-[var(--color-surface)] border-y border-[var(--color-border-default)]">
      <div className="max-w-[1200px] mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-0 md:divide-x md:divide-[var(--color-border-default)]">
        {ITEMS.map((it) => (
          <div key={it.title} className="flex items-center gap-4 md:px-6 md:first:pl-0 md:last:pr-0">
            <i className={`${it.icon} text-3xl text-[var(--color-primary)]`} />
            <div className="flex flex-col">
              <strong className="text-[var(--color-title)]">{it.title}</strong>
              <span className="text-sm text-[var(--color-muted)]">{it.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
