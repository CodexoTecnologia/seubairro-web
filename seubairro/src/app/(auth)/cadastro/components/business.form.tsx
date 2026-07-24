'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserService } from '@/lib/api/services/UserService'
import { authService } from '@/lib/api/services/(Auth)/AuthInstance'
import type { CreateEntrepeneurRequest } from '@/lib/api/dtos/Request/business/CreateEntrepeneurRequest'
import { CountryCodeEnum } from '@/lib/api/enums/CountryCodeEnum'
import { resolveApiErrorMessage } from '@/lib/api/helper/resolveApiError'
import { RoleHelper } from '@/lib/api/helper/RoleHelper'
import { BusinessSignupSchema, type BusinessSignupInput } from '@/features/auth/schemas'
import { Input } from '@/design-system/primitives/Input'
import { Button } from '@/design-system/primitives/Button'
import { cn } from '@/lib/utils/cn'

type Step = 1 | 2

const STEP_FIELDS: Record<Step, (keyof BusinessSignupInput)[]> = {
  1: ['fullName', 'email', 'birthDate', 'cpf', 'password', 'phoneCountryCode', 'phoneNumber'],
  2: ['postalCode', 'street', 'number', 'neighborhood', 'city', 'stateProvince'],
}

const STEP_LABELS: Record<Step, string> = {
  1: '1. Dados Pessoais',
  2: '2. Endereço',
}

const ERROR_MESSAGES: Record<string, string> = {
  AddressRequired: 'Informe seu endereço pessoal.',
  EmailAlreadyInUse: 'Este e-mail já está em uso.',
  InvalidPhoneFormat: 'Telefone fora do padrão (8 a 15 dígitos).',
  InvalidTaxId: 'CPF inválido.',
  InvalidEmailFormat: 'E-mail inválido.',
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
      phoneCountryCode: '55',
      phoneNumber: '',
      postalCode: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      stateProvince: '',
    },
  })

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = form

  const goNext = async () => {
    const ok = await trigger(STEP_FIELDS[step])
    if (!ok) return
    setStep((prev) => (prev === 2 ? 2 : ((prev + 1) as Step)))
  }

  const goBack = () => setStep((prev) => (prev === 1 ? 1 : ((prev - 1) as Step)))

  const onSubmit = handleSubmit(async (data) => {
    if (step < 2) {
      void goNext()
      return
    }
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
      phoneCountryCode: data.phoneCountryCode ? onlyDigits(data.phoneCountryCode) : null,
      phoneNumber: data.phoneNumber ? onlyDigits(data.phoneNumber) : null,
      address: {
        street: data.street,
        number: data.number,
        complement: data.complement?.trim() || null,
        neighborhood: data.neighborhood,
        city: data.city,
        stateProvince: data.stateProvince,
        postalCode: onlyDigits(data.postalCode),
        countryCode: CountryCodeEnum.Brasil,
      },
    }

    try {
      await UserService.registerEntrepeneur(request)
      await authService.login({ email: data.email, password: data.password })
      // O negócio é criado na etapa autenticada: o gate do dashboard leva o
      // empreendedor direto para o formulário de criação da empresa.
      router.push(RoleHelper.getRedirectPath())
    } catch (err) {
      setServerError(
        resolveApiErrorMessage(err, ERROR_MESSAGES, 'Erro ao criar conta. Verifique os dados.'),
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
        {([1, 2] as Step[]).map((s, i) => (
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
            {i < 1 && <span aria-hidden className="flex-1 h-px bg-[var(--color-border-default)]" />}
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
          <div className="grid grid-cols-[88px_1fr] gap-3">
            <Input
              label="DDI"
              inputMode="numeric"
              placeholder="55"
              maxLength={3}
              error={errors.phoneCountryCode?.message}
              {...register('phoneCountryCode')}
            />
            <Input
              label="Telefone (opcional)"
              type="tel"
              inputMode="numeric"
              placeholder="11999999999"
              autoComplete="tel"
              leftIcon={<i className="ri-phone-line" aria-hidden />}
              error={errors.phoneNumber?.message}
              {...register('phoneNumber')}
            />
          </div>
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
          <p className="text-xs text-[var(--color-muted)]">
            Informe seu <strong>endereço pessoal</strong>. O endereço da sua loja você cadastra
            depois, junto com o negócio.
          </p>
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
          <Input
            label="Complemento (opcional)"
            placeholder="Apto 12, bloco B…"
            error={errors.complement?.message}
            {...register('complement')}
          />
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
