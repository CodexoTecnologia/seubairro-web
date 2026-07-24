'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Avatar } from '@/design-system/primitives/Avatar'
import { Input } from '@/design-system/primitives/Input'
import { Button } from '@/design-system/primitives/Button'
import {
  customerProfileSchema,
  type CustomerProfileFormValues,
} from '@/features/client/schemas/customer-profile.schema'
import { customerAvatarSchema } from '@/features/client/schemas/customer-avatar.schema'
import type { CustomerProfileResponse } from '@/lib/api/dtos/Response/index'
import { cn } from '@/lib/utils/cn'

type Props = {
  profile: CustomerProfileResponse
  onSubmit: (values: CustomerProfileFormValues) => Promise<unknown>
  onUploadAvatar: (file: File) => Promise<unknown>
}

type ServerMsg = { kind: 'success' | 'error'; text: string } | null

export function CustomerProfileForm({ profile, onSubmit, onUploadAvatar }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [serverMsg, setServerMsg] = useState<ServerMsg>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerProfileFormValues>({
    resolver: zodResolver(customerProfileSchema),
    defaultValues: {
      firstName: profile.firstName ?? '',
      lastName: profile.lastName ?? '',
      phoneCountryCode: profile.phoneCountryCode ?? '',
      phoneNumber: profile.phoneNumber ?? '',
    },
  })

  const submit = handleSubmit(async (values) => {
    setServerMsg(null)
    try {
      await onSubmit(values)
      setServerMsg({ kind: 'success', text: 'Perfil atualizado com sucesso!' })
    } catch (err) {
      setServerMsg({ kind: 'error', text: err instanceof Error ? err.message : 'Erro ao salvar o perfil.' })
    }
  })

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarError(null)
    setServerMsg(null)
    const parsed = customerAvatarSchema.safeParse(file)
    if (!parsed.success) {
      setAvatarError(parsed.error.issues[0]?.message ?? 'Arquivo inválido')
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      await onUploadAvatar(file)
      setServerMsg({ kind: 'success', text: 'Foto de perfil atualizada com sucesso!' })
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Erro ao enviar a foto.')
    } finally {
      setUploading(false)
    }
  }

  const initials =
    `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase() || '?'
  const avatarSrc = preview ?? profile.profilePictureUrl ?? undefined

  return (
    <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
      <div className="flex items-center gap-4">
        <Avatar
          src={avatarSrc}
          alt={`Foto de ${profile.firstName} ${profile.lastName}`}
          fallback={initials}
          size="xl"
        />
        <div className="flex flex-col gap-1.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            isLoading={uploading}
            onClick={() => fileInputRef.current?.click()}
            leftIcon={<i className="ri-camera-line" />}
          >
            Alterar foto
          </Button>
          {avatarError ? (
            <span role="alert" className="text-xs text-[var(--color-danger)]">
              {avatarError}
            </span>
          ) : (
            <span className="text-xs text-[var(--color-muted)]">JPG, PNG ou WebP até 5 MB</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nome" error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Sobrenome" error={errors.lastName?.message} {...register('lastName')} />
      </div>

      <fieldset className="grid grid-cols-[90px_1fr] gap-4">
        <Input
          label="DDI"
          placeholder="55"
          inputMode="numeric"
          error={errors.phoneCountryCode?.message}
          {...register('phoneCountryCode')}
        />
        <Input
          label="Número (WhatsApp)"
          placeholder="11999998888"
          inputMode="numeric"
          hint="Apenas dígitos, sem máscara"
          error={errors.phoneNumber?.message}
          {...register('phoneNumber')}
        />
      </fieldset>

      {serverMsg && (
        <p
          role={serverMsg.kind === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={cn(
            'text-sm',
            serverMsg.kind === 'error' ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]',
          )}
        >
          {serverMsg.text}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" isLoading={isSubmitting}>
          Salvar alterações
        </Button>
      </div>
    </form>
  )
}
