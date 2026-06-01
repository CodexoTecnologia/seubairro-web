'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserService } from '@/lib/api/services/UserService'
import { authService } from '@/lib/api/services/(Auth)/AuthInstance'
import type { CreateEntrepeneurRequest } from '@/lib/api/dtos/Request/business/CreateEntrepeneurRequest'
import { CountryCodeEnum } from '@/lib/api/enums/CountryCodeEnum'
import {
  BusinessSignupSchema,
  type BusinessSignupInput,
} from '@/features/auth/schemas'
import { Input } from '@/design-system/primitives/Input'
import { Select } from '@/design-system/primitives/Select'
import { Button } from '@/design-system/primitives/Button'
import { cn } from '@/lib/utils/cn'

type Step = 1 | 2 | 3

const STEP_FIELDS: Record<Step, (keyof BusinessSignupInput)[]> = {
  1: ['fullName', 'email', 'birthDate', 'cpf', 'password'],
  2: ['businessName', 'cnpj', 'description', 'category', 'whatsapp'],
  3: ['postalCode', 'street', 'number', 'neighborhood', 'city', 'stateProvince'],
}

const STEP_LABELS: Record<Step, string> = {
  1: '1. Dados Pessoais',
  2: '2. Seu Negócio',
  3: '3. Endereço',
}

const onlyDigits = (s: string) => s.replace(/\D/g, '')

export const BusinessForm: React.FC = () => {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const form = useForm<BusinessSignupInput>({
    resolver: zodResolver(BusinessSignupSchema),
    mode: 'onTouched',
    defaultValues: {
      fullName: '',
      email: '',
      birthDate: '',
      cpf: '',
      password: '',
      businessName: '',
      cnpj: '',
      description: '',
      category: '',
      whatsapp: '',
      postalCode: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      stateProvince: '',
    },
  })

  const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = form

  const goNext = async () => {
    const ok = await trigger(STEP_FIELDS[step])
    if (!ok) return
    setStep((prev) => (prev === 3 ? 3 : ((prev + 1) as Step)))
  }

  const goBack = () => setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as Step)))

  const onSubmit = handleSubmit(async (data) => {
    setServerError('')
    const nameParts = data.fullName.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || null

    const request: CreateEntrepeneurRequest = {
      firstName: firstName || null,
      lastName,
      email: data.email,
      password: data.password,
      birthDate: data.birthDate,
      taxId: onlyDigits(data.cpf),
      business: {
        businessName: data.businessName,
        legalName: data.businessName,
        taxId: onlyDigits(data.cnpj),
        description: data.description,
        logoUrl: null,
        coverImageUrl: null,
        publicPhone: onlyDigits(data.whatsapp),
        instagramUrl: null,
      },
      businessAddress: {
        postalCode: onlyDigits(data.postalCode),
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        stateProvince: data.stateProvince,
        countryCode: CountryCodeEnum.Brasil,
      },
    }

    try {
      await UserService.registerEntrepeneur(request)
      // TODO: vincular `data.category` via BusinessNicheService após o cadastro
      // (o endpoint /Auth/entrepeneur ainda não aceita categoria no payload).
      await authService.login({ email: data.email, password: data.password })
      router.push('/choose-profile')
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Erro ao criar conta. Verifique os dados.',
      )
    }
  })

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full" noValidate>
      <ol
        role="list"
        aria-label="Etapas do cadastro"
        className="flex items-center gap-2 text-xs text-[var(--color-muted)]"
      >
        {([1, 2, 3] as Step[]).map((s, i) => (
          <li key={s} className="flex items-center gap-2 flex-1">
            <span
              aria-current={step === s ? 'step' : undefined}
              className={cn(
                'px-2 py-1 rounded-full font-medium whitespace-nowrap',
                step === s
                  ? 'bg-[var(--color-primary)] text-white'
                  : step > s
                    ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
                    : 'bg-[var(--color-page)] text-[var(--color-body)]',
              )}
            >
              {STEP_LABELS[s]}
            </span>
            {i < 2 && <span aria-hidden className="flex-1 h-px bg-[var(--color-border-default)]" />}
          </li>
        ))}
      </ol>

      {step === 1 && (
        <>
          <Input
            label="Nome do Responsável"
            placeholder="Seu nome completo"
            autoComplete="name"
            leftIcon={<i className="ri-user-line" aria-hidden />}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            label="E-mail de Acesso"
            type="email"
            placeholder="email@negocio.com"
            autoComplete="email"
            leftIcon={<i className="ri-mail-line" aria-hidden />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="CPF"
            inputMode="numeric"
            placeholder="000.000.000-00"
            autoComplete="off"
            leftIcon={<i className="ri-id-card-line" aria-hidden />}
            error={errors.cpf?.message}
            {...register('cpf')}
          />
          <Input
            label="Data de Nascimento"
            type="date"
            leftIcon={<i className="ri-calendar-line" aria-hidden />}
            error={errors.birthDate?.message}
            {...register('birthDate')}
          />
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha segura"
            autoComplete="new-password"
            leftIcon={<i className="ri-lock-line" aria-hidden />}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="size-8 flex items-center justify-center rounded-md text-[var(--color-muted)] hover:text-[var(--color-body)] hover:bg-[var(--color-page)] transition-colors"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <i className={showPassword ? 'ri-eye-line' : 'ri-eye-off-line'} aria-hidden />
              </button>
            }
            error={errors.password?.message}
            {...register('password')}
          />
          <Button
            type="button"
            onClick={goNext}
            fullWidth
            rightIcon={<i className="ri-arrow-right-line" aria-hidden />}
          >
            Continuar
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <Input
            label="Nome do Negócio"
            placeholder="Ex: Mercado do João"
            leftIcon={<i className="ri-store-2-line" aria-hidden />}
            error={errors.businessName?.message}
            {...register('businessName')}
          />
          <Input
            label="CNPJ"
            inputMode="numeric"
            placeholder="00.000.000/0000-00"
            autoComplete="off"
            leftIcon={<i className="ri-bank-card-line" aria-hidden />}
            error={errors.cnpj?.message}
            {...register('cnpj')}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="bz-description" className="text-sm font-medium text-[var(--color-title)]">
              Descrição do negócio
            </label>
            <textarea
              id="bz-description"
              rows={3}
              maxLength={500}
              placeholder="Conte em poucas palavras o que seu negócio oferece."
              aria-invalid={errors.description ? 'true' : undefined}
              aria-describedby={errors.description ? 'bz-description-error' : undefined}
              className={cn(
                'block w-full rounded-lg border bg-[var(--color-input)] text-[var(--color-title)] px-3 py-2',
                'placeholder:text-[var(--color-muted)] text-base md:text-sm transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
                errors.description
                  ? 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]'
                  : 'border-[var(--color-border-default)]',
              )}
              {...register('description')}
            />
            {errors.description && (
              <span id="bz-description-error" className="text-xs text-[var(--color-danger)]">
                {errors.description.message}
              </span>
            )}
          </div>
          <Select
            label="Categoria principal"
            leftIcon={<i className="ri-layout-grid-line" aria-hidden />}
            error={errors.category?.message}
            {...register('category')}
          >
            <option value="">Selecione uma categoria</option>
            <option value="alimentacao">Alimentação</option>
            <option value="servicos">Serviços</option>
            <option value="varejo">Varejo</option>
          </Select>
          <Input
            label="WhatsApp"
            type="tel"
            placeholder="(41) 99999-9999"
            autoComplete="tel"
            leftIcon={<i className="ri-whatsapp-line" aria-hidden />}
            error={errors.whatsapp?.message}
            {...register('whatsapp')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" onClick={goBack}>
              Voltar
            </Button>
            <Button
              type="button"
              onClick={goNext}
              rightIcon={<i className="ri-arrow-right-line" aria-hidden />}
            >
              Continuar
            </Button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <Input
            label="CEP"
            inputMode="numeric"
            placeholder="00000-000"
            autoComplete="postal-code"
            leftIcon={<i className="ri-map-pin-line" aria-hidden />}
            error={errors.postalCode?.message}
            {...register('postalCode')}
          />
          <Input
            label="Rua"
            placeholder="Nome da rua"
            autoComplete="address-line1"
            leftIcon={<i className="ri-road-map-line" aria-hidden />}
            error={errors.street?.message}
            {...register('street')}
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="Número"
              inputMode="numeric"
              placeholder="123"
              autoComplete="address-line2"
              error={errors.number?.message}
              {...register('number')}
            />
            <div className="col-span-2">
              <Input
                label="Bairro"
                placeholder="Centro"
                autoComplete="address-level3"
                error={errors.neighborhood?.message}
                {...register('neighborhood')}
              />
            </div>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-3">
            <Input
              label="Cidade"
              placeholder="Sua cidade"
              autoComplete="address-level2"
              error={errors.city?.message}
              {...register('city')}
            />
            <Input
              label="UF"
              placeholder="PR"
              autoComplete="address-level1"
              maxLength={2}
              className="w-20 uppercase"
              error={errors.stateProvince?.message}
              {...register('stateProvince')}
            />
          </div>

          {serverError && (
            <p role="alert" className="text-sm text-center text-[var(--color-danger)]">
              {serverError}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button type="button" variant="outline" onClick={goBack}>
              Voltar
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Finalizar
            </Button>
          </div>
        </>
      )}
    </form>
  )
}
