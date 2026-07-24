'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BusinessAddressService } from '@/lib/api/services/BusinessAddressService'
import { ApiClientError } from '@/lib/api/Client/ApiClientError'
import type { BusinessAddressResponse } from '@/lib/api/dtos/Response/index'
import { CountryCodeEnum } from '@/lib/api/enums/index/index'
import {
  businessAddressSchema,
  type BusinessAddressFormValues,
} from '@/features/business/schemas'
import { useCepLookup } from '@/features/client/hooks/useCepLookup'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { Input } from '@/design-system/primitives/Input'
import { cn } from '@/lib/utils/cn'

type Props = {
  businessId: string
  address: BusinessAddressResponse | null
  onSaved: (updated: BusinessAddressResponse) => void
}

type ServerMsg = { kind: 'success' | 'error'; text: string } | null

const ERROR_MESSAGES: Record<string, string> = {
  AddressAlreadyExists: 'Este negócio já tem endereço — recarregue a página e edite.',
  AddressNotFound: 'Endereço ainda não existe — recarregue a página e cadastre.',
  Forbidden: 'Você não tem permissão para alterar o endereço deste negócio.',
}

export default function BusinessAddressSection({ businessId, address, onSaved }: Props) {
  const isEditing = address != null
  const [serverMsg, setServerMsg] = useState<ServerMsg>(null)

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<BusinessAddressFormValues>({
    resolver: zodResolver(businessAddressSchema),
    defaultValues: {
      postalCode: address?.postalCode ?? '',
      street: address?.street ?? '',
      number: address?.number ?? '',
      neighborhood: address?.neighborhood ?? '',
      city: address?.city ?? '',
      stateProvince: address?.stateProvince ?? '',
    },
  })

  const { lookup, isLoading: cepLoading, error: cepError } = useCepLookup()
  const lastLookedUpCep = useRef<string | null>(null)

  const fillFromCep = async (rawCep: string) => {
    const cep = rawCep.replace(/\D/g, '')
    if (cep.length !== 8 || cep === lastLookedUpCep.current) return
    lastLookedUpCep.current = cep
    const found = await lookup(cep)
    if (!found) {
      lastLookedUpCep.current = null
      return
    }
    const opts = { shouldValidate: true, shouldDirty: true } as const
    setValue('city', found.city, opts)
    setValue('stateProvince', found.stateProvince, opts)
    if (found.street) setValue('street', found.street, opts)
    if (found.neighborhood) setValue('neighborhood', found.neighborhood, opts)
    setFocus('number')
  }

  const postalCodeReg = register('postalCode')

  const submit = handleSubmit(async (values) => {
    setServerMsg(null)
    const payload = {
      street: values.street.trim(),
      number: values.number.trim(),
      neighborhood: values.neighborhood.trim(),
      city: values.city.trim(),
      stateProvince: values.stateProvince.trim().toUpperCase(),
      postalCode: values.postalCode.trim(),
      countryCode: CountryCodeEnum.Brasil,
    }
    try {
      const saved = isEditing
        ? await BusinessAddressService.update(businessId, payload)
        : await BusinessAddressService.create(businessId, payload)
      onSaved(saved)
      const located = saved.latitude != null && saved.longitude != null
      setServerMsg({
        kind: 'success',
        text: located
          ? 'Endereço salvo com sucesso! Sua loja já está visível na busca por proximidade.'
          : 'Endereço salvo com sucesso!',
      })
    } catch (err) {
      const text =
        err instanceof ApiClientError && ERROR_MESSAGES[err.code]
          ? ERROR_MESSAGES[err.code]
          : 'Erro ao salvar o endereço. Tente novamente.'
      setServerMsg({ kind: 'error', text })
    }
  })

  return (
    <Card padding="lg" className="flex flex-col gap-6">
      {/* Cabeçalho */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-default)] pb-4">
        <div className="flex items-center gap-2">
          <span className="size-9 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
            <i className="ri-map-pin-2-line text-lg" aria-hidden />
          </span>
          <div className="flex flex-col">
            <h2 className="text-base font-semibold text-[var(--color-title)]">
              Endereço da Empresa
            </h2>
            <p className="text-xs text-[var(--color-muted)]">
              O endereço permite que clientes encontrem sua loja no mapa e filtros do bairro.
            </p>
          </div>
        </div>

        <span
          className={cn(
            'inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border',
            isEditing
              ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20'
              : 'text-[var(--color-warning)] bg-[var(--color-warning-bg)] border-[var(--color-warning)]/30',
          )}
        >
          <i className={isEditing ? 'ri-map-pin-user-line' : 'ri-alert-line'} />
          {isEditing ? 'Endereço Cadastrado' : 'Pendente de Cadastro'}
        </span>
      </header>

      {!isEditing && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--color-warning-bg)] border border-[var(--color-warning)]/30 text-sm">
          <i className="ri-error-warning-fill text-lg text-[var(--color-warning)] shrink-0 mt-0.5" />
          <p className="text-[var(--color-body)] leading-relaxed">
            Sua empresa ainda <strong>não possui endereço cadastrado</strong>. Enquanto o endereço não for informado, seu estabelecimento <strong>não aparecerá na busca por proximidade</strong> dos clientes.
          </p>
        </div>
      )}

      <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="CEP"
            placeholder="00000000"
            inputMode="numeric"
            maxLength={8}
            autoComplete="postal-code"
            leftIcon={<i className="ri-map-pin-line" />}
            hint={cepLoading ? 'Buscando CEP no Correios…' : 'Preenchimento automático do endereço'}
            error={errors.postalCode?.message ?? cepError ?? undefined}
            rightElement={
              cepLoading ? (
                <i className="ri-loader-4-line animate-spin text-[var(--color-muted)]" aria-hidden />
              ) : undefined
            }
            {...postalCodeReg}
            onChange={(e) => {
              postalCodeReg.onChange(e)
              void fillFromCep(e.target.value)
            }}
            onBlur={(e) => {
              postalCodeReg.onBlur(e)
              void fillFromCep(e.target.value)
            }}
          />
          <Input
            label="Cidade"
            placeholder="Nome da Cidade"
            leftIcon={<i className="ri-building-2-line" />}
            className="md:col-span-2"
            error={errors.city?.message}
            {...register('city')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Rua / Logradouro"
            placeholder="Ex: Av. Paulista"
            leftIcon={<i className="ri-road-map-line" />}
            className="md:col-span-3"
            error={errors.street?.message}
            {...register('street')}
          />
          <Input
            label="Número"
            placeholder="123"
            leftIcon={<i className="ri-hashtag" />}
            error={errors.number?.message}
            {...register('number')}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Bairro"
            placeholder="Nome do Bairro"
            leftIcon={<i className="ri-community-line" />}
            className="md:col-span-2"
            error={errors.neighborhood?.message}
            {...register('neighborhood')}
          />
          <Input
            label="Estado (UF)"
            maxLength={2}
            placeholder="SP"
            leftIcon={<i className="ri-government-line" />}
            error={errors.stateProvince?.message}
            {...register('stateProvince')}
          />
        </div>

        {serverMsg && (
          <div
            role={serverMsg.kind === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            className={cn(
              'p-3.5 rounded-xl text-sm font-medium flex items-center gap-2',
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
          >
            {isEditing ? 'Atualizar Endereço' : 'Salvar Endereço'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
