'use client'

import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[var(--color-title)]">
            A tecnologia a favor do
            <br />
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] bg-clip-text text-transparent">
              Comércio Local.
            </span>
          </h1>
          <p className="text-lg text-[var(--color-body)] max-w-prose">
            Nascido como um projeto acadêmico de destaque no <strong>IFPR</strong>, o SeuBairro está
            evoluindo para se tornar a principal ferramenta de conexão entre moradores e negócios
            locais. De vizinho para vizinho.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="#contato"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-[var(--color-primary)] text-white font-semibold shadow-[var(--shadow-primary)] hover:opacity-95 active:opacity-90 transition-opacity"
            >
              Quero saber mais
            </a>
            <a
              href="#proposito"
              className="inline-flex items-center gap-2 h-11 text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              Entenda a visão <i className="ri-arrow-down-line" aria-hidden />
            </a>
          </div>
        </div>

        <div aria-hidden className="relative aspect-square max-w-md mx-auto w-full">
          <div className="absolute inset-0 rounded-full border border-[var(--color-primary)]/15" />
          <div className="absolute inset-[8%] rounded-full border border-[var(--color-primary)]/20" />
          <div className="absolute inset-[16%] rounded-full border border-[var(--color-primary)]/25" />

          <div
            className="absolute inset-[24%] rounded-full motion-safe:animate-[spin_6s_linear_infinite]"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 75%, rgb(from var(--color-primary) r g b / 0.4) 90%, transparent)',
            }}
          />

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-20 rounded-full bg-[var(--color-surface)] shadow-[var(--shadow-elevated)] flex items-center justify-center ring-2 ring-[var(--color-primary)]/30">
            <Image src="/assets/logo-seubairro.svg" alt="" width={40} height={40} priority />
          </div>

          <div className="absolute top-[18%] left-[55%] flex flex-col items-center gap-1" title="Mercado">
            <span className="size-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center shadow-md text-[var(--color-primary)] text-xl">
              <i className="ri-store-2-fill" />
            </span>
          </div>
          <div className="absolute top-[60%] left-[18%] flex flex-col items-center gap-1" title="Serviços">
            <span className="size-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center shadow-md text-[var(--color-accent)] text-xl">
              <i className="ri-hammer-fill" />
            </span>
          </div>
          <div className="absolute top-[65%] left-[70%] flex flex-col items-center gap-1" title="Lazer">
            <span className="size-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center shadow-md text-[var(--color-warning)] text-xl">
              <i className="ri-restaurant-fill" />
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
