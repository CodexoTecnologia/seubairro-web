'use client'

import { useRouter } from 'next/navigation'
import { DropdownMenu } from '@/design-system/patterns'
import { useWorkspace } from '@/features/shared/hooks'
import { useAuthContext } from '@/features/auth/context/AuthContext'
import { ROLE_CUSTOMER, ROLE_ENTREPENEUR, type Workspace } from '@/lib/api/helper/RoleHelper'

const WORKSPACE_META: Record<Workspace, { label: string; icon: string }> = {
  client: { label: 'Espaço Vizinho', icon: 'ri-user-heart-line' },
  business: { label: 'Espaço Empreendedor', icon: 'ri-store-2-line' },
}

type Props = {
  /** Workspace da rota atual; omitido no contexto público (mostra todos). */
  activeWorkspace?: Workspace
}

export function WorkspaceSwitcher({ activeWorkspace }: Props) {
  const router = useRouter()
  const { roles } = useAuthContext()
  const { canSwitch, availableWorkspaces, switchWorkspace, activateCustomerRole, activateEntrepreneurRole } = useWorkspace()

  if (canSwitch) {
    const targets = availableWorkspaces.filter((workspace) => workspace !== activeWorkspace)
    if (targets.length === 0) return null

    return (
      <>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>
          <span className="uppercase text-[11px] font-bold text-[var(--color-muted)] tracking-wider">
            TROCAR DE ESPAÇO
          </span>
        </DropdownMenu.Label>
        {targets.map((workspace) => (
          <DropdownMenu.Item
            key={workspace}
            icon={<i className={WORKSPACE_META[workspace].icon} />}
            onSelect={() => switchWorkspace(workspace)}
          >
            {WORKSPACE_META[workspace].label}
          </DropdownMenu.Item>
        ))}
      </>
    )
  }

  const isCustomerOnly = roles.includes(ROLE_CUSTOMER) && !roles.includes(ROLE_ENTREPENEUR)
  const isEntrepreneurOnly = roles.includes(ROLE_ENTREPENEUR) && !roles.includes(ROLE_CUSTOMER)

  return (
    <>
      <DropdownMenu.Separator />
      {isCustomerOnly && (
        <DropdownMenu.Item
          icon={<i className="ri-store-2-line text-[var(--color-primary)] text-lg" />}
          onSelect={activateEntrepreneurRole}
        >
          <span className="font-semibold text-[var(--color-primary)]">
            Cadastrar minha empresa
          </span>
        </DropdownMenu.Item>
      )}

      {isEntrepreneurOnly && (
        <DropdownMenu.Item
          icon={<i className="ri-user-heart-line text-[var(--color-primary)] text-lg" />}
          onSelect={activateCustomerRole}
        >
          <span className="font-semibold text-[var(--color-primary)]">
            Ativar perfil de Vizinho
          </span>
        </DropdownMenu.Item>
      )}
    </>
  )
}
