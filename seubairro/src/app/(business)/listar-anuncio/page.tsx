'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { ListingService } from '@/lib/api/services/ListingService'
import { CategoryService } from '@/lib/api/services/CategoryService'
import { BusinessService } from '@/lib/api/services/BusinessService'
import { Button } from '@/design-system/primitives/Button'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { cn } from '@/lib/utils/cn'

type Ad = {
  id: string
  title: string
  price: string
  status: 'active' | 'inactive'
  categoryId: string
  categoryName: string
  imageUrl: string | null
}

const normalize = <T,>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object' && 'data' in raw && Array.isArray((raw as { data: unknown }).data)) {
    return (raw as { data: T[] }).data
  }
  return []
}

export default function ListarAnuncioPage() {
  const { user } = useAuthContext()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [categoryFilter, setCategoryFilter] = useState<'all' | string>('all')
  const [ads, setAds] = useState<Ad[]>([])
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    let cancelled = false
    ;(async () => {
      try {
        const business = await BusinessService.getByOwnerId(user.id)
        if (cancelled || !business) {
          setIsLoading(false)
          return
        }
        const [catsRaw, adsRaw] = await Promise.all([
          CategoryService.getAll(),
          ListingService.getByBusiness(business.id),
        ])
        if (cancelled) return

        const cats = normalize<{ id: string; name: string }>(catsRaw)
        setCategories(cats)
        const catMap = Object.fromEntries(cats.map((c) => [c.id, c.name]))

        const raw = normalize<{
          id: string
          title?: string
          price: number
          isActive: boolean
          listingCategoryId?: string
          categoryId?: string
          imageUrl?: string | null
        }>(adsRaw)
        setAds(
          raw.map((l) => {
            const cid = l.listingCategoryId ?? l.categoryId ?? ''
            return {
              id: l.id,
              title: l.title || 'Anúncio sem título',
              price: `R$ ${l.price.toFixed(2)}`,
              status: l.isActive ? 'active' : 'inactive',
              categoryId: cid,
              categoryName: catMap[cid] ?? 'Geral',
              imageUrl: l.imageUrl ?? null,
            }
          }),
        )
      } catch (err) {
        console.error('Erro ao carregar anúncios:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [user])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return
    try {
      await ListingService.delete(id)
      setAds((prev) => prev.filter((ad) => ad.id !== id))
    } catch {
      alert('Erro ao excluir o anúncio')
    }
  }

  const filtered = ads.filter((ad) => {
    const matchSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || ad.status === statusFilter
    const matchCat = categoryFilter === 'all' || ad.categoryId === categoryFilter
    return matchSearch && matchStatus && matchCat
  })

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">Seus Anúncios</h1>
          <p className="text-[var(--color-muted)] mt-1">Gerencie seus produtos e serviços ativos.</p>
        </div>
        <Link href="/criar-anuncio">
          <Button leftIcon={<i className="ri-add-line" />}>Novo Anúncio</Button>
        </Link>
      </header>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Buscar anúncio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-default)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="h-10 px-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-default)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 px-3 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border-default)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
        >
          <option value="all">Todas Categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rect" height={88} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<i className="ri-search-2-line" />}
          title="Nenhum anúncio encontrado"
          description="Ajuste os filtros ou cadastre um novo anúncio."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((ad) => (
            <article
              key={ad.id}
              className="flex items-center gap-4 p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)]"
            >
              {ad.imageUrl && (
                <div className="relative size-16 rounded-lg overflow-hidden shrink-0 bg-[var(--color-input)]">
                  <Image
                    src={ad.imageUrl}
                    alt={ad.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-[var(--color-title)] truncate">{ad.title}</h3>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-medium',
                      ad.status === 'active'
                        ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                        : 'bg-[var(--color-page)] text-[var(--color-muted)]',
                    )}
                  >
                    {ad.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="text-sm font-semibold text-[var(--color-primary)] mt-1">{ad.price}</div>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  type="button"
                  aria-label="Editar"
                  className="size-9 rounded-full hover:bg-[var(--color-page)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center"
                >
                  <i className="ri-pencil-line" />
                </button>
                <button
                  type="button"
                  aria-label="Excluir"
                  onClick={() => handleDelete(ad.id)}
                  className="size-9 rounded-full hover:bg-[var(--color-danger-bg)] text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors flex items-center justify-center"
                >
                  <i className="ri-delete-bin-line" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
