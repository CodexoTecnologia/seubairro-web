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
import { Modal } from '@/design-system/patterns/Modal'
import { PageHeader } from '@/design-system/patterns/PageHeader'
import { StatusBadge } from '@/design-system/patterns/StatusBadge'

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
          // Contrato v1: a capa vem em `coverImageUrl`.
          coverImageUrl?: string | null
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
              imageUrl: l.coverImageUrl ?? null,
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

  const removeAd = (id: string) => {
    setAds((prev) => prev.filter((ad) => ad.id !== id))
  }

  const filtered = ads.filter((ad) => {
    const matchSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchStatus = statusFilter === 'all' || ad.status === statusFilter
    const matchCat = categoryFilter === 'all' || ad.categoryId === categoryFilter
    return matchSearch && matchStatus && matchCat
  })

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Seus Anúncios"
        description="Gerencie seus produtos e serviços ativos."
        actions={
          <Link href="/criar-anuncio">
            <Button leftIcon={<i className="ri-add-line" />}>Novo Anúncio</Button>
          </Link>
        }
      />

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
                  <StatusBadge tone={ad.status === 'active' ? 'success' : 'neutral'}>
                    {ad.status === 'active' ? 'Ativo' : 'Inativo'}
                  </StatusBadge>
                </div>
                <div data-numeric className="text-sm font-semibold text-[var(--color-primary)] mt-1">
                  {ad.price}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                {/* size-11 = 44px: alvo de toque mínimo recomendado */}
                <Link
                  href={`/anuncio/${ad.id}`}
                  aria-label={`Perguntas e avaliações de ${ad.title}`}
                  className="size-11 rounded-full hover:bg-[var(--color-page)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center"
                >
                  <i className="ri-question-answer-line" />
                </Link>
                <Link
                  href={`/anuncio/${ad.id}/editar`}
                  aria-label={`Editar ${ad.title}`}
                  className="size-11 rounded-full hover:bg-[var(--color-page)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center"
                >
                  <i className="ri-pencil-line" />
                </Link>
                <DeleteAdAction ad={ad} onDeleted={removeAd} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

/** Exclusão com confirmação em Modal do DS — sem `confirm()`/`alert()` nativos. */
function DeleteAdAction({ ad, onDeleted }: { ad: Ad; onDeleted: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      await ListingService.delete(ad.id)
      setOpen(false)
      onDeleted(ad.id)
    } catch {
      setError('Não foi possível excluir o anúncio. Tente novamente.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setError(null)
      }}
      trigger={
        <button
          type="button"
          aria-label={`Excluir ${ad.title}`}
          className="size-11 rounded-full hover:bg-[var(--color-danger-bg)] text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors flex items-center justify-center"
        >
          <i className="ri-delete-bin-line" />
        </button>
      }
      title={`Excluir "${ad.title}"?`}
      description="O anúncio sai do seu perfil público na hora. Esta ação não pode ser desfeita."
      footer={
        <>
          <Modal.Close asChild>
            <Button variant="ghost" size="sm">
              Voltar
            </Button>
          </Modal.Close>
          <Button variant="danger" size="sm" isLoading={isDeleting} onClick={handleConfirm}>
            Excluir anúncio
          </Button>
        </>
      }
    >
      {error && (
        <p role="alert" className="text-sm text-[var(--color-danger-fg)]">
          {error}
        </p>
      )}
    </Modal>
  )
}
