'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BusinessService, type BusinessResponse } from '@/lib/api/services/BusinessService'
import { ApiClientError } from '@/lib/api/Client/ApiClientError'
import {
  businessProfileSchema,
  type BusinessProfileFormValues,
} from '@/features/business/schemas'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { Input } from '@/design-system/primitives/Input'
import { cn } from '@/lib/utils/cn'

type Props = {
  business: BusinessResponse
  onUpdated: (updated: BusinessResponse) => void
}

type ServerMsg = { kind: 'success' | 'error'; text: string } | null

const MAX_IMAGE_BYTES = 5 * 1024 * 1024

const ERROR_MESSAGES: Record<string, string> = {
  Forbidden: 'Você não tem permissão para alterar este negócio.',
  BusinessNameRequired: 'O nome do negócio é obrigatório.',
  InvalidPhoneFormat: 'Telefone fora do padrão (8 a 15 dígitos).',
}

function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Selecione um arquivo de imagem.'
  if (file.size > MAX_IMAGE_BYTES) return 'A imagem deve ter no máximo 5 MB.'
  return null
}

export default function BusinessProfileSection({ business, onUpdated }: Props) {
  const [serverMsg, setServerMsg] = useState<ServerMsg>(null)
  const [logoUrl, setLogoUrl] = useState(business.logoUrl)
  const [logoUploading, setLogoUploading] = useState(false)
  const [logoError, setLogoError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [coverUrl, setCoverUrl] = useState(business.coverImageUrl)
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverError, setCoverError] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessProfileFormValues>({
    resolver: zodResolver(businessProfileSchema),
    defaultValues: {
      businessName: business.businessName ?? '',
      legalName: business.legalName ?? '',
      description: business.description ?? '',
      publicPhone: (business.publicPhone ?? '').replace(/\D/g, ''),
      instagramUrl: business.instagramUrl ?? '',
    },
  })

  const submit = handleSubmit(async (values) => {
    setServerMsg(null)
    try {
      const updated = await BusinessService.update(business.id, {
        id: business.id,
        businessName: values.businessName.trim(),
        legalName: values.legalName.trim(),
        description: values.description.trim(),
        publicPhone: values.publicPhone.trim(),
        phoneCountryCode: business.phoneCountryCode ?? null,
        phoneNumber: business.phoneNumber ?? null,
        instagramUrl: values.instagramUrl?.trim() || null,
        logoUrl: business.logoUrl,
        coverImageUrl: business.coverImageUrl,
      })
      onUpdated(updated)
      setServerMsg({ kind: 'success', text: 'Dados da empresa salvos com sucesso!' })
    } catch (err) {
      const text =
        err instanceof ApiClientError && ERROR_MESSAGES[err.code]
          ? ERROR_MESSAGES[err.code]
          : 'Erro ao salvar os dados. Tente novamente.'
      setServerMsg({ kind: 'error', text })
    }
  })

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const invalid = validateImageFile(file)
    if (invalid) {
      setLogoError(invalid)
      return
    }
    setLogoUploading(true)
    setLogoError(null)
    try {
      const updated = await BusinessService.uploadLogo(business.id, file)
      setLogoUrl(updated.logoUrl)
      onUpdated(updated)
    } catch (err) {
      const text =
        err instanceof ApiClientError && ERROR_MESSAGES[err.code]
          ? ERROR_MESSAGES[err.code]
          : 'Erro ao enviar o logo.'
      setLogoError(text)
    } finally {
      setLogoUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const invalid = validateImageFile(file)
    if (invalid) {
      setCoverError(invalid)
      return
    }
    setCoverUploading(true)
    setCoverError(null)
    try {
      const updated = await BusinessService.uploadCover(business.id, file)
      setCoverUrl(updated.coverImageUrl)
      onUpdated(updated)
    } catch (err) {
      const text =
        err instanceof ApiClientError && ERROR_MESSAGES[err.code]
          ? ERROR_MESSAGES[err.code]
          : 'Erro ao enviar a capa.'
      setCoverError(text)
    } finally {
      setCoverUploading(false)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

  return (
    <Card padding="lg" className="flex flex-col gap-6">
      {/* Cabeçalho explicativo de edição */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-default)] pb-4">
        <div className="flex items-center gap-2">
          <span className="size-9 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
            <i className="ri-store-2-line text-lg" aria-hidden />
          </span>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-[var(--color-title)]">
              Dados &amp; Identidade Visual
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              Personalize como sua marca é exibida aos clientes da região.
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-3 py-1 rounded-full border border-[var(--color-primary)]/20">
          <i className="ri-pencil-line" /> Modo Edição Ativo
        </span>
      </header>

      {/* 1. Uploader de Capa / Banner (Interativo por Clique & Hover) */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-[var(--color-title)] flex items-center gap-1.5">
            <i className="ri-image-line text-[var(--color-primary)]" /> Capa do Perfil
          </label>
          <span className="text-xs text-[var(--color-muted)]">Formato recomendado 3:1 (até 5MB)</span>
        </div>

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverChange}
          className="sr-only"
          id="cover-upload"
          aria-label="Enviar capa do perfil da empresa"
        />

        {/* Dropzone Interativa da Capa */}
        <div
          onClick={() => coverInputRef.current?.click()}
          tabIndex={0}
          role="button"
          onKeyDown={(e) => e.key === 'Enter' && coverInputRef.current?.click()}
          aria-label="Clique para alterar a capa do perfil"
          className={cn(
            'group relative aspect-[3/1] rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer select-none',
            coverUrl
              ? 'border-[var(--color-border-default)] hover:border-[var(--color-primary)] shadow-xs'
              : 'border-[var(--color-primary)]/40 hover:border-[var(--color-primary)] bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-primary)]/10',
          )}
        >
          {coverUrl ? (
            <>
              <Image
                src={coverUrl}
                alt="Capa do perfil da empresa"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 896px) 100vw, 832px"
              />
              {/* Overlay Interativo no Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-xs">
                <span className="size-11 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-md">
                  <i className="ri-camera-fill text-xl" />
                </span>
                <span className="text-sm font-semibold">Clique para alterar a capa</span>
                <span className="text-xs text-white/80">Recomendado: 1200x400 (3:1)</span>
              </div>

              {/* Tag Flutuante Permanente no Canto */}
              <div className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition-all shadow-md">
                <i className="ri-pencil-fill text-xs" /> Trocar Imagem de Capa
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <span className="size-12 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="ri-image-add-line text-2xl" />
              </span>
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-[var(--color-title)]">
                  Clique aqui para adicionar a capa do perfil
                </span>
                <span className="text-xs text-[var(--color-muted)]">
                  Exibida em destaque no topo da sua página pública
                </span>
              </div>
              <span className="mt-1 px-4 py-1.5 rounded-full bg-[var(--color-primary)] text-white text-xs font-semibold shadow-xs group-hover:bg-[var(--color-primary-hover)] transition-colors flex items-center gap-1">
                <i className="ri-upload-2-line" /> Selecionar Imagem
              </span>
            </div>
          )}

          {/* Loader de Upload */}
          {coverUploading && (
            <div className="absolute inset-0 bg-black/70 text-white flex flex-col items-center justify-center gap-2 z-10 backdrop-blur-xs">
              <i className="ri-loader-4-line text-3xl animate-spin" />
              <span className="text-sm font-medium">Enviando capa...</span>
            </div>
          )}
        </div>

        {coverError && (
          <p role="alert" className="text-xs font-medium text-[var(--color-danger)] flex items-center gap-1">
            <i className="ri-error-warning-line" /> {coverError}
          </p>
        )}
      </div>

      {/* 2. Logo & Formulário de Dados */}
      <div className="flex flex-col lg:flex-row gap-8 pt-2">
        {/* Container do Logo (Interativo) */}
        <div className="flex flex-col items-center lg:items-start gap-2 shrink-0">
          <label className="text-sm font-semibold text-[var(--color-title)] flex items-center gap-1.5">
            <i className="ri-camera-3-line text-[var(--color-primary)]" /> Logo da Empresa
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="sr-only"
            id="logo-upload"
            aria-label="Enviar logo da empresa"
          />

          {/* Container Circular/Quadrado Interativo do Logo */}
          <div
            onClick={() => fileInputRef.current?.click()}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            aria-label="Clique para alterar a logo da empresa"
            className={cn(
              'group relative size-36 md:size-40 rounded-2xl overflow-hidden border-2 border-dashed transition-all cursor-pointer select-none bg-[var(--color-input)] shadow-xs',
              logoUrl
                ? 'border-[var(--color-border-default)] hover:border-[var(--color-primary)]'
                : 'border-[var(--color-primary)]/40 hover:border-[var(--color-primary)] bg-[var(--color-primary)]/5',
            )}
          >
            {logoUrl ? (
              <>
                <Image
                  src={logoUrl}
                  alt="Logo da empresa"
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="160px"
                />
                {/* Overlay de Hover no Logo */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-center p-2 backdrop-blur-xs">
                  <i className="ri-camera-line text-2xl" />
                  <span className="text-xs font-semibold mt-1">Alterar Logo</span>
                </div>

                {/* Badge de Edição no Canto */}
                <span className="absolute bottom-2 right-2 size-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <i className="ri-pencil-fill text-xs" />
                </span>
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center gap-1.5">
                <span className="size-10 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className="ri-camera-add-line text-xl" />
                </span>
                <span className="text-xs font-semibold text-[var(--color-title)]">Enviar Logo</span>
                <span className="text-[10px] text-[var(--color-muted)]">Clique para escolher</span>
              </div>
            )}

            {/* Loader de Upload do Logo */}
            {logoUploading && (
              <div className="absolute inset-0 bg-black/70 text-white flex flex-col items-center justify-center gap-1 z-10 backdrop-blur-xs">
                <i className="ri-loader-4-line text-2xl animate-spin" />
                <span className="text-xs">Enviando...</span>
              </div>
            )}
          </div>

          <span className="text-[11px] text-[var(--color-muted)] text-center lg:text-left max-w-[160px]">
            Recomendado: formato quadrado (1:1), até 5MB.
          </span>

          {logoError && (
            <p role="alert" className="text-xs font-medium text-[var(--color-danger)] max-w-[160px]">
              {logoError}
            </p>
          )}
        </div>

        {/* Formulário com Sinalização de Edição Clara */}
        <form onSubmit={submit} className="flex flex-col gap-4 flex-1" noValidate>
          <Input
            label="Nome do Negócio"
            placeholder="Ex: Padaria & Confeitaria Central"
            leftIcon={<i className="ri-store-2-line" />}
            error={errors.businessName?.message}
            {...register('businessName')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Razão Social"
              placeholder="Razão Social completa"
              leftIcon={<i className="ri-building-line" />}
              error={errors.legalName?.message}
              {...register('legalName')}
            />
            <Input
              label="CNPJ / CPF"
              value={business.taxId ?? '—'}
              leftIcon={<i className="ri-id-card-line" />}
              rightElement={
                <span className="text-xs font-medium text-[var(--color-muted)] flex items-center gap-1 bg-[var(--color-page)] px-2 py-0.5 rounded-md border border-[var(--color-border-default)]">
                  <i className="ri-lock-2-line" /> Fixo
                </span>
              }
              readOnly
              disabled
              hint="Documento cadastrado não editável por aqui"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="WhatsApp / Telefone Público"
              type="tel"
              inputMode="numeric"
              placeholder="11999999999"
              leftIcon={<i className="ri-whatsapp-line text-[var(--color-success)]" />}
              error={errors.publicPhone?.message}
              {...register('publicPhone')}
            />
            <Input
              label="Instagram (URL)"
              placeholder="https://instagram.com/sualoja"
              leftIcon={<i className="ri-instagram-line" />}
              error={errors.instagramUrl?.message}
              {...register('instagramUrl')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="business-description"
                className="text-sm font-medium text-[var(--color-title)] flex items-center gap-1.5"
              >
                <i className="ri-file-text-line text-[var(--color-primary)]" /> Sobre o Negócio
              </label>
              <span className="text-xs text-[var(--color-muted)]">Escreva o que sua empresa oferece</span>
            </div>
            <textarea
              id="business-description"
              rows={4}
              placeholder="Descreva a história, os principais produtos ou diferenciais do seu negócio..."
              className={cn(
                'rounded-xl bg-[var(--color-input)] border border-[var(--color-border-default)] p-3 text-sm transition-all',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent focus:bg-[var(--color-surface)]',
                errors.description && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
              )}
              {...register('description')}
            />
            {errors.description && (
              <span className="text-xs text-[var(--color-danger)] flex items-center gap-1">
                <i className="ri-error-warning-line" /> {errors.description.message}
              </span>
            )}
          </div>

          {serverMsg && (
            <div
              role={serverMsg.kind === 'error' ? 'alert' : 'status'}
              aria-live="polite"
              className={cn(
                'p-3 rounded-xl text-sm font-medium flex items-center gap-2',
                serverMsg.kind === 'error'
                  ? 'bg-[var(--color-danger-bg)] text-[var(--color-danger)] border border-[var(--color-danger)]/30'
                  : 'bg-[var(--color-success-bg)] text-[var(--color-success)] border border-[var(--color-success)]/30',
              )}
            >
              <i
                className={
                  serverMsg.kind === 'error' ? 'ri-error-warning-fill' : 'ri-checkbox-circle-fill'
                }
              />
              {serverMsg.text}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting}
              leftIcon={<i className="ri-save-line" />}
              size="md"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
