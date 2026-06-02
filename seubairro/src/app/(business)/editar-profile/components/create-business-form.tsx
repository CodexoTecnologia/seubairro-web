'use client'
import { useState } from 'react'
import { BusinessService, type BusinessResponse } from '@/lib/api/services/BusinessService'
import type { CreateBusinessRequest } from '@/lib/api/dtos/Request/index'

interface CreateBusinessFormProps {
    onCreated: (business: BusinessResponse) => void
}

export default function CreateBusinessForm({ onCreated }: CreateBusinessFormProps) {
    const [form, setForm] = useState<CreateBusinessRequest>({
        businessName: '',
        legalName: '',
        taxId: '',
        description: '',
        logoUrl: null,
        coverImageUrl: null,
        publicPhone: '',
        instagramUrl: '',
    })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const update = <K extends keyof CreateBusinessRequest>(key: K, value: CreateBusinessRequest[K]) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.businessName?.trim()) {
            setError('Informe o nome do negócio.')
            return
        }
        try {
            setSaving(true)
            setError(null)
            const created = await BusinessService.create(form)
            onCreated(created)
        } catch (err) {
            console.error('[CreateBusinessForm] Erro:', err)
            setError(err instanceof Error ? err.message : 'Falha ao criar negócio.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="edit-profile-container">
            <header className="edit-header">
                <h1>Crie seu negócio</h1>
                <p>Você ainda não tem um estabelecimento. Preencha os dados abaixo para começar.</p>
            </header>

            <form onSubmit={handleSubmit}>
                <section className="form-section">
                    <div className="section-title">
                        <i className="ri-store-2-line"></i> Identidade do Negócio
                    </div>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nome do Negócio *</label>
                            <input
                                type="text"
                                className="form-input"
                                value={form.businessName ?? ''}
                                onChange={e => update('businessName', e.target.value)}
                                placeholder="Ex: Mercadinho da Vila"
                                required
                            />
                        </div>
                        <div className="form-grid two-col">
                            <div className="form-group">
                                <label>Razão Social</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.legalName ?? ''}
                                    onChange={e => update('legalName', e.target.value)}
                                    placeholder="Nome jurídico (opcional)"
                                />
                            </div>
                            <div className="form-group">
                                <label>CNPJ / CPF</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.taxId ?? ''}
                                    onChange={e => update('taxId', e.target.value)}
                                    placeholder="00.000.000/0000-00"
                                />
                            </div>
                        </div>
                        <div className="form-grid two-col">
                            <div className="form-group">
                                <label>WhatsApp / Telefone Público</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    value={form.publicPhone ?? ''}
                                    onChange={e => update('publicPhone', e.target.value)}
                                    placeholder="(00) 00000-0000"
                                />
                            </div>
                            <div className="form-group">
                                <label>Instagram URL</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={form.instagramUrl ?? ''}
                                    onChange={e => update('instagramUrl', e.target.value)}
                                    placeholder="https://instagram.com/seunegocio"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Sobre o Negócio</label>
                            <textarea
                                className="form-textarea"
                                value={form.description ?? ''}
                                onChange={e => update('description', e.target.value)}
                                placeholder="Descreva o que seu negócio faz..."
                            />
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="alert alert-error" style={{ marginBottom: 16, padding: 12, background: '#fee2e2', color: '#991b1b', borderRadius: 8 }}>
                        {error}
                    </div>
                )}

                <div className="action-bar">
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Criando...' : 'Criar Negócio'}
                    </button>
                </div>
            </form>
        </div>
    )
}
