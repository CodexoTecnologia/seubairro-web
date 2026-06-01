'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { usePublicProfileLink } from '@/features/business/hooks'
import { ListingService } from '@/lib/api/services/ListingService'
import { CategoryService } from '@/lib/api/services/CategoryService'
import { BusinessService } from '@/lib/api/services/BusinessService'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { EmptyState } from '@/design-system/patterns/EmptyState'
import { Button } from '@/design-system/primitives/Button'

type Listing = {
  id: string
  title: string
  categoryName: string
  price: string
  isActive: boolean
}

const normalize = <T,>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object' && 'data' in raw) {
    return Array.isArray((raw as { data: unknown }).data)
      ? ((raw as { data: T[] }).data ?? [])
      : []
  }
  return []
}

export default function BusinessDashboard() {
  const { user } = useAuthContext()
  const { href: publicHref, slug } = usePublicProfileLink()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [shareFeedback, setShareFeedback] = useState('')

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const business = await BusinessService.getByOwnerId(user.id)
        if (cancelled || !business) {
          setIsLoading(false)
          return
        }
        const [catsRaw, listingsRaw] = await Promise.all([
          CategoryService.getAll(),
          ListingService.getByBusiness(business.id),
        ])
        if (cancelled) return

        const cats = normalize<{ id: string; name: string }>(catsRaw)
        const catMap = Object.fromEntries(cats.map((c) => [c.id, c.name]))
        const raws = normalize<{
          id: string
          title?: string
          price: number
          isActive: boolean
          listingCategoryId?: string
          categoryId?: string
        }>(listingsRaw)
        setListings(
          raws.map((l) => ({
            id: l.id,
            title: l.title || 'Anúncio sem título',
            categoryName: catMap[l.listingCategoryId ?? l.categoryId ?? ''] ?? 'Geral',
            price: `R$ ${l.price.toFixed(2)}`,
            isActive: l.isActive,
          })),
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
  }, [user?.id])

  const handleShare = async () => {
    if (!slug) {
      setShareFeedback('Configure seu perfil público primeiro.')
      return
    }
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${publicHref}` : publicHref
    const sharePayload = {
      title: 'Conheça minha loja no SeuBairro',
      text: 'Veja meus produtos e serviços no SeuBairro',
      url: shareUrl,
    }
    if (typeof navigator === 'undefined') {
      setShareFeedback(shareUrl)
      return
    }
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(sharePayload)
        setShareFeedback('')
        return
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setShareFeedback('Link copiado!')
        return
      }
      setShareFeedback(shareUrl)
    } catch {
      // Usuário cancelou o share — silencioso.
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-title)]">
          Bom dia{user?.name ? `, ${user.name}` : ''}
        </h1>
        <p className="text-[var(--color-muted)] mt-1">Aqui está o resumo do seu negócio hoje.</p>
      </header>

      <section>
        <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide mb-3">
          O que você quer fazer?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/criar-anuncio"
            className="flex items-center gap-3 p-4 rounded-[var(--radius-card)] bg-[var(--color-primary)] text-white hover:opacity-95 active:opacity-90 transition-opacity"
          >
            <i className="ri-add-circle-line text-2xl" aria-hidden />
            <span className="font-semibold">Criar Novo Anúncio</span>
          </Link>
          <Link
            href="/editar-profile"
            className="flex items-center gap-3 p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] text-[var(--color-body)] hover:bg-[var(--color-page)] active:bg-[var(--color-border-default)] transition-colors"
          >
            <i className="ri-edit-box-line text-2xl text-[var(--color-primary)]" aria-hidden />
            <span className="font-semibold">Editar Informações</span>
          </Link>
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-3 p-4 rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] text-[var(--color-body)] hover:bg-[var(--color-page)] active:bg-[var(--color-border-default)] transition-colors text-left"
          >
            <i className="ri-share-forward-line text-2xl text-[var(--color-primary)]" aria-hidden />
            <span className="font-semibold">Compartilhar Loja</span>
          </button>
        </div>
        {shareFeedback && (
          <p role="status" aria-live="polite" className="mt-2 text-sm text-[var(--color-body)]">
            {shareFeedback}
          </p>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
            Seus Anúncios Ativos
          </h2>
          <Link href="/listar-anuncio" className="text-sm text-[var(--color-primary)] hover:underline font-medium">
            Ver todos
          </Link>
        </div>

        <div className="rounded-[var(--radius-card)] bg-[var(--color-surface)] border border-[var(--color-border-default)] divide-y divide-[var(--color-border-default)] overflow-hidden">
          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4">
                  <Skeleton variant="rect" className="size-12" />
                  <div className="flex-1 flex flex-col gap-2">
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="30%" />
                  </div>
                  <Skeleton variant="rect" width={64} height={28} />
                </div>
              ))}
            </>
          ) : listings.length === 0 ? (
            <EmptyState
              icon={<i className="ri-store-2-line" aria-hidden />}
              title="Você ainda não tem anúncios"
              description="Crie seu primeiro produto ou serviço para aparecer nas buscas."
              action={
                <Link href="/criar-anuncio">
                  <Button>Criar primeiro anúncio</Button>
                </Link>
              }
            />
          ) : (
            listings.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="flex flex-col flex-1">
                  <strong className="text-[var(--color-title)]">{item.title}</strong>
                  <span className="text-xs text-[var(--color-muted)]">{item.categoryName}</span>
                </div>
                <div className="text-sm font-semibold text-[var(--color-primary)]">{item.price}</div>
                <span
                  className={
                    item.isActive
                      ? 'text-xs px-2 py-1 rounded-full bg-[var(--color-success-bg)] text-[var(--color-success)] font-medium'
                      : 'text-xs px-2 py-1 rounded-full bg-[var(--color-page)] text-[var(--color-muted)] font-medium'
                  }
                >
                  {item.isActive ? 'Ativo' : 'Inativo'}
                </span>
                <button
                  type="button"
                  className="size-11 rounded-full hover:bg-[var(--color-page)] active:bg-[var(--color-border-default)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center justify-center"
                  aria-label={`Editar anúncio: ${item.title}`}
                >
                  <i className="ri-pencil-line" aria-hidden />
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
