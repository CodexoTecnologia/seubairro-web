'use client'
import React, { useState, useEffect } from 'react'
import { CategoryService } from '@/API/services/CategoryService'
import { ListingService } from '@/API/services/ListingService'
import type { CreateListingRequest } from '@/API/dtos/Request/index'
import type { CategoryResponse } from '@/API/dtos/Response/index'

interface ListingFormData {
    listingCategoryId: string
    title: string
    slug: string
    stockQuantity: number
    description: string
    price: string
    currencyCode: string
}

interface ListingFormProps {
    type: 'product' | 'service'
}

export default function ListingForm({ type }: ListingFormProps) {
    const [formData, setFormData] = useState<ListingFormData>({
        listingCategoryId: '',
        title: '',
        slug: '',
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

    useEffect(() => {
        fetchCategories()
    }, [type])

    const fetchCategories = async () => {
        try {
            setLoadingCategories(true)
            const categoryType = type === 'product' ? 1 : 2

            const rawData = await CategoryService.getAll()
            const data = Array.isArray(rawData) ? rawData : ((rawData as any)?.data || [])

            const filtered: CategoryResponse[] = data.filter((c: any) => c && c.isActive && c.categoryType === categoryType)

            setCategories(filtered)

            setFormData(prev => {
                if (prev.listingCategoryId && !filtered.some(f => f.id === prev.listingCategoryId)) {
                    return { ...prev, listingCategoryId: '' }
                }
                return prev
            })
        } catch (err) {
            setError('Erro ao carregar categorias')
        } finally {
            setLoadingCategories(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'stockQuantity' ? parseInt(value) || 0 : value,
        }))
    }

    const generateSlug = (title: string): string => {
        return title
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '')
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
                slug: generateSlug(formData.title),
                stockQuantity: type === 'product' ? formData.stockQuantity : 0,
                description: formData.description,
                price: parseFloat(formData.price.replace(',', '.')),
                currencyCode: formData.currencyCode,
            }

            await ListingService.create(payload)
            setSuccess(true)
            setFormData({
                listingCategoryId: '',
                title: '',
                slug: '',
                stockQuantity: 0,
                description: '',
                price: '',
                currencyCode: 'BRL',
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao criar anúncio')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="listing-form">
            <div className="form-section">
                <h2>Informações Básicas</h2>

                <div className="form-group">
                    <label htmlFor="listingCategoryId">
                        Categoria <span className="required">*</span>
                    </label>
                    <select
                        id="listingCategoryId"
                        name="listingCategoryId"
                        value={formData.listingCategoryId}
                        onChange={handleChange}
                        required
                        disabled={loadingCategories}
                    >
                        <option value="">
                            {loadingCategories
                                ? 'Carregando categorias...'
                                : categories.length === 0
                                    ? 'Nenhuma categoria disponível'
                                    : 'Selecione uma categoria'}
                        </option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="title">
                        Título do Anúncio <span className="required">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder={`Digite o nome do ${type === 'product' ? 'produto' : 'serviço'}`}
                        required
                        maxLength={100}
                    />
                    <small>Máximo de 100 caracteres</small>
                </div>

                <div className="form-group">
                    <label htmlFor="description">
                        Descrição <span className="required">*</span>
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
                    />
                    <small>Máximo de 1000 caracteres</small>
                </div>
            </div>

            <div className="form-section">
                <h2>Preço e {type === 'product' ? 'Estoque' : 'Disponibilidade'}</h2>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="price">
                            Preço (R$) <span className="required">*</span>
                        </label>
                        <input
                            type="text"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0,00"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="currencyCode">
                            Moeda <span className="required">*</span>
                        </label>
                        <select
                            id="currencyCode"
                            name="currencyCode"
                            value={formData.currencyCode}
                            onChange={handleChange}
                            required
                        >
                            <option value="BRL">Real (BRL)</option>
                        </select>
                    </div>
                </div>

                {type === 'product' && (
                    <div className="form-group">
                        <label htmlFor="stockQuantity">
                            Quantidade em Estoque <span className="required">*</span>
                        </label>
                        <input
                            type="number"
                            id="stockQuantity"
                            name="stockQuantity"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            min="0"
                            required
                        />
                    </div>
                )}
            </div>

            {error && (
                <div className="alert alert-error">
                    <i className="ri-error-warning-line"></i>
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="alert alert-success">
                    <i className="ri-checkbox-circle-line"></i>
                    <span>Anúncio criado com sucesso!</span>
                </div>
            )}

            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => window.history.back()}>
                    <i className="ri-arrow-left-line"></i> Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? (
                        <>
                            <i className="ri-loader-4-line spinning"></i> Publicando...
                        </>
                    ) : (
                        <>
                            <i className="ri-send-plane-line"></i> Publicar Anúncio
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}