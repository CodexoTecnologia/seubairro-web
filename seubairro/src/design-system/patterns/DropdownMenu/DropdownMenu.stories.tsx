import type { Story } from '@ladle/react'
import { DropdownMenu } from './DropdownMenu'
import { Button } from '@/design-system/primitives/Button'

const meta = { title: 'Design System / Patterns / DropdownMenu' }
export default meta

export const Basic: Story = () => (
  <DropdownMenu trigger={<Button variant="outline">Abrir menu</Button>}>
    <DropdownMenu.Item icon={<i className="ri-user-line" />}>Meu perfil</DropdownMenu.Item>
    <DropdownMenu.Item icon={<i className="ri-settings-3-line" />}>Configurações</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item intent="danger" icon={<i className="ri-logout-box-r-line" />}>
      Sair
    </DropdownMenu.Item>
  </DropdownMenu>
)

export const WithLabelAndDisabled: Story = () => (
  <DropdownMenu trigger={<Button variant="outline">Conta</Button>} align="start">
    <DropdownMenu.Label>Trocar de espaço</DropdownMenu.Label>
    <DropdownMenu.Item icon={<i className="ri-user-heart-line" />}>Espaço Vizinho</DropdownMenu.Item>
    <DropdownMenu.Item icon={<i className="ri-store-2-line" />} disabled>
      Espaço Empreendedor (indisponível)
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item icon={<i className="ri-logout-box-r-line" />} intent="danger">
      Sair
    </DropdownMenu.Item>
  </DropdownMenu>
)
