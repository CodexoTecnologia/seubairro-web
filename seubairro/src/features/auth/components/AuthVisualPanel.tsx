'use client'

import Image from 'next/image'
import { useMemo, type CSSProperties } from 'react'
import DotGrid from '@/design-system/effects/dot-grid'
import { cn } from '@/lib/utils/cn'

type Mode = 'client' | 'business' | 'recovery'

type Props = {
  title: string
  description: string
  mode?: Mode
}

type Point = { icon: string; label: string; style: CSSProperties }

const COLORS: Record<Mode, { base: string; active: string }> = {
  client: { base: '#2563EB', active: '#60A5FA' },
  business: { base: '#0F766E', active: '#2DD4BF' },
  recovery: { base: '#475569', active: '#94A3B8' },
}

const POINTS: Record<Mode, { icon: string; label: string }[]> = {
  client: [
    { icon: 'ri-store-2-fill', label: 'Mercado' },
    { icon: 'ri-hammer-fill', label: 'Reformas' },
    { icon: 'ri-restaurant-2-fill', label: 'Lanches' },
  ],
  business: [
    { icon: 'ri-line-chart-fill', label: 'Vendas' },
    { icon: 'ri-user-star-fill', label: 'Clientes' },
    { icon: 'ri-store-3-fill', label: 'Sua Loja' },
  ],
  recovery: [
    { icon: 'ri-shield-check-line', label: 'Seguro' },
    { icon: 'ri-lock-unlock-line', label: 'Recuperação' },
    { icon: 'ri-mail-check-line', label: 'Verificação' },
  ],
}

const positionFor = (index: number, total: number): CSSProperties => {
  const radius = 22
  const angle = -Math.PI / 2 + index * ((2 * Math.PI) / total)
  return {
    top: `${50 + radius * Math.sin(angle)}%`,
    left: `${50 + radius * Math.cos(angle)}%`,
    animationDelay: `${index * 1.5}s`,
  }
}

const gradientFor: Record<Mode, string> = {
  client:
    'bg-[linear-gradient(135deg,#0B1226_0%,#0F1E45_45%,#1E3A8A_100%)]',
  business: 'bg-[linear-gradient(135deg,#022C28_0%,#064E3B_45%,#0F766E_100%)]',
  recovery: 'bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_45%,#334155_100%)]',
}

export default function AuthVisualPanel({ title, description, mode = 'client' }: Props) {
  const { base, active } = COLORS[mode]

  // Pontos são puramente derivados de `mode` — useMemo em vez de useState+useEffect
  // evita o ciclo render → effect → setState → re-render.
  const points = useMemo<Point[]>(() => {
    const items = POINTS[mode]
    return items.map((p, i) => ({ ...p, style: positionFor(i, items.length) }))
  }, [mode])

  return (
    <div className={cn('relative hidden lg:block overflow-hidden w-1/2 min-h-screen text-white', gradientFor[mode])}>
      <DotGrid baseColor={base} activeColor={active} dotSize={4} gap={24} shockRadius={300} proximity={120} />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative size-[80%] aspect-square">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute size-32 rounded-full border border-white/10 animate-[pulse_3s_ease-in-out_infinite]" />
            <div className="absolute size-60 rounded-full border border-white/5 animate-[pulse_3s_ease-in-out_infinite_1.5s]" />
            <div className="relative z-10 size-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center ring-1 ring-white/20">
              <Image src="/assets/logo-seubairro.svg" alt="Logo" width={40} height={40} />
            </div>
          </div>

          {points.map((point, idx) => (
            <div
              key={idx}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 animate-[pulse_3s_ease-in-out_infinite]"
              style={point.style}
            >
              <div className="size-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center ring-1 ring-white/20 text-lg">
                <i className={point.icon} />
              </div>
              <span className="text-xs text-white/80">{point.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

      <div className="absolute bottom-12 left-12 right-12 z-10">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-white/80 text-base max-w-md">{description}</p>
      </div>
    </div>
  )
}
