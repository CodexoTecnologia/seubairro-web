'use client'

import { useState } from 'react'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { authService } from '@/lib/api/services/(Auth)/AuthInstance'
import { useCustomerProfile } from '@/features/client/hooks/useCustomerProfile'
import { useCustomerAddress } from '@/features/client/hooks/useCustomerAddress'
import { CustomerProfileForm } from '@/features/client/components/CustomerProfileForm'
import { CustomerAddressForm } from '@/features/client/components/CustomerAddressForm'
import { LocationSourceToggle } from '@/features/client/components/LocationSourceToggle'
import { Avatar } from '@/design-system/primitives/Avatar'
import { Button } from '@/design-system/primitives/Button'
import { Input } from '@/design-system/primitives/Input'
import { Card } from '@/design-system/primitives/Card'
import { Skeleton } from '@/design-system/primitives/Skeleton'
import { PageHeader } from '@/design-system/patterns/PageHeader'
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
  const { logout } = useAuthContext()
  const { profile, isLoading, error, updateProfile, uploadAvatar } = useCustomerProfile()

  const fullName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : ''
  const initials = profile
    ? `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase() || '?'
    : '?'
  const email = profile?.email ?? ''

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full">
      <PageHeader
        title="Meu Perfil"
        description="Seus dados, endereço e segurança da conta."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <aside className="flex flex-col gap-4">
        <Card variant="default" padding="md" className="flex flex-col items-center text-center gap-2">
          <Avatar
            src={profile?.profilePictureUrl ?? undefined}
            alt={fullName ? `Foto de ${fullName}` : 'Avatar do usuário'}
            fallback={initials}
            size="xl"
          />
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
                aria-current={active ? 'page' : undefined}
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
        {activeTab === 'personal' && (
          <PersonalTab
            isLoading={isLoading}
            error={error}
            profile={profile}
            updateProfile={updateProfile}
            uploadAvatar={uploadAvatar}
          />
        )}
        {activeTab === 'location' && <LocationTab />}
        {activeTab === 'security' && <SecurityTab email={email} />}
      </main>
      </div>
    </div>
  )
}

function StatusMessage({ status }: { status: Status }) {
  if (status.kind === 'idle') return null
  const isError = status.kind === 'error'
  return (
    <p
      role={isError ? 'alert' : 'status'}
      aria-live="polite"
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

type ProfileFormState = ReturnType<typeof useCustomerProfile>

function PersonalTab({
  isLoading,
  error,
  profile,
  updateProfile,
  uploadAvatar,
}: Pick<ProfileFormState, 'isLoading' | 'error' | 'profile' | 'updateProfile' | 'uploadAvatar'>) {
  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <header>
        <h2 className="text-section-title text-[var(--color-title)]">Dados Pessoais</h2>
        <p className="text-sm text-[var(--color-muted)]">Atualize seu nome, telefone e foto de perfil.</p>
      </header>
      {isLoading && <Skeleton variant="rect" height={280} />}
      {error && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {error.message}
        </p>
      )}
      {profile && (
        <CustomerProfileForm profile={profile} onSubmit={updateProfile} onUploadAvatar={uploadAvatar} />
      )}
    </Card>
  )
}

function LocationTab() {
  const { address, isLoading, error, save } = useCustomerAddress()
  return (
    <Card padding="lg" className="flex flex-col gap-5">
      <header>
        <h2 className="text-section-title text-[var(--color-title)]">Meu Endereço</h2>
        <p className="text-sm text-[var(--color-muted)]">
          Defina onde você está para encontrar o melhor do bairro.
        </p>
      </header>
      <LocationSourceToggle />
      <div className="h-px bg-[var(--color-border-default)]" />
      {isLoading && <Skeleton variant="rect" height={320} />}
      {error && (
        <p role="alert" className="text-sm text-[var(--color-danger)]">
          {error.message}
        </p>
      )}
      {!isLoading && <CustomerAddressForm address={address} onSave={save} />}
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
        <h2 className="text-section-title text-[var(--color-title)]">Segurança</h2>
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
