'use client'

import { useState } from 'react'
import { BusinessService, type BusinessResponse } from '@/lib/api/services/BusinessService'
import { Button } from '@/design-system/primitives/Button'
import { Input } from '@/design-system/primitives/Input'
import { Card } from '@/design-system/primitives/Card'

type Props = { initialData: BusinessResponse }

export default function ProfileForm({ initialData }: Props) {
  const [formData, setFormData] = useState<BusinessResponse>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setFeedback(null)
    try {
      await BusinessService.update(initialData.id, formData)
      setFeedback('success')
    } catch (err) {
      console.error('Erro ao salvar:', err)
      setFeedback('error')
    } finally {
      setIsSaving(false)
    }
  }

  const set = (field: keyof BusinessResponse, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  return (
    <Card padding="lg" className="flex flex-col gap-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
            <i className="ri-store-2-line text-base text-[var(--color-primary)]" />
            Identidade do Negócio
          </h2>
          <Input
            label="Nome do Negócio"
            value={formData.businessName || ''}
            onChange={(e) => set('businessName', e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="WhatsApp / Telefone Público"
              type="tel"
              value={formData.publicPhone || ''}
              onChange={(e) => set('publicPhone', e.target.value)}
            />
            <Input
              label="Instagram URL"
              value={formData.instagramUrl || ''}
              onChange={(e) => set('instagramUrl', e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--color-title)]">Sobre o Negócio</label>
            <textarea
              rows={4}
              value={formData.description || ''}
              onChange={(e) => set('description', e.target.value)}
              className="rounded-lg bg-[var(--color-input)] border border-[var(--color-border-default)] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-title)] uppercase tracking-wide">
            <i className="ri-image-line text-base text-[var(--color-primary)]" />
            Aparência
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-1.5 md:w-40 shrink-0">
              <label className="text-sm font-medium text-[var(--color-title)]">Logo</label>
              <div
                className="aspect-square rounded-[var(--radius-card)] bg-[var(--color-input)] border border-dashed border-[var(--color-border-default)] flex items-center justify-center bg-cover bg-center"
                style={formData.logoUrl ? { backgroundImage: `url(${formData.logoUrl})` } : undefined}
              >
                {!formData.logoUrl && (
                  <i className="ri-camera-line text-3xl text-[var(--color-muted)]" />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium text-[var(--color-title)]">Imagem de Capa</label>
              <div
                className="aspect-[3/1] rounded-[var(--radius-card)] bg-[var(--color-input)] border border-dashed border-[var(--color-border-default)] flex items-center justify-center bg-cover bg-center"
                style={
                  formData.coverImageUrl
                    ? { backgroundImage: `url(${formData.coverImageUrl})` }
                    : undefined
                }
              >
                {!formData.coverImageUrl && (
                  <i className="ri-image-add-line text-3xl text-[var(--color-muted)]" />
                )}
              </div>
            </div>
          </div>
        </section>

        {feedback === 'success' && (
          <p role="status" className="text-sm text-[var(--color-success)] text-center">
            Perfil atualizado com sucesso.
          </p>
        )}
        {feedback === 'error' && (
          <p role="alert" className="text-sm text-[var(--color-danger)] text-center">
            Erro ao salvar alterações.
          </p>
        )}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline">
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSaving}>
            Salvar Alterações
          </Button>
        </div>
      </form>
    </Card>
  )
}
