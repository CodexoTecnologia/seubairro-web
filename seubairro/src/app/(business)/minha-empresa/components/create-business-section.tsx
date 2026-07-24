'use client'

import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BusinessService,
  type BusinessOwnerOverviewResponse,
} from '@/lib/api/services/BusinessService'
import { resolveApiErrorMessage } from '@/lib/api/helper/resolveApiError'
import { CountryCodeEnum } from '@/lib/api/enums/index/index'
import {
  businessWithAddressCreateSchema,
  type BusinessWithAddressCreateFormValues,
} from '@/features/business/schemas'
import { useCepLookup } from '@/features/client/hooks/useCepLookup'
import { Card } from '@/design-system/primitives/Card'
import { Button } from '@/design-system/primitives/Button'
import { Input } from '@/design-system/primitives/Input'
import { authService } from '@/lib/api/services/(Auth)/AuthInstance'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { cn } from '@/lib/utils/cn'

type Props = {
  onCreated: (overview: BusinessOwnerOverviewResponse) => void
}

type OnboardingStep = 1 | 2 | 3

const ERROR_MESSAGES: Record<string, string> = {
  BusinessAlreadyExists: 'Você já tem uma empresa cadastrada — recarregue a página.',
  BusinessNameRequired: 'O nome do negócio é obrigatório.',
  InvalidTaxId: 'CNPJ inválido.',
  TaxIdAlreadyInUse: 'Este CNPJ já está em uso por outra empresa.',
  InvalidPhoneFormat: 'Telefone fora do padrão (8 a 15 dígitos).',
  AddressRequired: 'O endereço da empresa é obrigatório.',
  Forbidden: 'Sua conta não pode criar uma empresa.',
}

export default function CreateBusinessSection({ onCreated }: Props) {
  const { refreshUser } = useAuthContext()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BusinessWithAddressCreateFormValues>({
    resolver: zodResolver(businessWithAddressCreateSchema),
    mode: 'onChange',
    defaultValues: {
      businessName: '',
      legalName: '',
      taxId: '',
      description: '',
      publicPhone: '',
      instagramUrl: '',
      postalCode: '',
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      stateProvince: '',
    },
  })

  // Observa os valores em tempo real para a prévia ao vivo
  const watchedValues = watch()

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

  // Valida os campos da etapa atual antes de avançar
  const handleNextStep = async () => {
    setServerError(null)
    let valid = false
    if (currentStep === 1) {
      valid = await trigger(['businessName', 'legalName', 'taxId', 'description'])
    } else if (currentStep === 2) {
      valid = await trigger(['publicPhone', 'instagramUrl'])
    }
    if (valid) {
      setCurrentStep((prev) => (prev + 1) as OnboardingStep)
    }
  }

  const handlePrevStep = () => {
    setServerError(null)
    setCurrentStep((prev) => (prev - 1) as OnboardingStep)
  }

  const stepEnteredAt = useRef<number>(Date.now())

  useEffect(() => {
    stepEnteredAt.current = Date.now()
  }, [currentStep])

  const submit = handleSubmit(async (values) => {
    if (currentStep < 3) {
      void handleNextStep()
      return
    }
    if (Date.now() - stepEnteredAt.current < 500) {
      return
    }
    setServerError(null)
    const payload = {
      businessName: values.businessName.trim(),
      legalName: values.legalName.trim(),
      taxId: values.taxId.replace(/\D/g, ''),
      description: values.description.trim(),
      logoUrl: null,
      coverImageUrl: null,
      publicPhone: values.publicPhone.trim(),
      phoneCountryCode: null,
      phoneNumber: null,
      instagramUrl: values.instagramUrl?.trim() || null,
      address: {
        street: values.street.trim(),
        number: values.number.trim(),
        neighborhood: values.neighborhood.trim(),
        city: values.city.trim(),
        stateProvince: values.stateProvince.trim().toUpperCase(),
        postalCode: values.postalCode.trim(),
        countryCode: CountryCodeEnum.Brasil,
      },
    }

    try {
      let overview: BusinessOwnerOverviewResponse | null = null
      try {
        overview = await BusinessService.createWithAddress(payload)
      } catch (err: any) {
        if (err?.error?.statusCode === 403 || err?.statusCode === 403) {
          await authService.addEntrepreneur()
          await refreshUser()
          overview = await BusinessService.createWithAddress(payload)
        } else {
          throw err
        }
      }

      if (!overview) {
        setServerError('Não foi possível criar a empresa agora. Tente novamente.')
        return
      }
      onCreated(overview)
    } catch (err) {
      setServerError(
        resolveApiErrorMessage(
          err,
          ERROR_MESSAGES,
          'Não foi possível criar a empresa agora. Tente novamente.',
        ),
      )
    }
  })

  // Formata o endereço da prévia
  const previewAddress = [
    watchedValues.neighborhood,
    watchedValues.city,
    watchedValues.stateProvince,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
      {/* Coluna Esquerda: Formulário de Onboarding Interativo em Etapas */}
      <Card padding="lg" className="flex flex-col gap-6 shadow-sm border border-[var(--color-border-default)]">
        <header className="flex items-center justify-between pb-4 border-b border-[var(--color-border-default)]">
          <div className="flex items-center gap-3">
            <span className="size-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-lg shadow-2xs">
              {currentStep}
            </span>
            <div className="flex flex-col">
              <h2 className="text-base font-bold text-[var(--color-title)]">
                {currentStep === 1 && 'Etapa 1 de 3: Identidade do Negócio'}
                {currentStep === 2 && 'Etapa 2 de 3: Contato & Redes'}
                {currentStep === 3 && 'Etapa 3 de 3: Endereço & Localização'}
              </h2>
              <p className="text-xs text-[var(--color-muted)]">
                {currentStep === 1 && 'Informe o nome fantasia, razão social, CNPJ e a história do seu comércio.'}
                {currentStep === 2 && 'Insira o telefone comercial/WhatsApp e Instagram para os clientes entrarem em contato.'}
                {currentStep === 3 && 'Cadastre o CEP e o endereço do estabelecimento para aparecer na busca do bairro.'}
              </p>
            </div>
          </div>

          {/* Badges dos Passos */}
          <div className="hidden sm:flex items-center gap-2">
            {[1, 2, 3].map((stepNum) => (
              <button
                key={stepNum}
                type="button"
                onClick={() => {
                  if (stepNum < currentStep) setCurrentStep(stepNum as OnboardingStep)
                }}
                disabled={stepNum > currentStep}
                className={cn(
                  'size-8 rounded-full text-xs font-bold transition-all flex items-center justify-center',
                  stepNum === currentStep
                    ? 'bg-[var(--color-primary)] text-white ring-4 ring-[var(--color-primary)]/20'
                    : stepNum < currentStep
                      ? 'bg-[var(--color-success-bg)] text-[var(--color-success)] cursor-pointer'
                      : 'bg-[var(--color-page)] text-[var(--color-muted)] opacity-50',
                )}
              >
                {stepNum < currentStep ? <i className="ri-check-line font-bold" /> : stepNum}
              </button>
            ))}
          </div>
        </header>

        <form onSubmit={submit} className="flex flex-col gap-6" noValidate>
          {/* ETAPA 1: Identidade */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Input
                label="Nome do Negócio (Nome Fantasia)"
                placeholder="Ex: Padaria do Carlos"
                error={errors.businessName?.message}
                {...register('businessName')}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Razão Social"
                  placeholder="Ex: Padaria Carlos LTDA"
                  error={errors.legalName?.message}
                  {...register('legalName')}
                />
                <Input
                  label="CNPJ"
                  placeholder="Somente números (14 dígitos)"
                  inputMode="numeric"
                  error={errors.taxId?.message}
                  {...register('taxId')}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="create-business-description"
                  className="text-sm font-medium text-[var(--color-title)] flex items-center justify-between"
                >
                  <span>Sobre o Negócio</span>
                  <span className="text-xs text-[var(--color-muted)] font-normal">Capriche na descrição</span>
                </label>
                <textarea
                  id="create-business-description"
                  rows={4}
                  placeholder="Descreva o que sua empresa oferece, seus diferenciais, horário de funcionamento ou produtos principais..."
                  className="rounded-lg bg-[var(--color-input)] border border-[var(--color-border-default)] p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                  {...register('description')}
                />
                {errors.description && (
                  <span className="text-xs text-[var(--color-danger)]">
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ETAPA 2: Contato & Redes */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <Input
                label="WhatsApp / Telefone Comercial Público"
                type="tel"
                inputMode="numeric"
                placeholder="11999999999"
                hint="Apenas dígitos (DDD + número). Este número receberá mensagens dos clientes."
                error={errors.publicPhone?.message}
                {...register('publicPhone')}
              />
              <Input
                label="Link do Instagram (Opcional)"
                placeholder="https://instagram.com/sualoja"
                hint="Adicione a URL completa para destacar no seu perfil público."
                error={errors.instagramUrl?.message}
                {...register('instagramUrl')}
              />
            </div>
          )}

          {/* ETAPA 3: Endereço */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="CEP"
                  placeholder="00000000"
                  inputMode="numeric"
                  maxLength={8}
                  autoComplete="postal-code"
                  hint={cepLoading ? 'Buscando endereço…' : 'Preenchemos rua, bairro e cidade automaticamente'}
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
                  className="md:col-span-2"
                  error={errors.city?.message}
                  {...register('city')}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="Rua / Logradouro"
                  className="md:col-span-3"
                  error={errors.street?.message}
                  {...register('street')}
                />
                <Input label="Número" placeholder="123" error={errors.number?.message} {...register('number')} />
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
                  placeholder="SP"
                  error={errors.stateProvince?.message}
                  {...register('stateProvince')}
                />
              </div>
            </div>
          )}

          {serverError && (
            <p role="alert" className="text-sm font-medium text-[var(--color-danger)] p-3 rounded-lg bg-[var(--color-danger-bg)] flex items-center gap-2">
              <i className="ri-error-warning-line text-lg shrink-0" />
              <span>{serverError}</span>
            </p>
          )}

          {/* Botões de Navegação entre Passos */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-default)] mt-2">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={handlePrevStep} leftIcon={<i className="ri-arrow-left-line" />}>
                Voltar
              </Button>
            ) : <div />}

            {currentStep < 3 ? (
              <Button type="button" onClick={handleNextStep} rightIcon={<i className="ri-arrow-right-line" />}>
                Próximo Passo
              </Button>
            ) : (
              <Button type="submit" isLoading={isSubmitting} leftIcon={<i className="ri-check-double-line" />}>
                {isSubmitting ? 'Criando empresa…' : 'Concluir & Criar Empresa'}
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Coluna Direita: Preview do Perfil da Empresa ao Vivo (Sticky Sidebar) */}
      <aside className="sticky top-24 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-muted)] uppercase tracking-wider">
          <i className="ri-eye-line text-[var(--color-primary)] text-sm" />
          <span>Prévia da Loja ao Vivo</span>
        </div>

        <Card padding="none" className="overflow-hidden border border-[var(--color-border-default)] shadow-md bg-[var(--color-surface)]">
          {/* Cover Header */}
          <div className="relative h-28 w-full bg-gradient-to-r from-[var(--color-primary)] to-emerald-600 flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/75 bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-xs">
              Prévia ao Vivo
            </span>
          </div>

          <div className="p-4 flex flex-col gap-3 relative pt-0">
            {/* Mock Store Icon */}
            <div className="-mt-8 size-14 rounded-xl bg-white border-2 border-white shadow-md flex items-center justify-center text-[var(--color-primary)] font-bold text-xl">
              <i className="ri-store-3-line" />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-base text-[var(--color-title)] line-clamp-1">
                {watchedValues.businessName?.trim() || 'Nome da sua empresa'}
              </h3>
              {watchedValues.legalName?.trim() && (
                <span className="text-[11px] text-[var(--color-muted)]">
                  {watchedValues.legalName}
                </span>
              )}
            </div>

            {watchedValues.description?.trim() ? (
              <p className="text-xs text-[var(--color-body)] leading-relaxed line-clamp-3 bg-[var(--color-page)] p-2.5 rounded-lg border border-[var(--color-border-default)]/60">
                {watchedValues.description}
              </p>
            ) : (
              <p className="text-xs text-[var(--color-muted)] italic">
                A descrição sobre o que você vende aparecerá aqui...
              </p>
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border-default)] text-xs">
              <div className="flex items-center gap-2 text-[var(--color-title)] font-medium">
                <i className="ri-map-pin-line text-[var(--color-primary)] text-sm shrink-0" />
                <span className="truncate">
                  {previewAddress || 'Endereço (Bairro, Cidade - UF)'}
                </span>
              </div>

              {watchedValues.publicPhone?.trim() && (
                <div className="flex items-center gap-2 text-[var(--color-success)] font-medium">
                  <i className="ri-whatsapp-line text-sm shrink-0" />
                  <span>{watchedValues.publicPhone}</span>
                </div>
              )}

              {watchedValues.instagramUrl?.trim() && (
                <div className="flex items-center gap-2 text-[var(--color-primary)] font-medium">
                  <i className="ri-instagram-line text-sm shrink-0" />
                  <span className="truncate">{watchedValues.instagramUrl}</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      </aside>
    </div>
  )
}
