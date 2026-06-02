'use client'

import { useEffect, useState } from 'react'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { AddressService } from '@/lib/api/services/AddressService'
import { authService } from '@/lib/api/services/(Auth)/AuthInstance'
import { CountryCodeEnum } from '@/lib/api/enums/CountryCodeEnum'
import type { AddressResponse } from '@/lib/api/dtos/Response/index'
import { Button } from '@/design-system/primitives/Button'
import { Input } from '@/design-system/primitives/Input'
import { Card } from '@/design-system/primitives/Card'
import { cn } from '@/lib/utils/cn'

type Tab = 'personal' | 'location' | 'security'
type Status = { kind: 'idle' } | { kind: 'error'; message: string } | { kind: 'success'; message: string }

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'personal', label: 'Dados Pessoais', icon: 'ri-user-settings-line' },
  { key: 'location', label: 'Meu Endereço', icon: 'ri-map-pin-line' },
  { key: 'security', label: 'Segurança', icon: 'ri-shield-key-line' },
]

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback
}

export default function ClientProfile() {
  const [activeTab, setActiveTab] = useState<Tab>('personal')
  const { user, logout } = useAuthContext()

  const fullName = user?.name ?? ''
  const initial = fullName.charAt(0).toUpperCase() || '?'
  const email = user?.email ?? ''

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 max-w-6xl mx-auto w-full">
      <aside className="flex flex-col gap-4">
        <Card variant="default" padding="md" className="flex flex-col items-center text-center gap-2">
          <div className="size-16 rounded-full bg-[var(--color-primary)] text-white text-2xl font-bold flex items-center justify-center">
            {initial}
          </div>
          <h3 className="font-semibold text-[var(--color-title)]">{fullName || 'Sem nome'}</h3>
          <span className="text-xs text-[var(--color-muted)]">{email}</span>
        </Card>

        <nav className="flex flex-col gap-1">
          {TABS.map((t) => {
            const active = activeTab === t.key
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTab(t.key)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-body)] hover:bg-[var(--color-page)]',
                )}
              >
                <i className={`${t.icon} text-lg`} />
                <span className="flex-1 text-left">{t.label}</span>
                <i className="ri-arrow-right-s-line" />
              </button>
            )
          })}
          <div className="h-px bg-[var(--color-border-default)] my-2" />
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-colors text-left"
          >
            <i className="ri-logout-box-r-line text-lg" />
            <span className="flex-1">Sair da conta</span>
          </button>
        </nav>
      </aside>

      <main>
        {activeTab === 'personal' && <PersonalTab name={fullName} email={email} />}
        {activeTab === 'location' && <LocationTab />}
        {activeTab === 'security' && <SecurityTab email={email} />}
      </main>
    </div>
  )
}

function StatusMessage({ status }: { status: Status }) {
  if (status.kind === 'idle') return null
  const isError = status.kind === 'error'
  return (
    <p
      role={isError ? 'alert' : 'status'}
      className={cn(
        'text-sm text-center',
        isError ? 'text-[var(--color-danger)]' : 'text-[var(--color-success)]',
      )}
    >
      <i className={cn('align-middle mr-1', isError ? 'ri-error-warning-line' : 'ri-checkbox-circle-line')} />
      {status.message}
    </p>
  )
}

function PersonalTab({ name, email }: { name: string; email: string }) {
  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-bold text-[var(--color-title)]">Dados Pessoais</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Seus dados de cadastro. A edição ainda não está disponível pela API.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nome Completo" defaultValue={name} disabled />
        <Input label="E-mail de Acesso" type="email" defaultValue={email} disabled />
      </div>
    </Card>
  )
}

type AddressForm = {
  postalCode: string
  city: string
  stateProvince: string
  street: string
  number: string
  neighborhood: string
}

const EMPTY_ADDRESS: AddressForm = {
  postalCode: '',
  city: '',
  stateProvince: '',
  street: '',
  number: '',
  neighborhood: '',
}

function LocationTab() {
  const [form, setForm] = useState<AddressForm>(EMPTY_ADDRESS)
  const [existing, setExisting] = useState<AddressResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  useEffect(() => {
    let cancelled = false
    AddressService.getMine()
      .then((list) => {
        if (cancelled) return
        const current = list[0] ?? null
        setExisting(current)
        if (current) {
          setForm({
            postalCode: current.postalCode ?? '',
            city: current.city ?? '',
            stateProvince: current.stateProvince ?? '',
            street: current.street ?? '',
            number: current.number ?? '',
            neighborhood: current.neighborhood ?? '',
          })
        }
      })
      .catch((err) => {
        if (cancelled) return
        console.error('[LocationTab] failed to fetch address:', err)
      })
      .finally(() => {
        if (!cancelled) setFetching(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const update =
    <K extends keyof AddressForm>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ kind: 'idle' })
    try {
      const payload = {
        street: form.street || null,
        number: form.number || null,
        neighborhood: form.neighborhood || null,
        city: form.city || null,
        stateProvince: form.stateProvince || null,
        postalCode: form.postalCode || null,
        countryCode: CountryCodeEnum.Brasil,
      }
      const saved = existing
        ? await AddressService.update(existing.id, payload)
        : await AddressService.create(payload)
      setExisting(saved)
      setStatus({ kind: 'success', message: existing ? 'Endereço atualizado!' : 'Endereço cadastrado!' })
    } catch (err) {
      setStatus({ kind: 'error', message: errorMessage(err, 'Erro ao salvar endereço.') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-bold text-[var(--color-title)]">Meu Endereço</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Defina onde você está para encontrar o melhor do bairro.
        </p>
      </header>
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="CEP"
            placeholder="00000-000"
            value={form.postalCode}
            onChange={update('postalCode')}
            disabled={fetching}
          />
          <Input
            label="Cidade"
            className="md:col-span-2"
            value={form.city}
            onChange={update('city')}
            disabled={fetching}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            label="Rua"
            className="md:col-span-3"
            value={form.street}
            onChange={update('street')}
            disabled={fetching}
          />
          <Input
            label="Número"
            value={form.number}
            onChange={update('number')}
            disabled={fetching}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-4">
          <Input
            label="Bairro"
            value={form.neighborhood}
            onChange={update('neighborhood')}
            disabled={fetching}
          />
          <Input
            label="Estado (UF)"
            maxLength={2}
            placeholder="PR"
            value={form.stateProvince}
            onChange={update('stateProvince')}
            disabled={fetching}
          />
        </div>
        <StatusMessage status={status} />
        <div className="flex justify-end">
          <Button type="submit" isLoading={loading} disabled={fetching}>
            {existing ? 'Atualizar Endereço' : 'Cadastrar Endereço'}
          </Button>
        </div>
      </form>
    </Card>
  )
}

function SecurityTab({ email }: { email: string }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus({ kind: 'idle' })
    if (newPassword.length < 6) {
      setStatus({ kind: 'error', message: 'A nova senha precisa ter ao menos 6 caracteres.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setStatus({ kind: 'error', message: 'A confirmação não confere com a nova senha.' })
      return
    }
    setLoading(true)
    try {
      await authService.resetPassword(oldPassword, newPassword)
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setStatus({ kind: 'success', message: 'Senha atualizada!' })
    } catch (err) {
      setStatus({ kind: 'error', message: errorMessage(err, 'Erro ao atualizar senha.') })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <header>
        <h1 className="text-xl font-bold text-[var(--color-title)]">Segurança</h1>
        <p className="text-sm text-[var(--color-muted)]">Proteja sua conta e altere sua senha.</p>
      </header>
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <Input label="E-mail de Acesso" type="email" defaultValue={email} readOnly />
        <div className="h-px bg-[var(--color-border-default)]" />
        <h3 className="text-sm font-semibold text-[var(--color-title)]">Alterar Senha</h3>
        <Input
          label="Senha atual"
          type="password"
          autoComplete="current-password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
        />
        <Input
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <StatusMessage status={status} />
        <div className="flex justify-end">
          <Button type="submit" variant="secondary" isLoading={loading}>
            Atualizar Senha
          </Button>
        </div>
      </form>
    </Card>
  )
}
