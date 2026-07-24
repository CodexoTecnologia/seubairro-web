'use client'

import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/design-system/primitives/Input'
import { Button } from '@/design-system/primitives/Button'
import {
  customerAddressSchema,
  type CustomerAddressFormValues,
} from '@/features/client/schemas/customer-address.schema'
import { useCepLookup } from '@/features/client/hooks/useCepLookup'
import type { PrimaryAddressInfo } from '@/lib/api/dtos/Response/index'
import { cn } from '@/lib/utils/cn'

type Props = {
  address: PrimaryAddressInfo | null
  onSave: (values: CustomerAddressFormValues) => Promise<PrimaryAddressInfo>
}

type ServerMsg = { kind: 'success' | 'error'; text: string } | null

export function CustomerAddressForm({ address, onSave }: Props) {
  const [serverMsg, setServerMsg] = useState<ServerMsg>(null)

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CustomerAddressFormValues>({
    resolver: zodResolver(customerAddressSchema),
    defaultValues: {
      postalCode: address?.postalCode ?? '',
      street: address?.street ?? '',
      number: address?.number ?? '',
      complement: address?.complement ?? '',
      neighborhood: address?.neighborhood ?? '',
      city: address?.city ?? '',
      stateProvince: address?.stateProvince ?? '',
    },
  })

  const { lookup, isLoading: cepLoading, error: cepError } = useCepLookup()
  const lastLookedUpCep = useRef<string | null>(null)

  // Consulta o CEP e preenche cidade/UF (e rua/bairro quando o ViaCEP os traz).
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
    try {
      const updated = await onSave(values)
      const located = updated.latitude != null && updated.longitude != null
      setServerMsg({
        kind: 'success',
        text: located
          ? 'Endereço salvo! Sua localização padrão foi atualizada.'
          : 'Endereço salvo!',
      })
    } catch (err) {
      setServerMsg({ kind: 'error', text: err instanceof Error ? err.message : 'Erro ao salvar o endereço.' })
    }
  })

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="CEP"
          placeholder="00000000"
          inputMode="numeric"
          maxLength={8}
          autoComplete="postal-code"
          hint={cepLoading ? 'Buscando endereço…' : 'Preenchemos o endereço automaticamente'}
          error={errors.postalCode?.message ?? cepError ?? undefined}
          rightElement={
            cepLoading ? (
              <i
                className="ri-loader-4-line animate-spin text-[var(--color-muted)]"
                aria-hidden="true"
              />
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
        <Input label="Cidade" className="md:col-span-2" error={errors.city?.message} {...register('city')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input label="Rua" className="md:col-span-3" error={errors.street?.message} {...register('street')} />
        <Input label="Número" error={errors.number?.message} {...register('number')} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Bairro"
          className="md:col-span-2"
          error={errors.neighborhood?.message}
          {...register('neighborhood')}
        />
        <Input
          label="Estado (UF)"
          maxLength={2}
          placeholder="PR"
          error={errors.stateProvince?.message}
          {...register('stateProvince')}
        />
      </div>

      <Input label="Complemento (opcional)" error={errors.complement?.message} {...register('complement')} />

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
          Atualizar Endereço
        </Button>
      </div>
    </form>
  )
}
