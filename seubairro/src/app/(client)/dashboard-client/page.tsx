'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ListingService } from '@/lib/api/services/ListingService'
import { CategoryService } from '@/lib/api/services/CategoryService'
import type { ListingResponse } from '@/lib/api/services/ListingService'
import type { CategoryResponse } from '@/lib/api/dtos/Response/business/CategoryResponse'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { OpenNowBadge } from '@/features/business/components'
import { cn } from '@/lib/utils/cn'

type Ad = {
  id: string
  title: string
  type: 'product' | 'service'
  category: string
  categoryName: string
  price: string
  businessSlug: string | null
}

const normalize = <T,>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object' && 'data' in raw && Array.isArray((raw as { data: unknown }).data))
    return (raw as { data: T[] }).data
  return []
}

const CATEGORIES = [
  { key: 'all', label: 'Tudo', icon: 'ri-apps-2-line' },
  { key: 'alimentacao', label: 'Alimentação', icon: 'ri-restaurant-2-line' },
  { key: 'servicos', label: 'Serviços', icon: 'ri-hammer-line' },
  { key: 'varejo', label: 'Varejo', icon: 'ri-shopping-bag-3-line' },
  { key: 'beleza', label: 'Beleza', icon: 'ri-scissors-cut-line' },
]

const TYPES = [
  { key: 'all', label: 'Todos' },
  { key: 'product', label: 'Produtos' },
  { key: 'service', label: 'Serviços' },
] as const

type TypeKey = (typeof TYPES)[number]['key']

const stripDiacritics = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '')

export default function ClientDashboard() {
  const searchParams = useSearchParams()
  const initialType = (searchParams.get('type') as TypeKey | null) ?? 'all'
  const initialCategory = searchParams.get('category') ?? 'all'

  const [currentType, setCurrentType] = useState<TypeKey>(initialType)
  const [currentCategory, setCurrentCategory] = useState<string>(initialCategory)
  const [ads, setAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [catsRaw, adsRaw] = await Promise.all([
          CategoryService.getAll(),
          ListingService.getNearby(50),
        ])
        if (cancelled) return
        const cats = normalize<CategoryResponse>(catsRaw)
        const catMap = Object.fromEntries(cats.map((c) => [c.id, c]))
        const raw = normalize<ListingResponse>(adsRaw)
        setAds(
          raw.map((l) => {
            const cat = catMap[l.listingCategoryId]
            return {
              id: l.id,
              title: l.title || 'Anúncio sem título',
              type: cat?.categoryType === 1 ? 'product' : 'service',
              category: cat?.name ? stripDiacritics(cat.name.toLowerCase()) : 'outros',
              categoryName: cat?.name ?? 'Geral',
              price: `R$ ${l.price.toFixed(2)}`,
              businessSlug: l.businessSlug ?? null,
            }
          }),
        )
      } catch (err) {
        console.error('Erro ao carregar dashboard:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = ads.filter((item) => {
    const matchType = currentType === 'all' || item.type === currentType
    const matchCat = currentCategory === 'all' || item.category === currentCategory
    return matchType && matchCat
  })

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border-default)] -mx-4 md:-mx-6 px-4 md:px-6 py-4 flex flex-col gap-3 sticky top-[var(--nav-height)] z-20">
        <div role="tablist" aria-label="Tipo de anúncio" className="flex gap-2">
          {TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={currentType === t.key}
              onClick={() => setCurrentType(t.key)}
              className={cn(
                'flex-1 h-11 rounded-full text-sm font-medium transition-colors',
                currentType === t.key
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-page)] text-[var(--color-body)] hover:bg-[var(--color-border-default)] active:bg-[var(--color-border-default)]',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div
          role="tablist"
          aria-label="Categoria"
          className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={currentCategory === c.key}
              onClick={() => setCurrentCategory(c.key)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 h-11 px-4 rounded-full text-xs font-medium transition-colors',
                currentCategory === c.key
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-page)] text-[var(--color-body)] hover:bg-[var(--color-border-default)] active:bg-[var(--color-border-default)]',
              )}
            >
              <i className={c.icon} aria-hidden />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <section>
        <h3 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide mb-3">
          Destaques perto de você
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="rect" height={160} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<i className="ri-search-2-line" aria-hidden />}
            title="Nenhum resultado encontrado"
            description="Tente outra categoria ou volte mais tarde."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={`/detalhes-anuncio?id=${item.id}`}
                className="group flex flex-col gap-2 p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] hover:border-[var(--color-primary)] active:scale-[0.99] motion-safe:transition-transform transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-xs text-[var(--color-muted)]">
                    <i
                      aria-hidden
                      className={
                        item.type === 'product' ? 'ri-shopping-bag-3-fill' : 'ri-user-star-fill'
                      }
                    />
                    {item.categoryName}
                  </span>
                  <OpenNowBadge slug={item.businessSlug} />
                </div>
                <h3 className="font-semibold text-[var(--color-title)] group-hover:text-[var(--color-primary)] transition-colors">
                  {item.title}
                </h3>
                <div className="text-[var(--color-primary)] font-bold mt-auto">{item.price}</div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
