'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { CategoryService } from '@/lib/api/services/CategoryService'
import { ListingService } from '@/lib/api/services/ListingService'
import type { CreateListingRequest } from '@/lib/api/dtos/Request/index'
import type { CategoryResponse } from '@/lib/api/dtos/Response/index'
import { Button } from '@/design-system/primitives/Button'
import { Input } from '@/design-system/primitives/Input'
import { Card } from '@/design-system/primitives/Card'
import { cn } from '@/lib/utils/cn'

type FormData = {
  listingCategoryId: string
  title: string
  stockQuantity: number
  description: string
  price: string
  currencyCode: string
}

type Props = { type: 'product' | 'service' }

const normalize = <T,>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[]
  if (raw && typeof raw === 'object' && 'data' in raw && Array.isArray((raw as { data: unknown }).data))
    return (raw as { data: T[] }).data
  return []
}

export default function ListingForm({ type }: Props) {
  const [formData, setFormData] = useState<FormData>({
    listingCategoryId: '',
    title: '',
    stockQuantity: 0,
    description: '',
    price: '',
    currencyCode: 'BRL',
  })
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true)
      try {
        const categoryType = type === 'product' ? 1 : 2
        const raw = await CategoryService.getAll()
        const data = normalize<CategoryResponse>(raw)
        const filtered = data.filter((c) => c?.isActive && c?.categoryType === categoryType)
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
      [name]: name === 'stockQuantity' ? parseInt(value) || 0 : value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setImageFile(file)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const payload: CreateListingRequest = {
        listingCategoryId: formData.listingCategoryId,
        title: formData.title,
        stockQuantity: type === 'product' ? formData.stockQuantity : 0,
        description: formData.description,
        price: parseFloat(formData.price.replace(',', '.')),
        currencyCode: formData.currencyCode,
      }
      const images = imageFile ? [imageFile] : null
      await ListingService.create(payload, images)
      setSuccess(true)
      setFormData({
        listingCategoryId: '',
        title: '',
        stockQuantity: 0,
        description: '',
        price: '',
        currencyCode: 'BRL',
      })
      if (imagePreview) URL.revokeObjectURL(imagePreview)
      setImageFile(null)
      setImagePreview(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar anúncio')
    } finally {
      setLoading(false)
    }
  }

  const selectClasses = cn(
    'block w-full h-10 px-3 rounded-lg bg-[var(--color-input)] border border-[var(--color-border-default)] text-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <Card padding="lg" className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
          Informações Básicas
        </h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="listingCategoryId" className="text-sm font-medium text-[var(--color-title)]">
            Categoria <span className="text-[var(--color-danger)]">*</span>
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
          label={`Título do Anúncio *`}
          placeholder={`Digite o nome do ${type === 'product' ? 'produto' : 'serviço'}`}
          value={formData.title}
          onChange={handleChange}
          required
          maxLength={100}
          hint="Máximo de 100 caracteres"
        />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="description" className="text-sm font-medium text-[var(--color-title)]">
            Descrição <span className="text-[var(--color-danger)]">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={`Descreva o ${type === 'product' ? 'produto' : 'serviço'} em detalhes`}
            required
            rows={6}
            maxLength={1000}
            className="rounded-lg bg-[var(--color-input)] border border-[var(--color-border-default)] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          />
          <span className="text-xs text-[var(--color-muted)]">Máximo de 1000 caracteres</span>
        </div>
      </Card>

      <Card padding="lg" className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
          Preço e {type === 'product' ? 'Estoque' : 'Disponibilidade'}
        </h2>
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
            <label htmlFor="currencyCode" className="text-sm font-medium text-[var(--color-title)]">
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
            value={formData.stockQuantity}
            onChange={handleChange}
            min={0}
            required
          />
        )}
      </Card>

      <Card padding="lg" className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
          Imagem
        </h2>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="image" className="text-sm font-medium text-[var(--color-title)]">
            Imagem do {type === 'product' ? 'produto' : 'serviço'}
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-[var(--color-primary)] file:text-white file:font-medium file:cursor-pointer"
          />
          {imagePreview && (
            <div className="relative mt-2 w-56 aspect-square rounded-lg overflow-hidden border border-[var(--color-border-default)]">
              <Image
                src={imagePreview}
                alt="Pré-visualização"
                fill
                sizes="224px"
                className="object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
      </Card>

      {error && (
        <p role="alert" className="text-sm text-[var(--color-danger)] text-center">
          <i className="ri-error-warning-line align-middle mr-1" />
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="text-sm text-[var(--color-success)] text-center">
          <i className="ri-checkbox-circle-line align-middle mr-1" />
          Anúncio criado com sucesso!
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()} leftIcon={<i className="ri-arrow-left-line" />}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={loading} leftIcon={<i className="ri-send-plane-line" />}>
          Publicar Anúncio
        </Button>
      </div>
    </form>
  )
}
