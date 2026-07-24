'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { CategoryService } from '@/lib/api/services/CategoryService'
import { ListingService, type ListingResponse } from '@/lib/api/services/ListingService'
import { CategoryTypeEnum } from '@/lib/api/enums/CategoryTypeEnum'
import { resolveApiErrorMessage } from '@/lib/api/helper/resolveApiError'
import type { CreateListingRequest, UpdateListingRequest } from '@/lib/api/dtos/Request/index'
import type { CategoryResponse } from '@/lib/api/dtos/Response/index'
import { Button } from '@/design-system/primitives/Button'
import { Input } from '@/design-system/primitives/Input'
import { Card } from '@/design-system/primitives/Card'
import { ListingCard } from '@/design-system/patterns/ListingCard'
import { cn } from '@/lib/utils/cn'

type FormData = {
  listingCategoryId: string
  title: string
  stockQuantity: number | string
  description: string
  price: string
  currencyCode: string
}

type Props = {
  type: 'product' | 'service'
  /** Quando informado, o formulário edita este anúncio em vez de criar um novo. */
  listing?: ListingResponse
  /** Chamado após salvar com sucesso (criação ou edição). */
  onSaved?: (listing: ListingResponse) => void
}

const normalize = <T,>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object' && 'data' in raw && Array.isArray((raw as { data: unknown }).data))
    return (raw as { data: T[] }).data
  return []
}

const EMPTY_FORM: FormData = {
  listingCategoryId: '',
  title: '',
  stockQuantity: '',
  description: '',
  price: '',
  currencyCode: 'BRL',
}

/** Converte o preço digitado em pt-BR para número. */
function parsePriceBRL(input: string): number {
  const cleaned = input.replace(/[^\d.,]/g, '').trim()
  if (!cleaned) return NaN
  const normalized = cleaned.includes(',')
    ? cleaned.replace(/\./g, '').replace(',', '.')
    : cleaned
  return parseFloat(normalized)
}

/** Preço vem como number da API e é editado como texto (vírgula decimal em pt-BR). */
const toFormData = (listing: ListingResponse): FormData => ({
  listingCategoryId: listing.listingCategoryId,
  title: listing.title ?? '',
  stockQuantity: listing.stockQuantity !== undefined && listing.stockQuantity !== null ? listing.stockQuantity : '',
  description: listing.description ?? '',
  price: String(listing.price ?? '').replace('.', ','),
  currencyCode: listing.currencyCode?.trim() || 'BRL',
})

export type ImageItem =
  | { kind: 'existing'; id: string; url: string; isCover: boolean }
  | { kind: 'new'; id: string; file: File; previewUrl: string; isCover: boolean }

type ListingStepId = 'dados' | 'preco' | 'descricao' | 'imagem'

const LISTING_STEP_ORDER: ListingStepId[] = ['dados', 'preco', 'descricao', 'imagem']

const LISTING_STEPS: { id: ListingStepId; title: string; subtitle: string; icon: string }[] = [
  { id: 'dados', title: '1. Dados Básicos', subtitle: 'Título e categoria', icon: 'ri-file-info-line' },
  { id: 'preco', title: '2. Preço & Estoque', subtitle: 'Valores e quantidades', icon: 'ri-price-tag-3-line' },
  { id: 'descricao', title: '3. Descrição', subtitle: 'Detalhamento completo', icon: 'ri-align-left' },
  { id: 'imagem', title: '4. Galeria de Fotos', subtitle: 'Múltiplas fotos e capa', icon: 'ri-image-line' },
]

export function ListingForm({ type, listing, onSaved }: Props) {
  const isEditing = Boolean(listing)
  const [formData, setFormData] = useState<FormData>(listing ? toFormData(listing) : EMPTY_FORM)
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Gerenciamento de Múltiplas Fotos
  const [imageItems, setImageItems] = useState<ImageItem[]>(() => {
    if (listing?.images && listing.images.length > 0) {
      return listing.images.map((img) => ({
        kind: 'existing' as const,
        id: img.id,
        url: (img.imageUrl ?? img.url)!,
        isCover: img.isCover,
      }))
    }
    if (listing?.coverImageUrl) {
      return [
        {
          kind: 'existing' as const,
          id: 'cover-fallback',
          url: listing.coverImageUrl,
          isCover: true,
        },
      ]
    }
    return []
  })
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const [activeStep, setActiveStep] = useState<ListingStepId>('dados')
  const stepEnteredAt = useRef<number>(Date.now())

  useEffect(() => {
    stepEnteredAt.current = Date.now()
  }, [activeStep])

  // Sincroniza lista de imagens existentes vindas do objeto listing
  useEffect(() => {
    if (!listing) return
    if (listing.images && listing.images.length > 0) {
      setImageItems(
        listing.images.map((img) => ({
          kind: 'existing' as const,
          id: img.id,
          url: (img.imageUrl ?? img.url)!,
          isCover: img.isCover,
        })),
      )
    } else if (listing.coverImageUrl) {
      setImageItems([
        {
          kind: 'existing' as const,
          id: 'cover-fallback',
          url: listing.coverImageUrl,
          isCover: true,
        },
      ])
    }
  }, [listing])

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      try {
        const allowedTypes =
          type === 'product'
            ? [CategoryTypeEnum.Produtos, CategoryTypeEnum.Ambos]
            : [CategoryTypeEnum.Servicos, CategoryTypeEnum.Ambos]
        const raw = await CategoryService.getAll()
        const data = normalize<CategoryResponse>(raw)
        const filtered = data.filter((c) => c?.isActive && allowedTypes.includes(c.categoryType))
        setCategories(filtered)
        setFormData((prev) =>
          prev.listingCategoryId && !filtered.some((f) => f.id === prev.listingCategoryId)
            ? { ...prev, listingCategoryId: '' }
            : prev,
        )
      } catch {
        setError('Erro ao carregar categorias')
      } finally {
        setLoadingCategories(false)
      }
    }
    fetchCategories()
  }, [type])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stockQuantity' ? (value === '' ? '' : Math.max(0, parseInt(value, 10) || 0)) : value,
    }))
  }

  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return

    setImageItems((prev) => {
      const hasCover = prev.some((img) => img.isCover)
      const newItems: ImageItem[] = files.map((file, idx) => ({
        kind: 'new' as const,
        id: `new-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        isCover: !hasCover && idx === 0,
      }))
      return [...prev, ...newItems]
    })

    e.target.value = ''
  }

  const handleSetCover = (targetId: string) => {
    const item = imageItems.find((img) => img.id === targetId)
    if (!item || item.isCover) return

    setImageItems((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.id === targetId,
      })),
    )
  }

  const handleRemoveImage = (targetId: string) => {
    const itemToRemove = imageItems.find((img) => img.id === targetId)
    if (!itemToRemove) return

    if (isEditing && itemToRemove.kind === 'existing' && itemToRemove.id !== 'cover-fallback') {
      setDeletedImageIds((prev) => [...prev, itemToRemove.id])
    }

    if (itemToRemove.kind === 'new') {
      URL.revokeObjectURL(itemToRemove.previewUrl)
    }

    setImageItems((prev) => {
      const next = prev.filter((img) => img.id !== targetId)
      if (itemToRemove.isCover && next.length > 0) {
        next[0] = { ...next[0], isCover: true }
      }
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Se não estiver na última etapa, submeter a partir do formulário (ex: tecla Enter) apenas avança o passo
    if (nextStep) {
      setActiveStep(nextStep)
      return
    }
    // Evita que um clique duplo ou rápido no botão "Próximo Passo" envie o formulário acidentalmente no exato segundo em que muda para a última etapa
    if (Date.now() - stepEnteredAt.current < 500) {
      return
    }
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const price = parsePriceBRL(formData.price)
      if (Number.isNaN(price) || price < 0) {
        setError('Informe um preço válido, como 19,90.')
        setActiveStep('preco')
        return
      }
      const rawStock = type === 'product' ? (typeof formData.stockQuantity === 'number' ? formData.stockQuantity : parseInt(String(formData.stockQuantity), 10)) : 0
      const stockQuantity = Number.isNaN(rawStock) ? 0 : Math.max(0, rawStock)

      const newFiles = imageItems.filter((i): i is ImageItem & { kind: 'new' } => i.kind === 'new').map((i) => i.file)
      const coverIndex = imageItems.findIndex((i) => i.isCover)

      if (listing) {
        const payload: UpdateListingRequest = {
          listingCategoryId: formData.listingCategoryId,
          title: formData.title.trim(),
          slug: listing.slug?.trim() || undefined,
          stockQuantity,
          description: formData.description.trim(),
          price,
          currencyCode: formData.currencyCode,
        }
        const updated = await ListingService.update(listing.id, payload)

        for (const delId of deletedImageIds) {
          try {
            await ListingService.deleteImage(delId)
          } catch {
            /* ignora erros de remoção individual */
          }
        }

        if (newFiles.length > 0) {
          const newCoverIndex = imageItems
            .filter((i): i is ImageItem & { kind: 'new' } => i.kind === 'new')
            .findIndex((i) => i.isCover)
          await ListingService.addImages(listing.id, newFiles, newCoverIndex >= 0 ? newCoverIndex : undefined)
        }

        const coverItem = imageItems.find((i) => i.isCover)
        if (coverItem && coverItem.kind === 'existing' && coverItem.id !== 'cover-fallback') {
          try {
            await ListingService.setCoverImage(coverItem.id)
          } catch {
            /* ignora erro se já for a capa */
          }
        }

        setSuccess(true)
        onSaved?.(updated)
        return
      }

      const payload: CreateListingRequest = {
        listingCategoryId: formData.listingCategoryId,
        title: formData.title,
        stockQuantity,
        description: formData.description,
        price,
        currencyCode: formData.currencyCode,
      }
      const created = await ListingService.create(
        payload,
        newFiles.length > 0 ? newFiles : null,
        coverIndex >= 0 ? coverIndex : undefined,
      )
      setSuccess(true)
      setFormData(EMPTY_FORM)
      setImageItems([])
      onSaved?.(created)
    } catch (err) {
      setError(
        resolveApiErrorMessage(
          err,
          {
            ListingNotFound: 'Este anúncio não existe mais.',
            CategoryNotFound: 'A categoria escolhida não está mais disponível.',
            Forbidden: 'Este anúncio não pertence ao seu negócio.',
          },
          `Erro ao ${isEditing ? 'salvar as alterações' : 'criar anúncio'}`,
        ),
      )
    } finally {
      setLoading(false)
    }
  }

  const selectClasses = cn(
    'block w-full h-10 px-3 rounded-lg bg-[var(--color-input)] border border-[var(--color-border-default)] text-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
  )

  const noun = type === 'product' ? 'produto' : 'serviço'
  const coverItem = imageItems.find((img) => img.isCover) ?? imageItems[0] ?? null
  const rawCoverUrl = coverItem
    ? coverItem.kind === 'existing'
      ? coverItem.url
      : coverItem.previewUrl
    : null
  const currentCoverUrl = rawCoverUrl?.trim() ? rawCoverUrl.trim() : null
  const parsedPrice = parsePriceBRL(formData.price)
  const displayPrice = Number.isNaN(parsedPrice) ? 0 : parsedPrice
  const selectedCategory = categories.find((c) => c.id === formData.listingCategoryId)
  const categoryName = selectedCategory?.name ?? (type === 'product' ? 'Produto' : 'Serviço')

  const currentIndex = LISTING_STEP_ORDER.indexOf(activeStep)
  const prevStep = currentIndex > 0 ? LISTING_STEP_ORDER[currentIndex - 1] : null
  const nextStep = currentIndex < LISTING_STEP_ORDER.length - 1 ? LISTING_STEP_ORDER[currentIndex + 1] : null

  // Flags de conclusão das etapas
  const stepDoneMap: Record<ListingStepId, boolean> = {
    dados: Boolean(formData.listingCategoryId && formData.title.trim()),
    preco: Boolean(formData.price.trim() && !Number.isNaN(parsedPrice) && parsedPrice >= 0),
    descricao: Boolean(formData.description.trim()),
    imagem: imageItems.length > 0,
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Stepper Nav (Abas de Etapas) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-[var(--color-surface)] p-2 rounded-2xl border border-[var(--color-border-default)] shadow-xs">
        {LISTING_STEPS.map((step) => {
          const isActive = step.id === activeStep
          const isDone = stepDoneMap[step.id]
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStep(step.id)}
              className={cn(
                'flex items-center gap-2.5 p-3 rounded-xl transition-all cursor-pointer text-left relative',
                isActive
                  ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-bold ring-1 ring-[var(--color-primary)]/30'
                  : 'hover:bg-[var(--color-input)] text-[var(--color-body)]',
              )}
            >
              <div
                className={cn(
                  'size-8 rounded-lg flex items-center justify-center text-sm shrink-0 transition-colors',
                  isActive
                    ? 'bg-[var(--color-primary)] text-white'
                    : isDone
                      ? 'bg-emerald-500/15 text-emerald-600 font-bold'
                      : 'bg-[var(--color-input)] text-[var(--color-muted)]',
                )}
              >
                {isDone ? <i className="ri-checkbox-circle-fill text-base" /> : <i className={step.icon} />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs truncate font-semibold">{step.title}</span>
                <span className="text-[10px] text-[var(--color-muted)] truncate hidden sm:inline">
                  {step.subtitle}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Grid Principal: Formulário Ativo (Esquerda) + Preview ao Vivo (Direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Formulário da Etapa Ativa */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 min-w-0">
          <div className="min-h-[380px]">
            {/* ETAPA 1: DADOS BÁSICOS */}
            {activeStep === 'dados' && (
              <Card padding="lg" className="flex flex-col gap-5 shadow-sm border-[var(--color-border-default)]">
                <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-3">
                  <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                    <i className="ri-file-info-line text-lg" />
                  </div>
                  <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                    1. Informações Básicas & Categoria
                  </h2>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="listingCategoryId" className="text-sm font-semibold text-[var(--color-title)]">
                    Categoria do {noun} <span className="text-[var(--color-danger)]">*</span>
                  </label>
                  <select
                    id="listingCategoryId"
                    name="listingCategoryId"
                    value={formData.listingCategoryId}
                    onChange={handleChange}
                    required
                    disabled={loadingCategories}
                    className={selectClasses}
                  >
                    <option value="">
                      {loadingCategories
                        ? 'Carregando categorias...'
                        : categories.length === 0
                          ? 'Nenhuma categoria disponível'
                          : 'Selecione uma categoria'}
                    </option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  name="title"
                  label={`Título do ${noun} *`}
                  placeholder={`Digite o nome do seu ${noun}`}
                  value={formData.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  hint="Máximo de 100 caracteres. Ex: Marmita Executiva de Carne Assada"
                />
              </Card>
            )}

            {/* ETAPA 2: PREÇO & ESTOQUE */}
            {activeStep === 'preco' && (
              <Card padding="lg" className="flex flex-col gap-5 shadow-sm border-[var(--color-border-default)]">
                <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-3">
                  <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                    <i className="ri-price-tag-3-line text-lg" />
                  </div>
                  <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                    2. Preço e {type === 'product' ? 'Estoque' : 'Disponibilidade'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
                  <Input
                    name="price"
                    label="Preço (R$) *"
                    placeholder="0,00"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="currencyCode" className="text-sm font-semibold text-[var(--color-title)]">
                      Moeda *
                    </label>
                    <select
                      id="currencyCode"
                      name="currencyCode"
                      value={formData.currencyCode}
                      onChange={handleChange}
                      required
                      className={selectClasses}
                    >
                      <option value="BRL">Real (BRL)</option>
                    </select>
                  </div>
                </div>

                {type === 'product' && (
                  <Input
                    type="number"
                    name="stockQuantity"
                    label="Quantidade em Estoque *"
                    placeholder="10"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    min={0}
                    required
                  />
                )}
              </Card>
            )}

            {/* ETAPA 3: DESCRIÇÃO */}
            {activeStep === 'descricao' && (
              <Card padding="lg" className="flex flex-col gap-5 shadow-sm border-[var(--color-border-default)]">
                <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-3">
                  <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                    <i className="ri-align-left text-lg" />
                  </div>
                  <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                    3. Descrição Detalhada
                  </h2>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="description" className="text-sm font-semibold text-[var(--color-title)]">
                    Descrição do {noun} <span className="text-[var(--color-danger)]">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder={`Descreva o ${noun} em detalhes (ingredientes, dimensões, garantias, etc)`}
                    required
                    rows={7}
                    maxLength={1000}
                    className="rounded-xl bg-[var(--color-input)] border border-[var(--color-border-default)] p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent leading-relaxed"
                  />
                  <span className="text-xs text-[var(--color-muted)] text-right">
                    {formData.description.length} / 1000 caracteres
                  </span>
                </div>
              </Card>
            )}

            {/* ETAPA 4: GALERIA DE FOTOS MÚLTIPLAS */}
            {activeStep === 'imagem' && (
              <Card padding="lg" className="flex flex-col gap-5 shadow-sm border-[var(--color-border-default)]">
                <div className="flex items-center justify-between gap-2 border-b border-[var(--color-border-default)] pb-3">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                      <i className="ri-image-line text-lg" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                        4. Galeria de Fotos do Anúncio
                      </h2>
                      <p className="text-xs text-[var(--color-muted)]">
                        Adicione várias fotos e clique na estrela ⭐ para definir a capa principal.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-input)] text-[var(--color-title)] shrink-0">
                    {imageItems.length} {imageItems.length === 1 ? 'foto' : 'fotos'}
                  </span>
                </div>

                {/* Dropzone para Adicionar Novas Fotos */}
                <label
                  htmlFor="images-input"
                  className="relative border-2 border-dashed border-[var(--color-border-default)] hover:border-[var(--color-primary)] rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-[var(--color-input)]/40 hover:bg-[var(--color-primary)]/5 transition-all cursor-pointer group"
                >
                  <input
                    type="file"
                    id="images-input"
                    name="images-input"
                    accept="image/*"
                    multiple
                    onChange={handleAddFiles}
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                      <i className="ri-upload-cloud-2-line text-xl" />
                    </div>
                    <div className="flex flex-col text-left">
                      <strong className="text-sm font-bold text-[var(--color-title)] group-hover:text-[var(--color-primary)] transition-colors">
                        Adicionar Fotos
                      </strong>
                      <span className="text-xs text-[var(--color-muted)]">
                        Você pode selecionar vários arquivos de uma vez
                      </span>
                    </div>
                  </div>
                </label>

                {/* Grade de Fotos Carregadas com Seleção de Capa & Exclusão */}
                {imageItems.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                    {imageItems.map((img) => {
                      const rawUrl = img.kind === 'existing' ? img.url : img.previewUrl
                      const url = rawUrl?.trim() ? rawUrl.trim() : null
                      const isActionLoading = actionLoadingId === img.id

                      return (
                        <div
                          key={img.id}
                          className={cn(
                            'flex flex-col rounded-2xl overflow-hidden border transition-all bg-[var(--color-surface)] shadow-xs',
                            img.isCover
                              ? 'border-amber-400 ring-2 ring-amber-400/20'
                              : 'border-[var(--color-border-default)] hover:border-[var(--color-primary)]/50',
                          )}
                        >
                          {/* Container da Imagem */}
                          <div className="relative aspect-square w-full bg-[var(--color-input)] overflow-hidden">
                            {url ? (
                              <Image
                                src={url}
                                alt="Foto do anúncio"
                                fill
                                sizes="240px"
                                className="object-cover"
                                unoptimized={img.kind === 'new'}
                              />
                            ) : (
                              <div className="size-full flex items-center justify-center text-[var(--color-muted)]">
                                <i className="ri-image-line text-3xl" />
                              </div>
                            )}

                            {/* Badge "CAPA PRINCIPAL" */}
                            {img.isCover && (
                              <span className="absolute top-2 left-2 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 shadow-md border border-amber-300 flex items-center gap-1">
                                <i className="ri-star-fill text-xs" />
                                Capa Principal
                              </span>
                            )}

                            {/* Overlay de carregamento da ação */}
                            {isActionLoading && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white">
                                <i className="ri-loader-4-line text-2xl animate-spin" />
                              </div>
                            )}
                          </div>

                          {/* Rodapé de Ações do Card */}
                          <div className="p-2 bg-[var(--color-input)]/50 border-t border-[var(--color-border-default)] flex items-center justify-between gap-1.5">
                            <button
                              type="button"
                              disabled={img.isCover || isActionLoading}
                              onClick={() => handleSetCover(img.id)}
                              className={cn(
                                'flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                                img.isCover
                                  ? 'bg-amber-400/15 text-amber-700 dark:text-amber-400 cursor-default'
                                  : 'bg-[var(--color-surface)] text-[var(--color-title)] hover:bg-[var(--color-primary)] hover:text-white border border-[var(--color-border-default)] shadow-2xs',
                              )}
                            >
                              <i className={img.isCover ? 'ri-star-fill text-amber-500' : 'ri-star-line'} />
                              {img.isCover ? 'Capa Principal' : 'Definir Capa'}
                            </button>

                            <button
                              type="button"
                              disabled={isActionLoading}
                              onClick={() => handleRemoveImage(img.id)}
                              title="Excluir esta foto"
                              className="size-8 rounded-xl bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 flex items-center justify-center font-bold text-sm shadow-2xs transition-all shrink-0 cursor-pointer active:scale-95"
                            >
                              <i className="ri-delete-bin-line" />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-[var(--color-danger-fg)] text-center font-medium p-3 rounded-xl bg-red-50 border border-red-200">
              <i className="ri-error-warning-line align-middle mr-1 text-base" />
              {error}
            </p>
          )}
          {success && (
            <p role="status" className="text-sm text-[var(--color-success-fg)] text-center font-medium p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <i className="ri-checkbox-circle-line align-middle mr-1 text-base" />
              {isEditing ? 'Alterações salvas com sucesso!' : 'Anúncio criado com sucesso!'}
            </p>
          )}

          {/* Rodapé de Controles do Stepper */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-default)] shadow-xs">
            <Button
              type="button"
              variant="outline"
              disabled={!prevStep}
              onClick={() => prevStep && setActiveStep(prevStep)}
              leftIcon={<i className="ri-arrow-left-line" />}
            >
              Voltar
            </Button>

            <span className="text-xs text-[var(--color-muted)] font-medium hidden sm:inline">
              Etapa {currentIndex + 1} de {LISTING_STEP_ORDER.length}
            </span>

            {nextStep ? (
              <Button
                type="button"
                onClick={() => setActiveStep(nextStep)}
                rightIcon={<i className="ri-arrow-right-line" />}
              >
                Próximo Passo
              </Button>
            ) : (
              <Button
                type="submit"
                isLoading={loading}
                className="shadow-primary font-bold"
                leftIcon={<i className={isEditing ? 'ri-save-line' : 'ri-send-plane-line'} />}
              >
                {isEditing ? 'Salvar alterações' : 'Publicar Anúncio'}
              </Button>
            )}
          </div>
        </form>

        {/* Painel Lateral: Preview em Tempo Real (Coluna Direita Fixa) */}
        <aside className="lg:sticky lg:top-24 flex flex-col gap-5 min-w-0">
          <Card padding="lg" className="flex flex-col gap-4 shadow-md border-[var(--color-border-default)]">
            <div className="flex items-center gap-2 border-b border-[var(--color-border-default)] pb-3">
              <div className="size-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                <i className="ri-eye-line text-lg" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[var(--color-title)] tracking-tight">
                  Prévia ao Vivo
                </h2>
                <p className="text-[11px] text-[var(--color-muted)]">
                  Veja como seu anúncio aparecerá para os clientes.
                </p>
              </div>
            </div>

            {/* Prévia 1: Card no Feed */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[var(--color-title)] uppercase tracking-wide">
                Card no Feed do Bairro
              </span>
              <div className="rounded-xl border border-[var(--color-border-default)] overflow-hidden shadow-xs">
                <ListingCard
                  title={formData.title.trim() || `Novo ${noun}`}
                  price={displayPrice}
                  categoryName={categoryName}
                  thumbnailUrl={currentCoverUrl}
                  distanceMeters={350}
                  href="#"
                />
              </div>
            </div>

            {/* Prévia 2: Mini Detalhes */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border-default)]">
              <span className="text-xs font-bold text-[var(--color-title)] uppercase tracking-wide">
                Detalhes da Publicação
              </span>
              <div className="p-3.5 rounded-xl bg-[var(--color-input)] border border-[var(--color-border-default)] flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-[var(--color-primary)]">
                    {categoryName}
                  </span>
                  {type === 'product' && (
                    <span className="text-[10px] text-[var(--color-muted)] font-medium">
                      Estoque: {formData.stockQuantity !== '' ? formData.stockQuantity : 0} un
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-[var(--color-title)] line-clamp-2">
                  {formData.title.trim() || `Título do seu ${noun}`}
                </h3>

                <div className="text-lg font-black text-[var(--color-primary)]">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayPrice)}
                </div>

                <div className="pt-2 border-t border-[var(--color-border-default)]">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full text-xs py-1.5 bg-[var(--color-whatsapp)]/10 text-[var(--color-whatsapp)] border-[var(--color-whatsapp)]/30 font-semibold cursor-default"
                    leftIcon={<i className="ri-whatsapp-line text-sm" />}
                  >
                    Falar no WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}


